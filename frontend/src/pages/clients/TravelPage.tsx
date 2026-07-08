import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TravelPage.css";
/* ================= TYPES ================= */

type Item = {
  _id:string;

  name?:string;
  title?:string;
  code?:string;

  price?:number;

  image?:string;
  images?:string[];

  city?:string;
  country?:string;

  destination?:{
    city?:string;
    country?:string;
  };

  hotel?:any;

  booking?:{
    _id:string;
  };
};



const api = axios.create({

  baseURL:"http://localhost:5000/api",
  withCredentials:true

});



api.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token");

  if(token){

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});




export default function TravelPage(){


const navigate = useNavigate();



const fallback =
"https://res.cloudinary.com/dgdemj83g/image/upload/v1782840633/CRI-IRC-4-3-EN_agfvjd.png";



const [offers,setOffers]=useState<Item[]>([]);
const [hotels,setHotels]=useState<Item[]>([]);
const [restaurants,setRestaurants]=useState<Item[]>([]);
const [circuits,setCircuits]=useState<Item[]>([]);
const [spa,setSpa]=useState<Item[]>([]);
const [destinations,setDestinations]=useState<Item[]>([]);
const [coupons,setCoupons]=useState<Item[]>([]);
const [agency,setAgency]=useState<Item[]>([]);



const [searchDestination,setSearchDestination]=useState("");

const [adults,setAdults]=useState(1);
const [children,setChildren]=useState(0);

const [departureDate,setDepartureDate]=useState("");
const [returnDate,setReturnDate]=useState("");

const [searchActive,setSearchActive]=useState(false);



const getData=(res:any)=>{


if(res.status!=="fulfilled")
return [];


const data=res.value?.data;



if(Array.isArray(data))
return data;



if(Array.isArray(data?.data))
return data.data;



return (

data?.offers ||
data?.hotels ||
data?.restaurants ||
data?.circuits ||
data?.spa ||
data?.spas ||
data?.destinations ||
data?.coupons ||
data?.agency ||
data?.agencies ||
[]

);


};

useEffect(()=>{


const load=async()=>{


const result = await Promise.allSettled([


api.get("/offers"),
api.get("/hotels"),
api.get("/restaurants"),
api.get("/circuits"),
api.get("/spa"),
api.get("/destinations"),
api.get("/coupons"),
api.get("/agency")


]);



setOffers(getData(result[0]));
setHotels(getData(result[1]));
setRestaurants(getData(result[2]));
setCircuits(getData(result[3]));
setSpa(getData(result[4]));
setDestinations(getData(result[5]));
setCoupons(getData(result[6]));
setAgency(getData(result[7]));



};



load();



},[]);

const normalizeType=(type:string)=>{


const map:any={

offers:"offers",
offer:"offers",

hotels:"hotels",
hotel:"hotels",

restaurants:"restaurants",
restaurant:"restaurants",

circuits:"circuits",
circuit:"circuits",

spa:"spa",

destinations:"destinations",
destination:"destinations",

coupons:"coupons",
coupon:"coupons",

agency:"agency",
agencies:"agency"

};



return map[type.toLowerCase()];


};



const handleReserve=(item:Item,type:string)=>{


if(!item._id)
return;



const finalType=normalizeType(type);



navigate(
`/reserve/${finalType}/${item._id}`,
{
state:{
service:item,
type:finalType
}
}

);



};


const handlePayment=async(bookingId:string)=>{


try{


const res = await api.post(
"/payments/checkout",
{
bookingId
}
);



if(res.data.url){

window.location.href=res.data.url;

}



}catch(error){

console.log(error);

}



};

const Card=({

item,
type

}:{

item:Item;
type:string;

})=>{


const img =
item.images?.[0] ||
item.image ||
item.hotel?.images?.[0] ||
fallback;



const title =
item.name ||
item.hotel?.name ||
item.code ||
"Service";



const bookingId=item.booking?._id;



return (


<div className="travel-card">

<img
className="travel-card-image"
src={img}
alt={title}
/>



<div className="travel-card-body">

<h3>
{title}
</h3>




{
item.price!==undefined &&

<p className="travel-price">

À partir de {item.price} TND

</p>

}

<button
className="reserve-btn"
onClick={()=>handleReserve(item,type)}
>
  Réserver
</button>

{

bookingId &&


<button
className="pay-btn"
onClick={()=>handlePayment(bookingId)}
>
💳 Payer
</button>

}

</div>

</div>


);

};


const Section=({

title,
data,
type

}:{

title:string;
data:Item[];
type:string;

})=>(


<section className="travel-section">


<h2>
{title}
</h2>



<div className="travel-grid">


{
data.map(item=>(

<Card

key={item._id}

item={item}

type={type}

/>

))

}

</div>

</section>

);

const filterData=(data:Item[])=>{


if(!searchActive)
return data;

return data.filter(item=>{


const city =
item.city ||
item.destination?.city ||
item.hotel?.city ||
"";



const country =
item.country ||
item.destination?.country ||
item.hotel?.country ||
"";



const location =
`${city} ${country}`.toLowerCase();



return location.includes(
searchDestination.toLowerCase()
);



});


};

const filteredOffers=filterData(offers);
const filteredHotels=filterData(hotels);
const filteredRestaurants=filterData(restaurants);
const filteredCircuits=filterData(circuits);
const filteredSpa=filterData(spa);
const filteredDestinations=filterData(destinations);
const filteredCoupons=filterData(coupons);
const filteredAgency=filterData(agency);


return (


<div className="travel-page">

  
<h1 className="page-title">
    🇹🇳 Tunisia Booking
</h1>

<button
className="chat-btn"
onClick={()=>navigate("/chat")}
>
  Chat
</button>

<div className="search-box">


<h2>
🔎 Rechercher votre voyage
</h2>


<input
className="search-input"
placeholder="🌍 Destination (Tunis, Paris, Egypt...)"
value={searchDestination}
onChange={(e)=>setSearchDestination(e.target.value)}
/>

<div className="search-grid">
<div>

<label>
  Date départ
</label>


<input
className="search-field"
type="date"
value={departureDate}
onChange={(e)=>setDepartureDate(e.target.value)}
/>

</div>

<div>

<label>
  Date retour
</label>



<input
className="search-field"
type="date"
value={returnDate}
onChange={(e)=>setReturnDate(e.target.value)}
/>
</div>
<div>
<label>
  Adultes
</label>
<input
className="small-field"
type="number"
min="1"
value={adults}
onChange={(e)=>setAdults(Number(e.target.value))}
/>
</div>
<div>
<label>
  Enfants
</label>
<input
className="small-field"
type="number"
min="0"
value={children}
onChange={(e)=>setChildren(Number(e.target.value))}
/>
</div>
</div>
<button
className="search-btn"
onClick={()=>setSearchActive(true)}
>
🔍 Rechercher
</button>
</div>
<Section
title="Meilleures offres"
data={filteredOffers}
type="offers"
/>

<Section
title="Hôtels"
data={filteredHotels}
type="hotels"
/>

<Section
title="Restaurants"
data={filteredRestaurants}
type="restaurants"
/>

<Section
title="Circuits"
data={filteredCircuits}
type="circuits"
/>

<Section
title="Spa"
data={filteredSpa}
type="spa"
/>
<Section
title="Destinations"
data={filteredDestinations}
type="destinations"
/>
<Section
title="Coupons"
data={filteredCoupons}
type="coupons"
/>

<Section
title="Agences"
data={filteredAgency}
type="agency"
/>

</div>

);

}