import { useState } from "react";
import axios from "axios";
import "./DashboardQR.css";

/* =====================================================
   TYPE VERIFICATION RESULT
===================================================== */

type VerificationResult = {
  success?: boolean;
  message?: string;

  booking?: {
    _id?: string;

    user?: {
      username?: string;
      email?: string;
    };

    service?: {
      name?: string;
    };

    serviceType?: string;

    persons?: number;

    checkIn?: string;
    checkOut?: string;

    totalPrice?: number;

    paymentStatus?: string;

    status?: string;

    qrVerifiedAt?: string;
  };
};

/* =====================================================
   TYPE QR DATA
===================================================== */

type QRData = {
  bookingId: string;
  token: string;
};

/* =====================================================
   DASHBOARD QR
===================================================== */

export default function DashboardQR() {
  const [scannedCode, setScannedCode] = useState<string>("");

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
         TOKEN ADMIN
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
         LIRE LE CONTENU DU QR
      ================================================= */

      let qrData: QRData;

      try {
        qrData = JSON.parse(
          scannedCode.trim()
        );
      } catch {
        setError(
          "QR Code invalide. Le contenu du QR est incorrect."
        );

        return;
      }

      /* ================================================
         VÉRIFIER LES DONNÉES
      ================================================= */

      if (
        !qrData.bookingId ||
        !qrData.token
      ) {
        setError(
          "QR Code incomplet : bookingId ou token manquant."
        );

        return;
      }

      console.log(
        "📱 QR DATA :",
        qrData
      );

      /* ================================================
         API VERIFY QR
      ================================================= */

      const response =
        await axios.post<VerificationResult>(
          "http://localhost:5000/api/qr/verify",

          {
            bookingId:
              qrData.bookingId,

            token:
              qrData.token,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "✅ QR vérifié :",
        response.data
      );

      /* ================================================
         RESULTAT
      ================================================= */

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
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Non renseignée";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "fr-FR"
      );
    } catch {
      return "Non renseignée";
    }
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
            ✨ Gestion QR Codes
          </h1>

          <p>
            Vérifiez rapidement une réservation
            à partir du QR Code du client.
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
          Scannez le QR Code du client ou
          collez son contenu ci-dessous.
        </p>

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="qr-input-group">

          <label>
            QR Code
          </label>

          <textarea
            value={scannedCode}
            onChange={(event) =>
              setScannedCode(
                event.target.value
              )
            }
            placeholder={`Collez le contenu du QR Code ici...
Exemple :
{"bookingId":"6a68e903...","token":"0bc77de5-3652-4eb1-b392-6907eff008dc"}`}
            rows={4}
          />

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="qr-actions">

          <button
            type="button"
            onClick={
              verifyQRCode
            }
            disabled={loading}
            className="verify-qr-btn"
          >

            {loading
              ? "⏳ Vérification..."
              : "🔍 Vérifier le QR"}

          </button>

          <button
            type="button"
            onClick={
              resetVerification
            }
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

          {/* =================================================
              RESULT HEADER
          ================================================= */}

          <div className="qr-result-header">

            <h2>

              {verificationResult.success
                ? "✅ QR Code valide"
                : "⚠️ Vérification"}

            </h2>

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {verificationResult.message && (

            <p className="qr-result-message">

              {verificationResult.message}

            </p>

          )}

          {/* =================================================
              BOOKING
          ================================================= */}

          {verificationResult.booking && (

            <div className="qr-booking-info">

              <h3>
                📋 Informations réservation
              </h3>

              <div className="qr-info-grid">

                {/* CLIENT */}

                <div>

                  <strong>
                    👤 Client
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .user
                      ?.username ||
                      "Non renseigné"}

                  </span>

                </div>

                {/* EMAIL */}

                <div>

                  <strong>
                    📧 Email
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .user
                      ?.email ||
                      "Non renseigné"}

                  </span>

                </div>

                {/* SERVICE */}

                <div>

                  <strong>
                    🏨 Service
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .service
                      ?.name ||
                      "Non renseigné"}

                  </span>

                </div>

                {/* TYPE */}

                <div>

                  <strong>
                    🗂️ Type
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .serviceType ||
                      "Non renseigné"}

                  </span>

                </div>

                {/* PERSONNES */}

                <div>

                  <strong>
                    👥 Personnes
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .persons ||
                      1}

                  </span>

                </div>

                {/* CHECK-IN */}

                <div>

                  <strong>
                    📅 Check-in
                  </strong>

                  <span>

                    {formatDate(
                      verificationResult
                        .booking
                        .checkIn
                    )}

                  </span>

                </div>

                {/* CHECK-OUT */}

                <div>

                  <strong>
                    📅 Check-out
                  </strong>

                  <span>

                    {formatDate(
                      verificationResult
                        .booking
                        .checkOut
                    )}

                  </span>

                </div>

                {/* PRIX */}

                <div>

                  <strong>
                    💰 Prix
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .totalPrice !==
                    undefined
                      ? `${verificationResult.booking.totalPrice} €`
                      : "Non renseigné"}

                  </span>

                </div>

                {/* STATUT */}

                <div>

                  <strong>
                    📋 Statut
                  </strong>

                  <span>

                    {verificationResult
                      .booking
                      .status ||
                      "Non renseigné"}

                  </span>

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              PAYMENT
          ================================================= */}

          {verificationResult.booking && (

            <div className="qr-payment-info">

              <h3>
                💳 Paiement
              </h3>

              <strong>
                Statut :
              </strong>{" "}

              {verificationResult
                .booking
                .paymentStatus === "paid"
                ? "✅ Payé"
                : "❌ Non payé"}

            </div>

          )}

        </div>

      )}

    </div>
  );
}