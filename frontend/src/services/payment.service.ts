import api from "../pages/admin/axios";

export const createCheckoutSession = async (bookingId: string) => {
  try {
    const res = await api.post("/payment/create-checkout-session", {
      bookingId,
    });

    return res.data.url;
  } catch (error) {
    console.log("PAYMENT ERROR:", error);
    throw error;
  }
};