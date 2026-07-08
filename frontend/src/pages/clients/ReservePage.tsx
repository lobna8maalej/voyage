import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../admin/axios";
import "./ReservePage.css";


const FALLBACK =
"https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";



export default function ReservePage(){


  const { type, id } = useParams();

  const navigate = useNavigate();



  const [service,setService] = useState<any>(null);

  const [error,setError] = useState("");



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





  useEffect(()=>{


    const fetchService = async()=>{


      try{


        const endpoint =
        map[type?.toLowerCase() || ""];



        if(!endpoint){

          setError(
            "Type invalide : " + type
          );

          return;

        }



        const res = await api.get(
          `${endpoint}/${id}`
        );



        const data =

          res.data?.offer ||
          res.data?.hotel ||
          res.data?.restaurant ||
          res.data?.spa ||
          res.data?.destination ||
          res.data?.coupon ||
          res.data?.agency ||
          res.data?.circuit ||
          res.data;



        setService(data);



      }
      catch(error){


        console.log(error);

        setError(
          "Service introuvable"
        );


      }


    };



    if(type && id){

      fetchService();

    }


  },[type,id]);






  if(error){

    return(
      <p style={{color:"red"}}>
        {error}
      </p>
    );

  }





  if(!service){

    return(
      <p>
        Chargement...
      </p>
    );

  }
  const contact =

    service?.hotel ||
    service?.restaurant ||
    service?.spa ||
    service?.agency ||
    service?.contact ||
    null;

  return(


  <div className="reserve-page">


    <div className="reserve-card">



      <img

        className="reserve-image"

        src={

          service?.images?.[0] ||

          service?.image ||

          contact?.images?.[0] ||

          FALLBACK

        }

        alt="service"

      />

      <div className="reserve-content">



        <h1 className="reserve-title">

          {
            service?.name ||
            service?.title ||
            "Service"
          }

        </h1>

        <p className="reserve-location">

          📍

          {
            contact?.city ||
            service?.destination?.city ||
            "Tunis"
          }


        </p>






        <p className="reserve-description">

          {
            service?.description ||
            service?.destination?.description ||
            contact?.description ||
            "Description non disponible"
          }


        </p>

        {
          (service?.price || contact?.price) &&


          <div className="reserve-price">

            💰

            {
              service?.price ||
              contact?.price
            }

            TND

          </div>

        }

        <button

          className="reserve-btn"

          onClick={()=>

            navigate(
              `/availability/${type}/${id}`
            )

          }

        >

          👁 Voir disponibilité


        </button>



        <div className="booking-box">


        </div>

        {
          contact &&


          <div className="contact-box">


            <h3 className="contact-title">

              📞 Contacter le service

            </h3>

            {
              contact.name &&


              <div className="contact-item">

                
                <strong>

                  {contact.name}

                </strong>


              </div>

            }

            {
              contact.phone &&


              <div className="contact-item">

                📱

                <a href={`tel:${contact.phone}`}>

                  {contact.phone}

                </a>


              </div>


            }

            {
              contact.email &&


              <div className="contact-item">

                

                <a href={`mailto:${contact.email}`}>

                  {contact.email}

                </a>


              </div>


            }

            {
              contact.website &&


              <div className="contact-item">

                


                <a

                  href={contact.website}

                  target="_blank"

                  rel="noreferrer"

                >

                  Visiter le site

                </a>


              </div>


            }



            {
              contact.openingHours &&


              <div className="contact-item">

                🕒

                {contact.openingHours}


              </div>


            }





          </div>



        }


        <button

          className="back-btn"

          onClick={()=>

            navigate(-1)

          }

        >

          ⬅ Retour

        </button>





      </div>



    </div>



  </div>


  );


}

