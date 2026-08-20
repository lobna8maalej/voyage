import { useState } from "react";
import axios from "axios";
import "./DashboardQR.css";
/* =====================================================
   TYPE VERIFICATION RESULT
===================================================== */

type VerificationResult = {
  success?: boolean;
  message?: string;

  data?: {
    booking?: {
      _id?: string;
      user?: {
        name?: string;
        email?: string;
      };
      service?: {
        name?: string;
      };
      date?: string;
      status?: string;
    };

    payment?: {
      status?: string;
    };
  };
};


/* =====================================================
   DASHBOARD QR
===================================================== */

export default function DashboardQR() {

  const [scannedCode, setScannedCode] =
    useState<string>("");

  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");


  /* =====================================================
     VERIFY QR CODE
  ===================================================== */

  const verifyQRCode = async () => {

    if (!scannedCode.trim()) {

      setError(
        "Veuillez saisir ou scanner un QR Code."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      setVerificationResult(null);


      /* ================================================
         TOKEN
      ================================================= */

      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Token manquant. Veuillez vous connecter."
        );

        return;
      }


      /* ================================================
         VERIFY QR
      ================================================= */

      const response =
        await axios.post<VerificationResult>(
          "http://localhost:5000/api/qr/verify",
          {
            qrCode: scannedCode.trim()
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      console.log(
        "✅ QR vérifié :",
        response.data
      );


      setVerificationResult(
        response.data
      );


    } catch (error: any) {

      console.error(
        "❌ Erreur vérification QR :",
        error.response?.data ||
        error.message
      );


      setError(
        error.response?.data?.message ||
        "QR Code invalide ou impossible à vérifier."
      );


    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     RESET
  ===================================================== */

  const resetVerification = () => {

    setScannedCode("");

    setVerificationResult(null);

    setError("");

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="dashboard-qr">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-qr-header">

        <div>

          <h1>
            📱 Gestion QR Codes
          </h1>

          <p>
            Vérifiez rapidement une réservation
            à partir de son QR Code.
          </p>

        </div>

      </div>


      {/* =================================================
          VERIFY CARD
      ================================================= */}

      <div className="qr-verify-card">

        <h2>
          🔍 Vérifier une réservation
        </h2>

        <p>
          Saisissez le code du QR Code
          ou utilisez votre scanner.
        </p>


        <div className="qr-input-group">

          <label>
            QR Code
          </label>

          <input
            type="text"
            value={scannedCode}
            onChange={(event) =>
              setScannedCode(
                event.target.value
              )
            }
            placeholder="Exemple : QR-BOOKING-8F72A91C"
          />

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="qr-actions">

          <button
            type="button"
            onClick={verifyQRCode}
            disabled={loading}
            className="verify-qr-btn"
          >

            {loading
              ? "⏳ Vérification..."
              : "🔍 Vérifier le QR"}

          </button>


          <button
            type="button"
            onClick={resetVerification}
            className="reset-qr-btn"
          >
            🔄 Réinitialiser
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="qr-error">

            ❌ {error}

          </div>

        )}

      </div>


      {/* =================================================
          RESULT
      ================================================= */}

      {verificationResult && (

        <div className="qr-result-card">

          <div className="qr-result-header">

            <h2>
              {verificationResult.success
                ? "✅ QR Code valide"
                : "⚠️ Vérification"}
            </h2>

          </div>


          {verificationResult.message && (

            <p className="qr-result-message">

              {verificationResult.message}

            </p>

          )}


          {/* =================================================
              BOOKING
          ================================================= */}

          {verificationResult.data?.booking && (

            <div className="qr-booking-info">

              <h3>
                📋 Réservation
              </h3>


              <div className="qr-info-grid">

                <div>

                  <strong>
                    👤 Client
                  </strong>

                  <span>
                    {
                      verificationResult
                        .data
                        .booking
                        .user
                        ?.name ||
                      "Non renseigné"
                    }
                  </span>

                </div>


                <div>

                  <strong>
                    📧 Email
                  </strong>

                  <span>
                    {
                      verificationResult
                        .data
                        .booking
                        .user
                        ?.email ||
                      "Non renseigné"
                    }
                  </span>

                </div>


                <div>

                  <strong>
                    🏨 Service
                  </strong>

                  <span>
                    {
                      verificationResult
                        .data
                        .booking
                        .service
                        ?.name ||
                      "Non renseigné"
                    }
                  </span>

                </div>


                <div>

                  <strong>
                    📅 Date
                  </strong>

                  <span>
                    {
                      verificationResult
                        .data
                        .booking
                        .date ||
                      "Non renseignée"
                    }
                  </span>

                </div>


                <div>

                  <strong>
                    📋 Statut
                  </strong>

                  <span>
                    {
                      verificationResult
                        .data
                        .booking
                        .status ||
                      "Non renseigné"
                    }
                  </span>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              PAYMENT
          ================================================= */}

          {verificationResult.data?.payment && (

            <div className="qr-payment-info">

              <h3>
                💳 Paiement
              </h3>

              <strong>
                Statut :
              </strong>{" "}

              {
                verificationResult
                  .data
                  .payment
                  .status ||
                "Non renseigné"
              }

            </div>

          )}

        </div>

      )}

    </div>
  );
}