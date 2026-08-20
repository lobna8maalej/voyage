import { useEffect, useState } from "react";
import api from "./axios";
import DashboardNavbar from "./DashboardNavbar";
import "./Revenue.css";

type Payment = {
  id?: string;
  _id?: string;

  amount?: number;

  currency?: string;

  status?: string;

  created?: number;

  createdAt?: string;

  customer_email?: string;

  email?: string;
};

const Revenue = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // GET PAYMENTS
  // =====================================================

  useEffect(() => {

    fetchPayments();

  }, []);


  const fetchPayments = async () => {

    try {

      setLoading(true);

      setError("");

      console.log(
        "💳 Récupération des paiements..."
      );

      const response =
        await api.get("/admin/payments");

      console.log(
        "💳 PAYMENTS API :",
        response.data
      );


      // =================================================
      // ADAPTATION RÉPONSE API
      // =================================================

      const data =
        response.data?.data ||
        response.data?.payments ||
        response.data ||
        [];


      setPayments(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err: any) {

      console.error(
        "❌ PAYMENTS ERROR :",
        err.response?.data ||
        err.message
      );

      setError(
        err.response?.data?.message ||
        "Impossible de récupérer les paiements."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // MONTANT
  // =====================================================

  const getAmount = (
    payment: Payment
  ) => {

    if (
      typeof payment.amount !== "number"
    ) {
      return 0;
    }

    /*
      Stripe utilise généralement
      le montant dans la plus petite
      unité monétaire.

      Exemple :
      5000 = 50.00 USD
    */

    return payment.amount / 100;

  };


  // =====================================================
  // CURRENCY
  // =====================================================

  const getCurrency = (
    payment: Payment
  ) => {

    return (
      payment.currency ||
      "USD"
    ).toUpperCase();

  };


  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (
    payment: Payment
  ) => {

    return (
      payment.status ||
      "unknown"
    );

  };


  // =====================================================
  // DATE
  // =====================================================

  const getDate = (
    payment: Payment
  ) => {

    if (payment.created) {

      return new Date(
        payment.created * 1000
      ).toLocaleDateString(
        "fr-FR"
      );

    }


    if (payment.createdAt) {

      return new Date(
        payment.createdAt
      ).toLocaleDateString(
        "fr-FR"
      );

    }


    return "-";

  };


  // =====================================================
  // TOTAL REVENUE
  // =====================================================

  const totalRevenue =
    payments.reduce(
      (total, payment) =>
        total +
        getAmount(payment),
      0
    );


  // =====================================================
  // PAID PAYMENTS
  // =====================================================

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status === "succeeded" ||
        payment.status === "paid"
    ).length;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <>
        <DashboardNavbar />

        <div className="revenue-page">

          <h1>
            💰 Revenue Dashboard
          </h1>

          <p>
            Chargement des paiements...
          </p>

        </div>
      </>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <>
        <DashboardNavbar />

        <div className="revenue-page">

          <h1>
            💰 Revenue Dashboard
          </h1>

          <div className="revenue-error">

            ❌ {error}

          </div>

          <button
            onClick={fetchPayments}
            className="refresh-button"
          >
            🔄 Réessayer
          </button>

        </div>
      </>
    );

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <>

      <DashboardNavbar />


      <div className="revenue-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="revenue-header">

          <div>

            <h1>
              💰 Revenue Dashboard
            </h1>

            <p>
              Suivi des paiements et des revenus
              de votre plateforme
            </p>

          </div>


          <button
            onClick={fetchPayments}
            className="refresh-button"
          >
            🔄 Actualiser
          </button>

        </div>


        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <div className="revenue-stats">


          {/* TOTAL REVENUE */}

          <div className="revenue-card">

            <span className="revenue-icon">
              💰
            </span>

            <div>

              <strong>
                {totalRevenue.toFixed(2)}
              </strong>

              <p>
                Revenue total USD
              </p>

            </div>

          </div>


          {/* PAYMENTS */}

          <div className="revenue-card">

            <span className="revenue-icon">
              💳
            </span>

            <div>

              <strong>
                {payments.length}
              </strong>

              <p>
                Paiements
              </p>

            </div>

          </div>


          {/* SUCCESSFUL */}

          <div className="revenue-card">

            <span className="revenue-icon">
              ✅
            </span>

            <div>

              <strong>
                {successfulPayments}
              </strong>

              <p>
                Paiements réussis
              </p>

            </div>

          </div>


        </div>


        {/* =================================================
            PAYMENTS
        ================================================= */}

        <div className="payments-section">

          <div className="section-header">

            <div>

              <h2>
                💳 Paiements
              </h2>

              <p>
                Historique des transactions
              </p>

            </div>

          </div>


          {/* =================================================
              AUCUN PAIEMENT
          ================================================= */}

          {payments.length === 0 ? (

            <div className="empty-payments">

              <div>
                💳
              </div>

              <h3>
                Aucun paiement
              </h3>

              <p>
                Les paiements effectués
                apparaîtront ici.
              </p>

            </div>

          ) : (

            <div className="payments-table-container">

              <table className="payments-table">

                <thead>

                  <tr>

                    <th>
                      Transaction
                    </th>

                    <th>
                      Montant
                    </th>

                    <th>
                      Devise
                    </th>

                    <th>
                      Statut
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {payments.map(
                    (payment) => (

                      <tr
                        key={
                          payment.id ||
                          payment._id
                        }
                      >

                        {/* ID */}

                        <td>

                          <strong>

                            {(
                              payment.id ||
                              payment._id ||
                              "-"
                            ).slice(0, 18)}

                          </strong>

                        </td>


                        {/* AMOUNT */}

                        <td>

                          <strong className="amount">

                            {getAmount(
                              payment
                            ).toFixed(2)}

                          </strong>

                        </td>


                        {/* CURRENCY */}

                        <td>

                          {getCurrency(
                            payment
                          )}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              `payment-status ${
                                getStatus(
                                  payment
                                )
                                  .toLowerCase()
                              }`
                            }
                          >

                            {getStatus(
                              payment
                            )}

                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          {getDate(
                            payment
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </>

  );

};


export default Revenue;