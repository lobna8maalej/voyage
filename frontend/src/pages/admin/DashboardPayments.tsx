import { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardPayments.css";

/* =====================================================
   TYPE PAYMENT
===================================================== */

type User = {
  _id?: string;
  name?: string;
  email?: string;
};

type Service = {
  _id?: string;
  name?: string;
  title?: string;
};

type Payment = {
  _id: string;

  booking?: any;

  user?: User | string;

  service?: Service | string;

  serviceType?: string;

  amount?: number;

  currency?: string;

  paymentMethod?: string;

  status?: string;

  stripeSessionId?: string | null;

  stripePaymentIntentId?: string | null;

  stripeCustomerId?: string | null;

  receiptUrl?: string | null;

  customerEmail?: string;

  invoiceUrl?: string | null;

  invoiceStatus?: string;

  paidAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DashboardPayments() {

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );

  };

  /* =====================================================
     GET PAYMENTS
  ===================================================== */

  const fetchPayments = async () => {

    try {

      setLoading(true);

      setError("");

      const token = getToken();

      if (!token) {

        setError(
          "Token manquant. Veuillez vous connecter."
        );

        return;

      }

      console.log(
        "📥 GET /api/admin/payments"
      );

      const response = await axios.get(
        "http://localhost:5000/api/admin/payments",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "💳 PAYMENTS :",
        response.data
      );

      if (
        response.data?.success &&
        Array.isArray(
          response.data.data
        )
      ) {

        setPayments(
          response.data.data
        );

      } else {

        setPayments([]);

      }

    } catch (error: any) {

      console.error(
        "❌ Erreur paiements :",
        error.response?.data ||
        error.message
      );

      if (
        error.response?.status === 401
      ) {

        setError(
          "Token absent ou expiré."
        );

        return;

      }

      if (
        error.response?.status === 403
      ) {

        setError(
          "Accès refusé : administrateur uniquement."
        );

        return;

      }

      setError(
        error.response?.data?.message ||
        "Impossible de récupérer les paiements."
      );

    } finally {

      setLoading(false);

    }

  };

  /* =====================================================
     CHARGEMENT
  ===================================================== */

  useEffect(() => {

    fetchPayments();

  }, []);

  /* =====================================================
     CLIENT
  ===================================================== */

  const getClientName = (
    payment: Payment
  ) => {

    if (
      payment.user &&
      typeof payment.user === "object"
    ) {

      return (
        payment.user.name ||
        payment.user.email ||
        "Client"
      );

    }

    return (
      payment.customerEmail ||
      "Client"
    );

  };

  /* =====================================================
     EMAIL
  ===================================================== */

  const getClientEmail = (
    payment: Payment
  ) => {

    if (
      payment.user &&
      typeof payment.user === "object"
    ) {

      return (
        payment.user.email ||
        payment.customerEmail ||
        "-"
      );

    }

    return (
      payment.customerEmail ||
      "-"
    );

  };

  /* =====================================================
     SERVICE
  ===================================================== */

  const getServiceName = (
    payment: Payment
  ) => {

    if (
      payment.service &&
      typeof payment.service === "object"
    ) {

      return (
        payment.service.name ||
        payment.service.title ||
        "Service"
      );

    }

    return "Service";

  };

  /* =====================================================
     TYPE SERVICE
  ===================================================== */

  const getServiceType = (
    payment: Payment
  ) => {

    const type = (
      payment.serviceType ||
      ""
    )
      .toLowerCase()
      .trim();

    switch (type) {

      case "hotel":
        return "🏨 Hôtel";

      case "agency":
        return "🏢 Agence";

      case "circuit":
        return "🌍 Circuit";

      case "spa":
        return "💆 Spa";

      case "restaurant":
        return "🍽️ Restaurant";

      case "offer":
        return "🎁 Offre";

      default:
        return "🛎️ Service";

    }

  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatus = (
    payment: Payment
  ) => {

    const status =
      payment.status
        ?.toLowerCase()
        .trim();

    switch (status) {

      case "paid":
        return "Payé";

      case "pending":
        return "En attente";

      case "failed":
        return "Échoué";

      case "refunded":
        return "Remboursé";

      case "cancelled":
      case "canceled":
        return "Annulé";

      default:
        return (
          payment.status ||
          "Inconnu"
        );

    }

  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (
    payment: Payment
  ) => {

    switch (
      payment.status
        ?.toLowerCase()
        .trim()
    ) {

      case "paid":
        return "payment-paid";

      case "pending":
        return "payment-pending";

      case "failed":
        return "payment-failed";

      case "refunded":
        return "payment-refunded";

      case "cancelled":
      case "canceled":
        return "payment-cancelled";

      default:
        return "payment-unknown";

    }

  };

  /* =====================================================
     PAYMENT METHOD
  ===================================================== */

  const getPaymentMethod = (
    payment: Payment
  ) => {

    switch (
      payment.paymentMethod
        ?.toLowerCase()
    ) {

      case "card":
        return "💳 Carte";

      case "cash":
        return "💵 Espèces";

      case "cheque":
        return "🧾 Chèque";

      case "bank_transfer":
        return "🏦 Virement";

      default:
        return (
          payment.paymentMethod ||
          "-"
        );

    }

  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (
    date?: string | null
  ) => {

    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("fr-FR");

  };

  /* =====================================================
     STATISTIQUES
  ===================================================== */

  const totalPayments =
    payments.length;

  const pendingPayments =
    payments.filter(
      payment =>
        payment.status
          ?.toLowerCase() ===
        "pending"
    ).length;

  const paidPayments =
    payments.filter(
      payment =>
        payment.status
          ?.toLowerCase() ===
        "paid"
    ).length;

  const failedPayments =
    payments.filter(
      payment =>
        payment.status
          ?.toLowerCase() ===
        "failed"
    ).length;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="dashboard-payments">

        <h2>
          💳 Paiements
        </h2>

        <p>
          Chargement des paiements...
        </p>

      </div>
    );

  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (
      <div className="dashboard-payments">

        <h2>
          💳 Paiements
        </h2>

        <div className="payment-error">

          ❌ {error}

        </div>

        <button
          onClick={fetchPayments}
          className="btn-refresh"
        >
          🔄 Réessayer
        </button>

      </div>
    );

  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="dashboard-payments">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payments-header">

        <div>

          <h2>
            💳 Paiements
          </h2>

          <p>
            Gestion des paiements clients
          </p>

        </div>

        <button
          onClick={fetchPayments}
          className="btn-refresh"
        >
          🔄 Actualiser
        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="payment-stats">

        <div className="payment-stat-card">

          <span>💳</span>

          <strong>
            {totalPayments}
          </strong>

          <p>
            Total
          </p>

        </div>


        <div className="payment-stat-card">

          <span>⏳</span>

          <strong>
            {pendingPayments}
          </strong>

          <p>
            En attente
          </p>

        </div>


        <div className="payment-stat-card">

          <span>✅</span>

          <strong>
            {paidPayments}
          </strong>

          <p>
            Payés
          </p>

        </div>


        <div className="payment-stat-card">

          <span>❌</span>

          <strong>
            {failedPayments}
          </strong>

          <p>
            Échoués
          </p>

        </div>

      </div>


      {/* =================================================
          LISTE
      ================================================= */}

      {payments.length === 0 ? (

        <div className="no-payments">

          <div>
            💳
          </div>

          <h3>
            Aucun paiement
          </h3>

          <p>
            Aucun paiement trouvé.
          </p>

        </div>

      ) : (

        <div className="payments-list">

          {payments.map(
            (payment) => (

              <div
                className="payment-card"
                key={payment._id}
              >

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="payment-card-header">

                  <div>

                    <h3>
                      💳 Paiement
                    </h3>

                    <small>
                      ID : {payment._id}
                    </small>

                  </div>

                  <span
                    className={
                      `payment-status ${
                        getStatusClass(
                          payment
                        )}`
                    }
                  >
                    {getStatus(
                      payment
                    )}
                  </span>

                </div>


                {/* ======================================
                    CLIENT
                ====================================== */}

                <div className="payment-info">

                  <p>

                    👤{" "}

                    <strong>
                      Client :
                    </strong>{" "}

                    {getClientName(
                      payment
                    )}

                  </p>


                  <p>

                    📧{" "}

                    <strong>
                      Email :
                    </strong>{" "}

                    {getClientEmail(
                      payment
                    )}

                  </p>

                </div>


                {/* ======================================
                    SERVICE
                ====================================== */}

                <div className="payment-info">

                  <p>

                    🏨{" "}

                    <strong>
                      Service :
                    </strong>{" "}

                    {getServiceName(
                      payment
                    )}

                  </p>


                  <p>

                    📂{" "}

                    <strong>
                      Type :
                    </strong>{" "}

                    {getServiceType(
                      payment
                    )}

                  </p>

                </div>


                {/* ======================================
                    DETAILS
                ====================================== */}

                <div className="payment-details">

                  <div>

                    <span>
                      💰
                    </span>

                    <strong>
                      Montant
                    </strong>

                    <p>
                      {payment.amount}{" "}
                      {payment.currency}
                    </p>

                  </div>


                  <div>

                    <span>
                      💳
                    </span>

                    <strong>
                      Paiement
                    </strong>

                    <p>
                      {getPaymentMethod(
                        payment
                      )}
                    </p>

                  </div>


                  <div>

                    <span>
                      📌
                    </span>

                    <strong>
                      Statut
                    </strong>

                    <p>
                      {getStatus(
                        payment
                      )}
                    </p>

                  </div>


                  {/* ======================================
                      FACTURE
                  ====================================== */}

                  <div className="payment-info">

                    <span>
                      🧾 Facture
                    </span>

                    <strong
                      className={
                        payment.invoiceStatus ===
                        "generated"
                          ? "invoice-generated"
                          : "invoice-not-generated"
                      }
                    >
                      {payment.invoiceStatus ===
                      "generated"
                        ? "Générée"
                        : "Non générée"}
                    </strong>

                  </div>

                </div>


                {/* ======================================
                    MESSAGE FACTURE
                ====================================== */}

                {payment.invoiceStatus ===
                "generated" ? (

                  <div className="invoice-success">

                    <span>
                      📄
                    </span>

                    <div>

                      <strong>
                        Facture générée
                      </strong>

                      <p>
                        La facture est disponible
                        pour ce paiement.
                      </p>

                    </div>

                    {payment.invoiceUrl && (

                      <a
                        href={
                          payment.invoiceUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="invoice-button"
                      >
                        📄 Voir la facture
                      </a>

                    )}

                  </div>

                ) : (

                  <div className="invoice-warning">

                    ✨ Facture non générée

                  </div>

                )}


                {/* ======================================
                    STRIPE SESSION
                ====================================== */}

                <div className="stripe-info">

                  <strong>
                    🔐 Stripe Session ID
                  </strong>

                  <small>
                    {payment.stripeSessionId ||
                      "-"}
                  </small>

                </div>


                {/* ======================================
                    REÇU STRIPE
                ====================================== */}

                {payment.receiptUrl && (

                  <a
                    href={
                      payment.receiptUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="receipt-button"
                  >
                    🧾 Voir le reçu
                  </a>

                )}


                {/* ======================================
                    DATE
                ====================================== */}

                <div className="payment-date">

                  🕒{" "}

                  <strong>
                    Créé le :
                  </strong>{" "}

                  {formatDate(
                    payment.createdAt
                  )}

                </div>


                {payment.paidAt && (

                  <div className="payment-date">

                    ✅{" "}

                    <strong>
                      Payé le :
                    </strong>{" "}

                    {formatDate(
                      payment.paidAt
                    )}

                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}