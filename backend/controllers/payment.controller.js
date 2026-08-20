import Stripe from "stripe";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ==================================================
// 1. CREATE STRIPE CHECKOUT SESSION
// ==================================================
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // ==============================================
    // VALIDATION BOOKING ID
    // ==============================================

    if (
      !bookingId ||
      !mongoose.Types.ObjectId.isValid(bookingId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid bookingId",
      });
    }

    // ==============================================
    // RÉCUPÉRER BOOKING
    // ==============================================

    const booking = await Booking.findById(
      bookingId
    ).populate("service");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==============================================
    // VÉRIFIER SERVICE
    // ==============================================

    if (!booking.service) {
      return res.status(400).json({
        success: false,
        message: "Service introuvable dans la réservation",
      });
    }

    // ==============================================
    // PRIX
    // ==============================================

    const price = Number(
      booking.totalPrice
    );

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    // ==============================================
    // NOM DU SERVICE
    // ==============================================

    const productName =
      booking.service.name ||
      booking.service.title ||
      "Travel Booking";

    // ==============================================
    // CRÉER STRIPE SESSION
    // ==============================================

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "eur",

              product_data: {
                name: productName,
              },

              unit_amount: Math.round(
                price * 100
              ),
            },

            quantity: 1,
          },
        ],

        metadata: {
          bookingId:
            booking._id.toString(),

          userId:
            booking.user.toString(),

          serviceId:
            booking.service._id.toString(),

          serviceType:
            booking.serviceType,
        },

        success_url:
          "http://localhost:5173/success?bookingId=" +
          booking._id,

        cancel_url:
          "http://localhost:5173/cancel",
      });

    // ==============================================
    // CRÉER PAYMENT PENDING DANS MONGODB
    // ==============================================

    await Payment.create({
      booking: booking._id,

      user: booking.user,

      service: booking.service._id,

      serviceType:
        booking.serviceType,

      amount: price,

      currency: "EUR",

      paymentMethod: "card",

      status: "pending",

      stripeSessionId: session.id,

      customerEmail:
        req.body.customerEmail || null,
    });

    // ==============================================
    // RETOURNER URL STRIPE
    // ==============================================

    return res.status(200).json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.error(
      "❌ Stripe Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// 2. STRIPE WEBHOOK
// ==================================================
export const stripeWebhook = async (
  req,
  res
) => {
  try {
    const signature =
      req.headers["stripe-signature"];

    // ==============================================
    // VÉRIFIER SIGNATURE STRIPE
    // ==============================================

    const event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

    // ==============================================
    // CHECKOUT TERMINÉ
    // ==============================================

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object;

      // ============================================
      // RÉCUPÉRER METADATA
      // ============================================

      const bookingId =
        session.metadata?.bookingId;

      const userId =
        session.metadata?.userId;

      const serviceId =
        session.metadata?.serviceId;

      const serviceType =
        session.metadata?.serviceType;

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message:
            "bookingId manquant dans metadata",
        });
      }

      // ============================================
      // RÉCUPÉRER BOOKING
      // ============================================

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking introuvable",
        });
      }

      // ============================================
      // UPDATE BOOKING
      // ============================================

      booking.paymentStatus =
        "paid";

      booking.status =
        "confirmed";

      // Sauvegarder éventuellement
      // l'ID de session Stripe

      booking.stripeSessionId =
        session.id;

      await booking.save();

      // ============================================
      // RÉCUPÉRER PAYMENT
      // ============================================

      let payment =
        await Payment.findOne({
          stripeSessionId:
            session.id,
        });

      // ============================================
      // SI PAYMENT EXISTE
      // ============================================

      if (payment) {

        payment.status =
          "paid";

        payment.stripePaymentIntentId =
          session.payment_intent ||
          null;

        payment.stripeCustomerId =
          session.customer ||
          null;

        payment.customerEmail =
          session.customer_details
            ?.email ||
          payment.customerEmail;

        payment.paidAt =
          new Date();

        await payment.save();

      } else {

        // ==========================================
        // SÉCURITÉ :
        // CRÉER PAYMENT SI ABSENT
        // ==========================================

        payment =
          await Payment.create({

            booking:
              booking._id,

            user:
              userId ||
              booking.user,

            service:
              serviceId ||
              booking.service,

            serviceType:
              serviceType ||
              booking.serviceType,

            amount:
              session.amount_total /
              100,

            currency:
              session.currency
                ?.toUpperCase() ||
              "EUR",

            paymentMethod:
              "card",

            status:
              "paid",

            stripeSessionId:
              session.id,

            stripePaymentIntentId:
              session.payment_intent ||
              null,

            stripeCustomerId:
              session.customer ||
              null,

            customerEmail:
              session.customer_details
                ?.email ||
              null,

            paidAt:
              new Date(),
          });
      }

      console.log(
        "✅ Payment success:",
        bookingId
      );
    }

    return res.json({
      received: true,
    });

  } catch (error) {

    console.error(
      "❌ Webhook Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// 3. CREATE PAYMENT MANUALLY
// ==================================================
export const createPayment = async (
  req,
  res
) => {
  try {

    const {
      booking,
      user,
      amount,
      currency,
      paymentMethod,
      customerEmail,

      chequeNumber,
      chequeBank,
      chequeDate,

      transactionReference,
    } = req.body;

    // ==============================================
    // VALIDATION
    // ==============================================

    if (
      !booking ||
      !user ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Booking, utilisateur et montant sont obligatoires",
      });
    }

    // ==============================================
    // RÉCUPÉRER BOOKING
    // ==============================================

    const bookingExists =
      await Booking.findById(
        booking
      );

    if (!bookingExists) {
      return res.status(404).json({
        success: false,
        message:
          "Réservation introuvable",
      });
    }

    // ==============================================
    // VÉRIFIER USER
    // ==============================================

    if (
      bookingExists.user.toString() !==
      user.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cet utilisateur ne correspond pas à la réservation",
      });
    }

    // ==============================================
    // VÉRIFIER SERVICE
    // ==============================================

    if (!bookingExists.service) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun service dans cette réservation",
      });
    }

    // ==============================================
    // CRÉER PAYMENT
    // ==============================================

    const payment =
      await Payment.create({

        booking:
          bookingExists._id,

        user:
          bookingExists.user,

        service:
          bookingExists.service,

        serviceType:
          bookingExists.serviceType,

        amount,

        currency:
          currency || "EUR",

        paymentMethod:
          paymentMethod || "card",

        status:
          "pending",

        customerEmail,

        // Chèque
        chequeNumber,

        chequeBank,

        chequeDate,

        // Virement
        transactionReference,
      });

    return res.status(201).json({
      success: true,
      message:
        "Paiement créé avec succès",

      data: payment,
    });

  } catch (error) {

    console.error(
      "❌ Erreur création paiement:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 4. GET ALL PAYMENTS
// ==================================================
export const getPayments = async (
  req,
  res
) => {
  try {

    const payments =
      await Payment.find()
        .populate(
          "user",
          "name email"
        )
        .populate("booking")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        payments.length,

      data:
        payments,
    });

  } catch (error) {

    console.error(
      "❌ Erreur récupération paiements:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 5. GET PAYMENT BY ID
// ==================================================
export const getPaymentById = async (
  req,
  res
) => {
  try {

    const payment =
      await Payment.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Paiement introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data:
        payment,
    });

  } catch (error) {

    console.error(
      "❌ Erreur récupération paiement:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 6. UPDATE PAYMENT
// ==================================================
export const updatePayment = async (
  req,
  res
) => {
  try {

    const {
      status,
      paymentMethod,

      chequeNumber,
      chequeBank,
      chequeDate,

      transactionReference,

      invoiceUrl,
      invoiceStatus,
    } = req.body;

    const payment =
      await Payment.findById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Paiement introuvable",
      });
    }

    // ==============================================
    // STATUS
    // ==============================================

    if (
      status !== undefined
    ) {

      payment.status =
        status;

      if (
        status === "paid" &&
        !payment.paidAt
      ) {
        payment.paidAt =
          new Date();
      }
    }

    // ==============================================
    // PAYMENT METHOD
    // ==============================================

    if (
      paymentMethod !== undefined
    ) {
      payment.paymentMethod =
        paymentMethod;
    }

    // ==============================================
    // CHEQUE
    // ==============================================

    if (
      chequeNumber !== undefined
    ) {
      payment.chequeNumber =
        chequeNumber;
    }

    if (
      chequeBank !== undefined
    ) {
      payment.chequeBank =
        chequeBank;
    }

    if (
      chequeDate !== undefined
    ) {
      payment.chequeDate =
        chequeDate;
    }

    // ==============================================
    // VIREMENT
    // ==============================================

    if (
      transactionReference !==
      undefined
    ) {
      payment.transactionReference =
        transactionReference;
    }

    // ==============================================
    // FACTURE
    // ==============================================

    if (
      invoiceUrl !== undefined
    ) {
      payment.invoiceUrl =
        invoiceUrl;
    }

    if (
      invoiceStatus !== undefined
    ) {
      payment.invoiceStatus =
        invoiceStatus;
    }

    await payment.save();

    return res.status(200).json({
      success: true,

      message:
        "Paiement mis à jour avec succès",

      data:
        payment,
    });

  } catch (error) {

    console.error(
      "❌ Erreur modification paiement:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 7. DELETE PAYMENT
// ==================================================
export const deletePayment = async (
  req,
  res
) => {
  try {

    const payment =
      await Payment.findByIdAndDelete(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Paiement introuvable",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Paiement supprimé avec succès",
    });

  } catch (error) {

    console.error(
      "❌ Erreur suppression paiement:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 8. PAYMENT STATISTICS
// ==================================================
export const getPaymentStats = async (
  req,
  res
) => {
  try {

    const totalPayments =
      await Payment.countDocuments();

    const paidPayments =
      await Payment.countDocuments({
        status: "paid",
      });

    const pendingPayments =
      await Payment.countDocuments({
        status: "pending",
      });

    const failedPayments =
      await Payment.countDocuments({
        status: "failed",
      });

    const refundedPayments =
      await Payment.countDocuments({
        status: "refunded",
      });

    // ==============================================
    // MÉTHODES DE PAIEMENT
    // ==============================================

    const stripePayments =
      await Payment.countDocuments({
        paymentMethod: "card",
      });

    const chequePayments =
      await Payment.countDocuments({
        paymentMethod: "cheque",
      });

    const transferPayments =
      await Payment.countDocuments({
        paymentMethod:
          "bank_transfer",
      });

    const cashPayments =
      await Payment.countDocuments({
        paymentMethod: "cash",
      });

    // ==============================================
    // CHIFFRE D'AFFAIRES
    // ==============================================

    const revenue =
      await Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenue.length > 0
        ? revenue[0].total
        : 0;

    // ==============================================
    // RESPONSE
    // ==============================================

    return res.status(200).json({

      success: true,

      data: {

        totalPayments,

        paidPayments,

        pendingPayments,

        failedPayments,

        refundedPayments,

        stripePayments,

        chequePayments,

        transferPayments,

        cashPayments,

        totalRevenue,
      },
    });

  } catch (error) {

    console.error(
      "❌ Erreur statistiques:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Erreur serveur",

      error:
        error.message,
    });
  }
};

// ==================================================
// 9. GENERATE INVOICE PDF
// ==================================================
export const generateInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email")
      .populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    // ==============================================
    // VÉRIFIER QUE LE PAIEMENT EST PAYÉ
    // ==============================================

    if (payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message:
          "La facture peut être générée uniquement pour un paiement payé",
      });
    }

    // ==============================================
    // CRÉER LE DOSSIER invoices
    // ==============================================

    const fs = await import("fs");
    const path = await import("path");

    const invoicesDir = path.join(
      process.cwd(),
      "uploads",
      "invoices"
    );

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, {
        recursive: true,
      });
    }

    // ==============================================
    // NOM DU FICHIER
    // ==============================================

    const fileName =
      `invoice-${payment._id}.pdf`;

    const filePath =
      path.join(
        invoicesDir,
        fileName
      );

    // ==============================================
    // CRÉER PDF
    // ==============================================

    const doc = new PDFDocument();

    const stream =
      fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ==============================================
    // CONTENU FACTURE
    // ==============================================

    doc
      .fontSize(24)
      .text("TRAVEL APP", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("FACTURE", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(12)
      .text(
        `Facture N° : ${payment._id}`
      );

    doc.text(
      `Date : ${
        new Date().toLocaleDateString("fr-FR")
      }`
    );

    doc.moveDown();

    // ==============================================
    // CLIENT
    // ==============================================

    doc
      .fontSize(14)
      .text("CLIENT");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text(
        `Nom : ${
          payment.user?.name || "Client"
        }`
      );

    doc.text(
      `Email : ${
        payment.user?.email ||
        payment.customerEmail ||
        "Non renseigné"
      }`
    );

    doc.moveDown();

    // ==============================================
    // PAIEMENT
    // ==============================================

    doc
      .fontSize(14)
      .text("DÉTAILS DU PAIEMENT");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text(
        `Montant : ${payment.amount} ${payment.currency}`
      );

    doc.text(
      `Méthode : ${payment.paymentMethod}`
    );

    doc.text(
      `Statut : ${payment.status}`
    );

    if (payment.paidAt) {
      doc.text(
        `Payé le : ${
          new Date(
            payment.paidAt
          ).toLocaleDateString("fr-FR")
        }`
      );
    }

    doc.moveDown();

    // ==============================================
    // BOOKING
    // ==============================================

    if (payment.booking) {
      doc
        .fontSize(14)
        .text("RÉSERVATION");

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .text(
          `Réservation : ${payment.booking._id}`
        );

      doc.text(
        `Type : ${
          payment.booking.serviceType ||
          "Travel"
        }`
      );

      doc.text(
        `Personnes : ${
          payment.booking.persons || 1
        }`
      );
    }

    doc.moveDown(2);

    doc
      .fontSize(12)
      .text(
        "Merci pour votre réservation.",
        {
          align: "center",
        }
      );

    // ==============================================
    // TERMINER PDF
    // ==============================================

    doc.end();

    // ==============================================
    // ATTENDRE LA FIN DE L'ÉCRITURE
    // ==============================================

    stream.on("finish", async () => {
      try {
        const invoiceUrl =
          `/uploads/invoices/${fileName}`;

        payment.invoiceUrl =
          invoiceUrl;

        payment.invoiceStatus =
          "generated";

        await payment.save();

        return res.status(200).json({
          success: true,
          message:
            "Facture générée avec succès",

          data: {
            paymentId:
              payment._id,

            invoiceStatus:
              payment.invoiceStatus,

            invoiceUrl,
          },
        });
      } catch (error) {
        console.error(
          "❌ Erreur sauvegarde facture :",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Erreur sauvegarde facture",
          error: error.message,
        });
      }
    });

    stream.on("error", (error) => {
      console.error(
        "❌ Erreur création PDF :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur création facture",
        error: error.message,
      });
    });

  } catch (error) {
    console.error(
      "❌ Erreur génération facture :",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};