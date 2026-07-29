import Stripe from "stripe";
import crypto from "crypto";

import Booking from "../models/Booking.js";

import Hotel from "../models/Hotel.js";
import Agency from "../models/Agency.js";
import Circuit from "../models/Circuit.js";

import { sendBookingEmail } from "../services/mail.service.js";
import { sendWhatsAppMessage } from "../services/twilio.service.js";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);



//
// CREATE BOOKING
//
export const createBooking = async (req, res) => {

try {

const {
  serviceId,
  serviceType,
  persons
} = req.body;


let Model = null;


switch(serviceType){

  case "Hotel":
    Model = Hotel;
    break;


  case "Agency":
    Model = Agency;
    break;


  case "Circuit":
    Model = Circuit;
    break;


  default:
    return res.status(400).json({
      message:"Invalid service type"
    });

}



const service = await Model.findById(serviceId);



if(!service){

 return res.status(404).json({
   message:"Service not found"
 });

}



const price = Number(service.price);

if (isNaN(price)) {
  return res.status(400).json({
    message: "Le service ne contient pas de prix valide",
    service
  });
}

const booking = await Booking.create({

  user: req.user.id,

  service: serviceId,

  serviceType,

  persons: Number(persons) || 1,

  totalPrice: price * (Number(persons) || 1),

  status: "pending",

  paymentStatus: "unpaid",

  qrToken: crypto.randomUUID()

});



return res.status(201).json({
 success:true,
 booking
});


}
catch(error){

return res.status(500).json({
 message:error.message
});

}

};

export const getBookings = async(req,res)=>{

try{


const bookings =
await Booking.find()

.populate("service")

.populate(
"user",
"name email"
);



res.json(bookings);



}catch(error){

res.status(500).json({
message:error.message
});

}

};

export const getMyBookings = async(req,res)=>{

try{


const bookings =
await Booking.find({
user:req.user.id
})

.populate("service")

.populate(
"user",
"name email"
);



res.json(bookings);



}catch(error){

res.status(500).json({
message:error.message
});

}

};

export const checkInBooking = async(req,res)=>{


try{


const {
qrToken
}=req.body;



const booking =
await Booking.findOne({
qrToken
})
.populate("service");



if(!booking){

return res.status(404).json({
message:"Invalid QR"
});

}



if(
booking.paymentStatus!=="paid"
){

return res.status(403).json({
message:"Payment required"
});

}

booking.status="checked-in";


await booking.save();



res.json({
success:true,
booking
});



}catch(error){

res.status(500).json({
message:error.message
});

}

};
export const createCheckout = async(req,res)=>{


try{


const {
bookingId
}=req.body;



const booking =
await Booking.findById(bookingId)
.populate("service");



if(!booking){

return res.status(404).json({
message:"Booking not found"
});

}




const service =
booking.service;



const session =
await stripe.checkout.sessions.create({


payment_method_types:[
"card"
],


mode:"payment",


customer_email:
req.user.email,



line_items:[

{

price_data:{


currency:"eur",


product_data:{


name:
service.name,


description:
service.description || ""

},


unit_amount:
Math.round(
 Number(booking.totalPrice) * 100
)


},


quantity:1


}

],



metadata:{


bookingId:
booking._id.toString()


},



success_url:
`${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,



cancel_url:
`${process.env.FRONTEND_URL}/payment-cancel`



});



res.json({
url:session.url
});



}catch(error){

res.status(500).json({
message:error.message
});

}

};







//
// STRIPE WEBHOOK
//
export const stripeWebhook = async(req,res)=>{


const sig =
req.headers["stripe-signature"];


let event;



try{


event =
stripe.webhooks.constructEvent(

req.body,

sig,

process.env.STRIPE_WEBHOOK_SECRET

);



}catch(error){


return res.status(400).send(
`Webhook Error: ${error.message}`
);


}



try{


if(
event.type==="checkout.session.completed"
){


const session =
event.data.object;



const bookingId =
session.metadata.bookingId;



const booking =
await Booking.findByIdAndUpdate(

bookingId,


{

paymentStatus:"paid",

status:"confirmed",

stripeSessionId:
session.id

},


{
new:true
}

)
.populate("service");




if(!booking){

return res.status(404).json({
message:"Booking not found"
});

}



try{

await sendBookingEmail(
booking
);


}catch(e){

console.log(
"Email error",
e.message
);

}




try{


if(
booking.service?.phone
){


await sendWhatsAppMessage(

booking.service.phone,


`Booking confirmed : ${booking.service.name}`

);


}



}catch(e){

console.log(
"WhatsApp error",
e.message
);

}



console.log(
"✅ BOOKING PAID",
booking._id
);



}




res.json({
received:true
});



}catch(error){

res.status(500).json({
message:error.message
});

}

};