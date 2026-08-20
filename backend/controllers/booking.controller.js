import Stripe from "stripe";
import crypto from "crypto";

import Booking from "../Models/Booking.js";

import Hotel from "../models/Hotel.js";
import Agency from "../models/Agency.js";
import Circuit from "../models/Circuit.js";

import { sendBookingEmail } from "../services/mail.service.js";
import { sendWhatsAppMessage } from "../services/twilio.service.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);


// =====================================================
// CREATE BOOKING
// POST /api/bookings
// =====================================================

export const createBooking = async (req, res) => {

  try {

    // ==========================================
    // DONNÉES DU FORMULAIRE
    // ==========================================

    const {
      serviceId,
      serviceType,
      persons,
      checkIn,
      checkOut,
      message,
    } = req.body;


    // ==========================================
    // CHOIX DU MODEL
    // ==========================================

    let Model = null;

    switch (serviceType) {

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
          success: false,
          message: "Invalid service type",
        });
    }


    // ==========================================
    // RÉCUPÉRER LE SERVICE
    // ==========================================

    const service =
      await Model.findById(serviceId);


    if (!service) {

      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }


    // ==========================================
    // VÉRIFIER LE PRIX
    // ==========================================

    const price =
      Number(service.price);


    if (isNaN(price)) {

      return res.status(400).json({

        success: false,

        message:
          "Le service ne contient pas de prix valide",

        service,
      });
    }


    // ==========================================
    // NOMBRE DE PERSONNES
    // ==========================================

    const numberOfPersons =
      Number(persons) || 1;


    // ==========================================
    // CRÉER LA RÉSERVATION
    // ==========================================

    const booking =
      await Booking.create({

        // CLIENT CONNECTÉ
        user: req.user.id,

        // SERVICE
        service: serviceId,

        serviceType,

        // INFORMATIONS RÉSERVATION
        persons: numberOfPersons,

        checkIn:
          checkIn || null,

        checkOut:
          checkOut || null,

        message:
          message || "",

        // PRIX
        totalPrice:
          price * numberOfPersons,

        // STATUT
        status: "pending",

        // PAIEMENT
        paymentStatus: "unpaid",

        // ADMIN
        adminViewed: false,

        // QR CODE
        qrToken:
          crypto.randomUUID(),
      });


    // ==========================================
    // RÉPONSE
    // ==========================================

    return res.status(201).json({

      success: true,

      message:
        "Réservation créée avec succès",

      booking,
    });


  } catch (error) {

    console.error(
      "❌ CREATE BOOKING ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// ADMIN : TOUTES LES RÉSERVATIONS
// GET /api/bookings
// =====================================================

export const getBookings = async (req, res) => {

  try {

    const bookings =
      await Booking.find()

        .populate("service")

        .populate(
          "user",
          "name email phone"
        )

        .sort({
          createdAt: -1,
        });


    return res.json({

      success: true,

      data: bookings,
    });


  } catch (error) {

    console.error(
      "❌ GET BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// CLIENT : MES RÉSERVATIONS
// GET /api/bookings/my
// =====================================================

export const getMyBookings = async (
  req,
  res
) => {

  try {

    const bookings =
      await Booking.find({
        user: req.user.id,
      })

        .populate("service")

        .populate(
          "user",
          "name email phone"
        )

        .sort({
          createdAt: -1,
        });


    return res.json({

      success: true,

      data: bookings,
    });


  } catch (error) {

    console.error(
      "❌ GET MY BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// CHECK-IN QR
// POST /api/bookings/checkin
// =====================================================

export const checkInBooking = async (
  req,
  res
) => {

  try {

    const {
      qrToken,
    } = req.body;


    const booking =
      await Booking.findOne({
        qrToken,
      })

        .populate("service")

        .populate(
          "user",
          "name email phone"
        );


    if (!booking) {

      return res.status(404).json({

        success: false,

        message: "Invalid QR",
      });
    }


    // ==========================================
    // VÉRIFIER LE PAIEMENT
    // ==========================================

    if (
      booking.paymentStatus !== "paid"
    ) {

      return res.status(403).json({

        success: false,

        message: "Payment required",
      });
    }


    // ==========================================
    // CHECK-IN
    // ==========================================

    booking.status =
      "checked-in";


    await booking.save();


    return res.json({

      success: true,

      message:
        "Check-in effectué avec succès",

      booking,
    });


  } catch (error) {

    console.error(
      "❌ CHECK-IN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// STRIPE CHECKOUT
// POST /api/bookings/checkout
// =====================================================

export const createCheckout = async (
  req,
  res
) => {

  try {

    const {
      bookingId,
    } = req.body;


    // ==========================================
    // RÉCUPÉRER LA RÉSERVATION
    // ==========================================

    const booking =
      await Booking.findById(
        bookingId
      )
        .populate("service");


    if (!booking) {

      return res.status(404).json({

        success: false,

        message:
          "Booking not found",
      });
    }


    // ==========================================
    // VÉRIFIER QUE LA RÉSERVATION APPARTIENT
    // AU CLIENT CONNECTÉ
    // ==========================================

    if (
      booking.user.toString() !==
      req.user.id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Accès refusé à cette réservation",
      });
    }


    const service =
      booking.service;


    // ==========================================
    // STRIPE
    // ==========================================

    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: [
          "card",
        ],

        mode: "payment",

        customer_email:
          req.user.email,

        line_items: [

          {

            price_data: {

              currency: "eur",

              product_data: {

                name:
                  service.name,

                description:
                  service.description || "",
              },

              unit_amount:
                Math.round(
                  Number(
                    booking.totalPrice
                  ) * 100
                ),
            },

            quantity: 1,
          },
        ],


        // ==================================
        // METADATA
        // ==================================

        metadata: {

          bookingId:
            booking._id.toString(),
        },


        // ==================================
        // URLS
        // ==================================

        success_url:
          `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,

        cancel_url:
          `${process.env.FRONTEND_URL}/payment-cancel`,
      });


    return res.json({

      success: true,

      url: session.url,
    });


  } catch (error) {

    console.error(
      "❌ STRIPE CHECKOUT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// STRIPE WEBHOOK
// =====================================================

export const stripeWebhook = async (
  req,
  res
) => {

  const sig =
    req.headers[
      "stripe-signature"
    ];


  let event;


  // ==========================================
  // VÉRIFICATION STRIPE
  // ==========================================

  try {

    event =
      stripe.webhooks.constructEvent(

        req.body,

        sig,

        process.env
          .STRIPE_WEBHOOK_SECRET
      );

  } catch (error) {

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }


  try {

    // ========================================
    // PAIEMENT TERMINÉ
    // ========================================

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object;


      const bookingId =
        session.metadata.bookingId;


      // ======================================
      // METTRE À JOUR LA RÉSERVATION
      // ======================================

      const booking =
        await Booking.findByIdAndUpdate(

          bookingId,

          {

            paymentStatus: "paid",

            status: "confirmed",

            stripeSessionId:
              session.id,
          },

          {
            new: true,
          }

        )

          .populate("service")

          .populate(
            "user",
            "name email phone"
          );


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }


      // ======================================
      // EMAIL
      // ======================================

      try {

        await sendBookingEmail(
          booking
        );

      } catch (e) {

        console.log(
          "Email error",
          e.message
        );
      }


      // ======================================
      // WHATSAPP
      // ======================================

      try {

        if (
          booking.service?.phone
        ) {

          await sendWhatsAppMessage(

            booking.service.phone,

            `Booking confirmed : ${booking.service.name}`
          );
        }

      } catch (e) {

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


    return res.json({
      received: true,
    });


  } catch (error) {

    console.error(
      "❌ STRIPE WEBHOOK ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// =====================================================
// ADMIN : MARQUER UNE RÉSERVATION COMME VUE
// PUT /api/bookings/:id/viewed
// =====================================================

export const markBookingAsViewed = async (
  req,
  res
) => {

  try {

    const {
      id,
    } = req.params;


    const booking =
      await Booking.findByIdAndUpdate(

        id,

        {
          adminViewed: true,
        },

        {
          new: true,
        }

      )

        .populate("service")

        .populate(
          "user",
          "name email phone"
        );


    if (!booking) {

      return res.status(404).json({

        success: false,

        message:
          "Réservation introuvable",
      });
    }


    return res.json({

      success: true,

      message:
        "Réservation marquée comme vue",

      booking,
    });


  } catch (error) {

    console.error(
      "❌ MARK BOOKING VIEWED ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};