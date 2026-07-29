import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TravelPage.css";


/* ================= TYPES ================= */

type Item = {
  _id: string;

  name?: string;
  title?: string;
  description?: string;

  price?: number;

  image?: string;
  images?: string[];
  imageUrl?: string;
  logo?: string;
  photo?: string;
  cover?: string;

  city?: string;
  country?: string;
};


type ServiceType =
  | "hotel"
  | "agency"
  | "circuit"
  | "restaurant"
  | "spa"
  | "destination"
  | "offer"
  | "coupon";



/* ================= API ================= */

const api = axios.create({

  baseURL:
    "http://localhost:5000/api",

  withCredentials:true,

});


api.interceptors.request.use(
(config)=>{

  const token =
    localStorage.getItem("token");


  if(token){

    config.headers.Authorization =
      `Bearer ${token}`;

  }


  return config;

});




export default function TravelPage(){


const navigate = useNavigate();



/* ================= STATES ================= */


const [hotels,setHotels] =
useState<Item[]>([]);

const [agency,setAgency] =
useState<Item[]>([]);

const [circuits,setCircuits] =
useState<Item[]>([]);

const [restaurants,setRestaurants] =
useState<Item[]>([]);

const [spa,setSpa] =
useState<Item[]>([]);

const [destinations,setDestinations] =
useState<Item[]>([]);

const [offers,setOffers] =
useState<Item[]>([]);

const [coupons,setCoupons] =
useState<Item[]>([]);



const [search,setSearch] =
useState("");

const [adults,setAdults] =
useState<number>(1);

const [children,setChildren] =
useState<number>(0);

const [departureDate,setDepartureDate] =
useState("");



const handleLogout = ()=>{

 localStorage.removeItem("token");
 localStorage.removeItem("user");

 navigate("/login");

};

const getArray = (response:any): Item[] => {


  if(Array.isArray(response.data)){
    return response.data;
  }


  if(Array.isArray(response.data.data)){
    return response.data.data;
  }


  if(Array.isArray(response.data.hotels)){
    return response.data.hotels;
  }


  if(Array.isArray(response.data.agency)){
    return response.data.agency;
  }


  if(Array.isArray(response.data.agencies)){
    return response.data.agencies;
  }


  if(Array.isArray(response.data.circuits)){
    return response.data.circuits;
  }


  if(Array.isArray(response.data.restaurants)){
    return response.data.restaurants;
  }


  if(Array.isArray(response.data.spas)){
    return response.data.spas;
  }


  if(Array.isArray(response.data.destinations)){
    return response.data.destinations;
  }


  if(Array.isArray(response.data.offers)){
    return response.data.offers;
  }


  if(Array.isArray(response.data.coupons)){
    return response.data.coupons;
  }


  return [];

};




/* ================= LOAD DATA ================= */


useEffect(()=>{


const loadData = async()=>{


try{


const [
 hotelsRes,
 agencyRes,
 circuitsRes,
 restaurantsRes,
 spaRes,
 destinationsRes,
 offersRes,
 couponsRes

] = await Promise.all([


api.get("/hotels"),

api.get("/agency"),

api.get("/circuits"),

api.get("/restaurants"),

api.get("/spa"),

api.get("/destinations"),

api.get("/offers"),

api.get("/coupons"),


]);



setHotels(
 getArray(hotelsRes)
);


setAgency(
 getArray(agencyRes)
);


setCircuits(
 getArray(circuitsRes)
);


setRestaurants(
 getArray(restaurantsRes)
);


setSpa(
 getArray(spaRes)
);


setDestinations(
 getArray(destinationsRes)
);


setOffers(
 getArray(offersRes)
);


setCoupons(
 getArray(couponsRes)
);



console.log(
"DATA HOTELS",
getArray(hotelsRes)
);


console.log(
"DATA AGENCY",
getArray(agencyRes)
);


console.log(
"DATA CIRCUITS",
getArray(circuitsRes)
);



}catch(error){

console.log(
"Erreur API :",
error
);

}


};



loadData();


},[]);






/* ================= STRIPE PAYMENT ================= */


const handlePayment = async(
item:Item,
type:string
)=>{


try{


const token =
localStorage.getItem("token");



if(!token){

alert(
"Vous devez être connecté."
);

navigate("/login");

return;

}




let serviceType = "";



switch(type){


case "hotel":

case "hotels":

serviceType="Hotel";

break;



case "agency":

case "agencies":

serviceType="Agency";

break;



case "circuit":

case "circuits":

serviceType="Circuit";

break;



default:


alert(
"Paiement indisponible pour ce service : "
+ type
);


return;


}




console.log(
"TYPE :",
type
);


console.log(
"SERVICE ID :",
item._id
);





// Création Booking

const bookingResponse =
await api.post(

"/bookings",

{

serviceId:item._id,

serviceType,

persons:1

},


{

headers:{

Authorization:
`Bearer ${token}`

}

}


);





const bookingId =
bookingResponse.data.booking?._id;




if(!bookingId){


alert(
"Booking introuvable."
);


return;


}




console.log(
"BOOKING ID :",
bookingId
);







// Création Stripe Checkout


const paymentResponse =
await api.post(

"/payments/checkout",

{

bookingId

},


{

headers:{

Authorization:
`Bearer ${token}`

}

}

);






console.log(
"STRIPE :",
paymentResponse.data
);






if(paymentResponse.data.url){


window.location.href =
paymentResponse.data.url;



}else{


alert(
"URL Stripe introuvable."
);


}



}catch(error:any){


console.error(

"Erreur paiement :",

error.response?.data ||
error.message

);


}


};

  
/* ================= SEARCH ================= */


const filterData = (
  items: Item[]
): Item[] => {


  if(!Array.isArray(items)){
    return [];
  }



  if(search.trim() === ""){
    return items;
  }



  return items.filter((item)=>{


    const text = `

    ${item.name || ""}

    ${item.title || ""}

    ${item.city || ""}

    ${item.country || ""}

    ${item.description || ""}

    `.toLowerCase();



    return text.includes(
      search.toLowerCase()
    );


  });


};






/* ================= IMAGE ================= */


const getImage = (
 item:Item
)=>{


return (

item.images?.[0]

||

item.image

||

item.imageUrl

||

item.logo

||

item.photo

||

item.cover

||

"https://res.cloudinary.com/dgdemj83g/image/upload/v1782930952/european-best-destinations-2023-tossa-de-mar_p6sq4y.jpg"

);


};







/* ================= CARD ================= */


const Card = ({

item,

type,

handlePayment


}:{

item:Item;

type:ServiceType;


handlePayment:
(
 item:Item,
 type:string
)=>void;


})=>{


const navigate =
useNavigate();



return (

<div className="travel-card">



<img

className="travel-image"

src={getImage(item)}

alt={
item.name ||
item.title ||
"Travel"
}


onError={(e)=>{


e.currentTarget.src =

"https://res.cloudinary.com/dgdemj83g/image/upload/v1784476115/il_570xN.1736956593_bmtu_sgked6.jpg";


}}


/>






<div className="travel-card-body">





<h3>

{
item.name ||
item.title ||
"Service"
}

</h3>






{
(item.city || item.country)
&&

<p>

📍

{item.city}

{" "}

{item.country}


</p>

}







{
item.description &&

<p className="travel-description">

{item.description}

</p>

}







<p className="travel-price">


{

item.price && item.price > 0

?

`💰 ${item.price} TND`

:

"Prix sur demande"


}


</p>









<div className="travel-buttons">






<button

className="reserve-btn"

onClick={()=>


navigate(
`/reserve/${type}/${item._id}`
)


}

>

Réserver

</button>








{


(

type==="hotel"

||

type==="agency"

||

type==="circuit"

)

&&


<button

className="pay-btn"

onClick={()=>


handlePayment(
item,
type
)

}

>

💳 Payer

</button>


}




</div>






</div>





</div>

);


};

/* ================= SECTION ================= */


const Section = ({

title,

data,

type,

handlePayment


}:{

title:string;

data:Item[];

type:ServiceType;


handlePayment:

(

item:Item,

type:string

)=>void;


})=>{


const items = filterData(data);



if(items.length === 0){

return null;

}





return (

<section className="travel-section">



<h2>

{title}

</h2>





<div className="travel-grid">



{

items.map((item)=>


<Card

key={item._id}

item={item}

type={type}

handlePayment={handlePayment}


/>


)


}




</div>





</section>


);


};

return (

<div className="travel-page">



<header className="travel-header">


<h1>
🌍 Travel App
</h1>




<div className="header-buttons">


<button

className="chat-btn"

onClick={()=>navigate("/chat")}

>

💬 Chat

</button>




<button

className="logout-btn"

onClick={handleLogout}

>

🚪 Logout

</button>



</div>



</header>






<div className="search-box">



<input

type="text"

placeholder="Rechercher destination..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

/>





<input

type="number"

min="1"

placeholder="Nombre d'adultes"

value={adults}

onChange={(e)=>
setAdults(
Number(e.target.value)
)
}

/>





<input

type="number"

min="0"

placeholder="Nombre d'enfants"

value={children}

onChange={(e)=>
setChildren(
Number(e.target.value)
)
}

/>






<input

type="date"

value={departureDate}

onChange={(e)=>
setDepartureDate(
e.target.value
)
}

/>




</div>







<Section

title="🏨 Hôtels"

data={hotels}

type="hotel"

handlePayment={handlePayment}

/>






<Section

title="✈ Agences"

data={agency}

type="agency"

handlePayment={handlePayment}

/>






<Section

title="🌍 Circuits"

data={circuits}

type="circuit"

handlePayment={handlePayment}

/>






<Section

title="🍽 Restaurants"

data={restaurants}

type="restaurant"

handlePayment={handlePayment}

/>






<Section

title="🧖 Spa"

data={spa}

type="spa"

handlePayment={handlePayment}

/>






<Section

title="📍 Destinations"

data={destinations}

type="destination"

handlePayment={handlePayment}

/>






<Section

title="🎯 Offres"

data={offers}

type="offer"

handlePayment={handlePayment}

/>






<Section

title="🎟 Coupons"

data={coupons}

type="coupon"

handlePayment={handlePayment}

/>





</div>


);

}