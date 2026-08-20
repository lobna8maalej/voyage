import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../admin/axios";

import "./ReservationPage.css";

/* =====================================================
   TYPES
===================================================== */

type Service = {
  _id: string;

  name?: string;
  title?: string;

  image?: string;
  imageUrl?: string;
  images?: string[];

  city?: string;
  country?: string;
  location?: string;

  price?: number;
};

/* =====================================================
   FALLBACK
===================================================== */

const FALLBACK =
  "https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";

/* =====================================================
   COMPONENT
===================================================== */

export default function ReservationPage() {

  const {
    type,
    id,
  } = useParams();

  const navigate =
    useNavigate();

  /* =====================================================
     STATES
  ===================================================== */

  const [
    service,
    setService
  ] =
    useState<Service | null>(null);

  const [
    loading,
    setLoading
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting
  ] =
    useState(false);

  const [
    success,
    setSuccess
  ] =
    useState("");

  const [
    error,
    setError
  ] =
    useState("");

  /* =====================================================
     FORM
  ===================================================== */

  const [
    form,
    setForm
  ] =
    useState({
      name: "",
      email: "",
      phone: "",
      persons: 1,
      checkIn: "",
      checkOut: "",
      message: "",
    });

  /* =====================================================
     API MAP
  ===================================================== */

  const map: Record<string, string> = {

    hotel:
      "/hotels",

    hotels:
      "/hotels",

    agency:
      "/agency",

    agencies:
      "/agency",

    circuit:
      "/circuits",

    circuits:
      "/circuits",

    restaurant:
      "/restaurants",

    restaurants:
      "/restaurants",

    spa:
      "/spa",

    destination:
      "/destinations",

    destinations:
      "/destinations",

    offer:
      "/offers",

    offers:
      "/offers",
  };

  /* =====================================================
     SERVICE TYPE
  ===================================================== */

  const getServiceType = () => {

    switch (
      type?.toLowerCase()
    ) {

      case "hotel":
      case "hotels":
        return "Hotel";

      case "agency":
      case "agencies":
        return "Agency";

      case "circuit":
      case "circuits":
        return "Circuit";

      case "restaurant":
      case "restaurants":
        return "Restaurant";

      case "spa":
        return "Spa";

      case "destination":
      case "destinations":
        return "Destination";

      case "offer":
      case "offers":
        return "Offer";

      default:
        return "";
    }
  };

  /* =====================================================
     LOAD SERVICE
  ===================================================== */

  useEffect(() => {

    const fetchService =
      async () => {

        try {

          setLoading(true);
          setError("");

          const endpoint =
            map[
              type?.toLowerCase() ||
              ""
            ];

          if (!endpoint || !id) {

            setError(
              "Service invalide."
            );

            return;
          }

          const response =
            await api.get(
              `${endpoint}/${id}`
            );

          let data =
            response.data;

          if (
            response.data?.hotel
          ) {

            data =
              response.data.hotel;

          } else if (
            response.data?.agency
          ) {

            data =
              response.data.agency;

          } else if (
            response.data?.circuit
          ) {

            data =
              response.data.circuit;

          } else if (
            response.data?.restaurant
          ) {

            data =
              response.data.restaurant;

          } else if (
            response.data?.spa
          ) {

            data =
              response.data.spa;

          } else if (
            response.data?.destination
          ) {

            data =
              response.data.destination;

          } else if (
            response.data?.offer
          ) {

            data =
              response.data.offer;

          } else if (
            response.data?.data
          ) {

            data =
              response.data.data;
          }

          setService(data);

        } catch (err: any) {

          console.error(
            "❌ SERVICE :",
            err.response?.data ||
              err.message
          );

          setError(
            "Impossible de récupérer le service."
          );

        } finally {

          setLoading(false);

        }

      };

    fetchService();

  }, [type, id]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,

        [name]:
          name === "persons"
            ? Number(value)
            : value,
      })
    );
  };

  /* =====================================================
     SUBMIT
     POST /api/contacts
  ===================================================== */

  const handleReservation =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");
      setSuccess("");

      /* =================================================
         AUTH
      ================================================= */

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        alert(
          "Vous devez être connecté pour effectuer une réservation."
        );

        navigate(
          "/login"
        );

        return;
      }

      /* =================================================
         VALIDATION
      ================================================= */

      if (
        !form.name.trim()
      ) {

        setError(
          "Veuillez saisir votre nom."
        );

        return;
      }

      if (
        !form.email.trim()
      ) {

        setError(
          "Veuillez saisir votre email."
        );

        return;
      }

      if (
        !form.phone.trim()
      ) {

        setError(
          "Veuillez saisir votre téléphone."
        );

        return;
      }

      if (
        !form.checkIn
      ) {

        setError(
          "Veuillez sélectionner une date."
        );

        return;
      }

      if (
        form.persons < 1
      ) {

        setError(
          "Le nombre de personnes doit être supérieur à 0."
        );

        return;
      }

      if (!service?._id) {

        setError(
          "Service introuvable."
        );

        return;
      }

      const serviceType =
        getServiceType();

      if (!serviceType) {

        setError(
          "Type de service invalide."
        );

        return;
      }

      /* =================================================
         SERVICE INFORMATIONS
      ================================================= */

      const title =
        service.name ||
        service.title ||
        "Service";

      const location =
        service.city ||
        service.country ||
        service.location ||
        "";

      /* =================================================
         SUBJECT
      ================================================= */

      const subject =
        `Demande de réservation - ${title}`;

      /* =================================================
         MESSAGE CONTACT
      ================================================= */

      const contactMessage = `
📩 DEMANDE DE RÉSERVATION

━━━━━━━━━━━━━━━━━━━━━━

🏨 Service :
${title}

🏷️ Type :
${serviceType}

🆔 ID du service :
${service._id}

${location
  ? `📍 Localisation :
${location}

`
  : ""
}

👤 Client :
${form.name}

📧 Email :
${form.email}

📞 Téléphone :
${form.phone}

👥 Nombre de personnes :
${form.persons}

📅 Date souhaitée :
${form.checkIn}

${
  form.checkOut
    ? `📅 Date de fin :
${form.checkOut}

`
    : ""
}

💬 Demande particulière :
${
  form.message.trim()
    ? form.message
    : "Aucune demande particulière."
}

━━━━━━━━━━━━━━━━━━━━━━

📌 Statut :
Nouvelle demande

📨 Cette demande a été envoyée depuis le formulaire de réservation du site.
      `.trim();

      /* =================================================
         CONTACT DATA
      ================================================= */

      const contactData = {

        name:
          form.name,

        email:
          form.email,

        phone:
          form.phone,

        subject:
          subject,

        message:
          contactMessage,

        status:
          "New",
      };

      /* =================================================
         SEND CONTACT
      ================================================= */

      try {

        setSubmitting(true);

        console.log(
          "📤 CONTACT RÉSERVATION :",
          contactData
        );

        const response =
          await api.post(
            "/contacts",
            contactData,
            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "✅ CONTACT RÉSERVATION :",
          response.data
        );

        /* =================================================
           SUCCESS
        ================================================= */

        setSuccess(
          "Votre demande de réservation a été envoyée avec succès. L'administrateur va maintenant la traiter."
        );

        /* =================================================
           RESET FORM
        ================================================= */

        setForm({

          name: "",
          email: "",
          phone: "",

          persons: 1,

          checkIn: "",
          checkOut: "",

          message: "",

        });

      } catch (err: any) {

        console.error(
          "❌ ERREUR CONTACT RÉSERVATION :",
          err.response?.data ||
            err.message
        );

        setError(
          err.response?.data?.message ||
            "Impossible d'envoyer la demande de réservation."
        );

      } finally {

        setSubmitting(false);

      }
    };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="reservation-page">

        <div className="reservation-card">

          <p>
            Chargement...
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     SERVICE ERROR
  ===================================================== */

  if (!service) {

    return (

      <div className="reservation-page">

        <div className="reservation-card">

          <p className="error-message">

            {error ||
              "Service introuvable."}

          </p>

          <button
            onClick={() =>
              navigate(
                `/availability/${type}/${id}`
              )
            }
          >

            ← Retour au service

          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     VARIABLES
  ===================================================== */

  const title =
    service.name ||
    service.title ||
    "Service";

  const image =
    service.images?.[0] ||
    service.image ||
    service.imageUrl ||
    FALLBACK;

  const location =
    service.city ||
    service.country ||
    service.location ||
    "";

  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="reservation-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="reservation-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              `/availability/${type}/${id}`
            )
          }
        >

          ← Retour

        </button>

        <h1>

          📝 Demande de réservation

        </h1>

      </div>

      {/* =================================================
          CARD
      ================================================= */}

      <div className="reservation-card">

        {/* =================================================
            SERVICE
        ================================================= */}

        <div className="reservation-service">

          <img
            src={image}
            alt={title}
            onError={(e) => {

              e.currentTarget.src =
                FALLBACK;

            }}
          />

          <div>

            <h2>

              {title}

            </h2>

            <p>

              🏷️ {getServiceType()}

            </p>

            {location && (

              <p>

                📍 {location}

              </p>

            )}

          </div>

        </div>

        {/* =================================================
            INTRO
        ================================================= */}

        <div className="reservation-intro">

          <h2>

            📩 Envoyer votre demande

          </h2>

          <p>

            Remplissez ce formulaire
            afin d'envoyer une demande
            de réservation à
            l'administrateur.

          </p>

          <p>

            Après réception,
            l'administrateur pourra
            vérifier votre demande et
            vous contacter.

          </p>

        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div className="success-message">

            ✅ {success}

            <div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/availability/${type}/${id}`
                  )
                }
              >

                ← Retour au service

              </button>

            </div>

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="error-message">

            ❌ {error}

          </div>

        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleReservation
          }
          className="reservation-form"
        >

          {/* NOM */}

          <div className="form-group">

            <label>

              Nom complet *

            </label>

            <input
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              placeholder="Votre nom complet"
              required
            />

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label>

              Email *

            </label>

            <input
              type="email"
              name="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              placeholder="exemple@email.com"
              required
            />

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label>

              Téléphone *

            </label>

            <input
              type="tel"
              name="phone"
              value={
                form.phone
              }
              onChange={
                handleChange
              }
              placeholder="+216 XX XXX XXX"
              required
            />

          </div>

          {/* PERSONNES */}

          <div className="form-group">

            <label>

              Nombre de personnes *

            </label>

            <input
              type="number"
              name="persons"
              min="1"
              value={
                form.persons
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>

              Date souhaitée *

            </label>

            <input
              type="date"
              name="checkIn"
              value={
                form.checkIn
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* DATE FIN */}

          {(
            type?.toLowerCase() ===
              "hotel" ||
            type?.toLowerCase() ===
              "hotels" ||
            type?.toLowerCase() ===
              "circuit" ||
            type?.toLowerCase() ===
              "circuits"
          ) && (

            <div className="form-group">

              <label>

                Date de fin

              </label>

              <input
                type="date"
                name="checkOut"
                value={
                  form.checkOut
                }
                onChange={
                  handleChange
                }
              />

            </div>

          )}

          {/* MESSAGE */}

          <div className="form-group">

            <label>

              Message / demande particulière

            </label>

            <textarea
              name="message"
              value={
                form.message
              }
              onChange={
                handleChange
              }
              placeholder="Écrivez votre demande..."
              rows={5}
            />

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="reservation-summary">

            <h3>

              📋 Résumé de votre demande

            </h3>

            <p>

              <strong>
                Service :
              </strong>{" "}

              {title}

            </p>

            <p>

              <strong>
                Type :
              </strong>{" "}

              {getServiceType()}

            </p>

            {location && (

              <p>

                📍 {location}

              </p>

            )}

            <p>

              👥 {form.persons} personne
              {form.persons > 1
                ? "s"
                : ""}

            </p>

            {form.checkIn && (

              <p>

                📅 {form.checkIn}

              </p>

            )}

            {form.checkOut && (

              <p>

                📅 Jusqu'au{" "}

                {form.checkOut}

              </p>

            )}

          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="reservation-submit-btn"
            disabled={
              submitting
            }
          >

            {submitting
              ? "⏳ Envoi en cours..."
              : "📩 Envoyer la demande"}

          </button>

        </form>

      </div>

    </div>
  );
}