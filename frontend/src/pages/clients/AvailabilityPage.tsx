import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../admin/axios";
import "./AvailabilityPage.css";


const FALLBACK =
"https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";


export default function AvailabilityPage(){


  const {type,id}=useParams();


  const [service,setService]=useState<any>(null);

  const [activeTab,setActiveTab]=useState("photos");

  const [currentImage,setCurrentImage]=useState(0);



  const map:Record<string,string>={

    offers:"/offers",
    offer:"/offers",

    hotels:"/hotels",
    hotel:"/hotels",

    restaurants:"/restaurants",
    restaurant:"/restaurants",

    circuits:"/circuits",
    circuit:"/circuits",

    spa:"/spa",

    destinations:"/destinations",
    destination:"/destinations",

    coupons:"/coupons",
    coupon:"/coupons",

    agency:"/agency",
    agencies:"/agency"

  };



  const getPresentation=(type:string)=>{

    switch(type?.toLowerCase()){


      case "hotel":
      case "hotels":
        return "Hôtel confortable avec services premium et emplacement idéal.";


      case "restaurant":
      case "restaurants":
        return "Restaurant avec cuisine locale et internationale.";


      case "spa":
        return "Spa avec soins relaxants, hammam et massage.";


      case "circuit":
      case "circuits":
        return "Circuit touristique organisé avec guide et transport.";


      case "agency":
      case "agencies":
        return "Agence spécialisée dans l'organisation des voyages.";


      case "destination":
      case "destinations":
        return "Destination touristique avec paysages magnifiques.";


      default:
        return "Service touristique avec une expérience unique.";

    }

  };




  useEffect(()=>{


    const fetchService=async()=>{


      try{


        const endpoint=map[type || ""];


        if(!endpoint)
          return;



        const res=await api.get(
          `${endpoint}/${id}`
        );



        const data =

          res.data?.offer ||
          res.data?.hotel ||
          res.data?.restaurant ||
          res.data?.spa ||
          res.data?.circuit ||
          res.data?.destination ||
          res.data?.agency ||
          res.data?.coupon ||
          res.data;



        setService(data);



      }
      catch(error){

        console.log(error);

      }


    };



    if(type && id){

      fetchService();

    }


  },[type,id]);





  const serviceImages = Array.from(

    new Set(

      [

        ...(service?.images || []),

        service?.image,

        ...(service?.hotel?.images || [])

      ].filter(Boolean)

    )

  );






  useEffect(()=>{


    if(serviceImages.length<=1)
      return;



    const timer=setTimeout(()=>{


      setCurrentImage(prev=>

        prev===serviceImages.length-1

        ?

        0

        :

        prev+1

      );


    },3000);



    return ()=>clearTimeout(timer);



  },[currentImage,serviceImages.length]);





  if(!service)

    return <p>Loading...</p>;






return(

<div className="availability-page">


<div className="availability-card">



{/* ================= CAROUSEL ================= */}


<div className="carousel">


<img

src={
serviceImages.length
?
serviceImages[currentImage]
:
FALLBACK
}

alt="service"

/>



{
serviceImages.length>1 &&

<>


<button

className="carousel-btn left"

onClick={()=>


setCurrentImage(

currentImage===0

?

serviceImages.length-1

:

currentImage-1

)


}

>

❮

</button>





<button

className="carousel-btn right"

onClick={()=>


setCurrentImage(

currentImage===serviceImages.length-1

?

0

:

currentImage+1

)


}

>

❯

</button>


</>


}



</div>





<div className="availability-content">



<h1 className="availability-title">

{

service?.name ||

service?.hotel?.name ||

service?.code ||

"Service"

}

</h1>




<p className="availability-location">

📍

{

service?.city ||

service?.hotel?.city ||

service?.country ||

"Tunis"

}

</p>






{

(service?.price || service?.hotel?.price)

?

<div className="availability-price">

💰 À partir de {

service?.price ||

service?.hotel?.price

} TND

</div>

:

<p className="price-request">

Prix sur demande

</p>

}




{/* ================= TABS ================= */}


<div className="tabs">


<button

className={activeTab==="photos"?"tab-btn active":"tab-btn"}

onClick={()=>setActiveTab("photos")}

>

📸 Photos

</button>



<button

className={activeTab==="presentation"?"tab-btn active":"tab-btn"}

onClick={()=>setActiveTab("presentation")}

>

📌 Présentation

</button>



<button

className={activeTab==="equipements"?"tab-btn active":"tab-btn"}

onClick={()=>setActiveTab("equipements")}

>

🛏 Équipements

</button>




<button

className={activeTab==="avis"?"tab-btn active":"tab-btn"}

onClick={()=>setActiveTab("avis")}

>

⭐ Avis

</button>


</div>






{/* ================= PHOTOS ================= */}



{
activeTab==="photos" &&


<div className="thumbnails">


{

(serviceImages.length ? serviceImages : [FALLBACK])

.map((img:string,index:number)=>(


<img

key={index}

src={img}

alt="photo"

onClick={()=>setCurrentImage(index)}

className={

currentImage===index

?

"active"

:

""

}

/>


))


}


</div>


}







{/* ================= PRESENTATION ================= */}



{
activeTab==="presentation" &&


<div className="presentation">


<h2>

📌 Présentation

</h2>


<p>

{

service?.description ||

getPresentation(type || "")

}

</p>


</div>


}







{/* ================= EQUIPEMENTS ================= */}



{
activeTab==="equipements" &&


<div className="equipements">


<h2>

🛏 Équipements

</h2>


<ul>

<li>✔ WiFi gratuit</li>

<li>✔ Climatisation</li>

<li>✔ Piscine</li>

<li>✔ Restaurant</li>

<li>✔ Spa</li>

</ul>


</div>


}






{/* ================= AVIS ================= */}



{
activeTab==="avis" &&


<div className="avis">


<h2>

⭐ Avis clients

</h2>



<div className="review">

<strong>

Amine ⭐⭐⭐⭐⭐

</strong>


<p>

Excellent service, personnel accueillant et très professionnel.

</p>


</div>





<div className="review">

<strong>

Sara ⭐⭐⭐⭐

</strong>


<p>

Très bonne expérience, je recommande vivement cet établissement.

</p>


</div>





<div className="review">

<strong>

Youssef ⭐⭐⭐⭐

</strong>


<p>

Bon rapport qualité/prix, service rapide et cadre agréable.

</p>


</div>


</div>


}



</div>


</div>


</div>


);


}