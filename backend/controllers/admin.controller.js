import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPayments = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 20,
    });

    res.json(payments.data);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};