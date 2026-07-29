import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

export const aiChat = async (req, res) => {

  try {

    const { userId, message } = req.body;


    const msg = message.toLowerCase();



    let response = "";



    // ================= BOOKINGS =================

    if (
      msg.includes("book") ||
      msg.includes("booking") ||
      msg.includes("réservation") ||
      msg.includes("reservation")
    ) {


      const bookings = await Booking.find({ user:userId })
        .populate("service");



      if(bookings.length === 0){

        response =
        "📌 Vous n'avez aucune réservation actuellement.";

      }

      else {


        response = bookings.map((b)=>{


          return `

📌 Réservation :

🏨 Service :
${b.service?.name || "Service"}

📍 Statut :
${b.status || "En attente"}

💳 Paiement :
${b.paymentStatus || "Non payé"}

💰 Total :
${b.totalPrice || 0} TND

`;

        }).join("\n");


      }



    }



    // ================= PAYMENTS =================


    else if (

      msg.includes("payment") ||
      msg.includes("paiement")

    ) {



      const payments = await Payment.find({user:userId})
      .populate("services");



      if(payments.length === 0){


        response =
        "💳 Aucun paiement trouvé.";


      }

      else {


        response = payments.map((p)=>{


          const services =

          (p.services || [])
          .map(s=>s?.name)
          .join(", ");



          return `

💳 Paiement :

Statut :
${p.status}

Montant :
${p.amount} TND

Services :
${services || "N/A"}

`;

        }).join("\n");

      }



    }



    // ================= HOTELS =================


    else if (

      msg.includes("hotel") ||
      msg.includes("hôtel")

    ){


      response =

`🏨 Voici les hôtels disponibles :


🏨 Dar El Medina Tunis

📍 Tunis

💰 200 TND



🏨 Paris Eiffel Luxury Hotel

📍 Paris

💰 120 TND



🏨 Istanbul Bosphorus Hotel

📍 Istanbul

💰 110 TND



Voulez-vous réserver un hôtel ?`;



    }





    // ================= SPA =================


    else if (

      msg.includes("spa") ||
      msg.includes("massage") ||
      msg.includes("sauna")

    ){



      response =

`💆 Services Spa disponibles :


🏨 Dar El Medina Tunis Spa


✅ Massage

✅ Sauna


💰 À partir de 110 TND


Voulez-vous voir les disponibilités ?`;



    }




    // ================= RESTAURANTS =================


    else if (

      msg.includes("restaurant") ||
      msg.includes("resto")

    ){



      response =

`🍽️ Restaurants disponibles :


🍽️ Dar El Jeld

📍 Tunis


🍽️ Le Gourmet Paris

📍 Paris


Voulez-vous choisir un restaurant ?`;



    }





    // ================= CIRCUITS =================


    else if (

      msg.includes("circuit") ||
      msg.includes("tour")

    ){



      response =

`🌍 Circuits disponibles :


🇹🇳 Best Tunisia Tour

💰 1200 TND



🇹🇷 Best Turkey Tour

💰 1400 TND



🇪🇬 Best Egypt Tour

💰 1300 TND`;



    }




    // ================= DESTINATIONS =================


    else if (

      msg.includes("destination") ||
      msg.includes("voyage") ||
      msg.includes("pays")

    ){


      response =

`📍 Destinations disponibles :


🇹🇳 Tunis

🇫🇷 Paris

🇹🇷 Istanbul

🇪🇬 Cairo

🇮🇪 Dublin


Quelle destination vous intéresse ?`;



    }




    // ================= DEFAULT =================


    else {


      response =

`👋 Bonjour ! Je suis Tunisia Booking AI Assistant.


Je peux vous aider à trouver :


🏨 Hôtels

✈️ Agences de voyage

🌍 Circuits

🍽 Restaurants

💆 Spa

📍 Destinations

🎯 Offres


Exemple :

"Je cherche un hôtel à Tunis"

ou

"Je veux un circuit en Turquie"`;


    }




    return res.json({

      response

    });



  }

  catch(err){


    console.error(err);


    return res.status(500).json({

      message:err.message

    });


  }


};