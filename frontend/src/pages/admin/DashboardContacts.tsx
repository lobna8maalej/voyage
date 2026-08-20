import { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardContacts.css";

/* =====================================================
   TYPE CONTACT
===================================================== */

type Contact = {
  _id: string;

  name?: string;
  email?: string;
  phone?: string;

  subject?: string;
  message?: string;

  status?: string;

  createdAt?: string;
  updatedAt?: string;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DashboardContacts() {
  const [contacts, setContacts] =
    useState<Contact[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     GET CONTACTS
     GET /api/contacts
  ===================================================== */

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

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
         API CONTACTS
      ================================================= */

      const response = await axios.get(
        "http://localhost:5000/api/contacts",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "📩 CONTACTS API :",
        response.data
      );

      /* ================================================
         DIFFERENTES FORMES DE RESPONSE
      ================================================= */

      let data =
        response.data;

      if (response.data?.data) {
        data =
          response.data.data;
      } else if (
        response.data?.contacts
      ) {
        data =
          response.data.contacts;
      }

      /* ================================================
         VERIFICATION TABLEAU
      ================================================= */

      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        console.error(
          "❌ Les contacts ne sont pas un tableau :",
          data
        );

        setContacts([]);
      }

    } catch (err: any) {
      console.error(
        "❌ GET CONTACTS :",
        err.response?.data ||
          err.message
      );

      setError(
        err.response?.data?.message ||
          "Impossible de récupérer les demandes."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD CONTACTS
  ===================================================== */

  useEffect(() => {
    fetchContacts();
  }, []);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Date inconnue";
    }

    try {
      return new Date(
        date
      ).toLocaleString(
        "fr-FR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );

    } catch {
      return date;
    }
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatus = (
    status?: string
  ) => {
    if (!status) {
      return "New";
    }

    return status;
  };

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const getWhatsAppLink = (
    contact: Contact
  ) => {
    if (!contact.phone) {
      return "#";
    }

    /*
      Nettoyage du numéro.

      Exemple :
      +216 58 229 886
      devient :
      21658229886
    */

    let phone =
      contact.phone.replace(
        /\D/g,
        ""
      );

    /*
      Si le numéro commence par 0

      Exemple :
      58229886
      devient :
      21658229886
    */

    if (
      phone.startsWith("0")
    ) {
      phone =
        "216" +
        phone.substring(1);
    }

    /*
      Si le numéro contient
      seulement 8 chiffres
    */

    if (
      phone.length === 8
    ) {
      phone =
        "216" +
        phone;
    }

    /* ================================================
       MESSAGE WHATSAPP
    ================================================= */

    const message =
      `Bonjour ${contact.name || ""},

Nous avons bien reçu votre demande de contact.

Sujet : ${
        contact.subject ||
        "Demande de contact"
      }

Nous souhaitons échanger avec vous concernant votre demande.

Merci.`;

    return (
      `https://wa.me/${phone}` +
      `?text=${encodeURIComponent(
        message
      )}`
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="dashboard-contacts">

        <div className="dashboard-loading">

          ⏳ Chargement des demandes...

        </div>

      </div>
    );
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="dashboard-contacts">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-contacts-header">

        <div>

          <h1>
            📩 Messages de contact
          </h1>

          <p>
            Demandes de contact et réservations
            reçues depuis le site.
          </p>

        </div>

        <button
          onClick={fetchContacts}
          className="refresh-btn"
        >
          🔄 Actualiser
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <div className="contacts-stats">

        {/* TOTAL */}

        <div className="stat-card">

          <span>
            📩
          </span>

          <div>

            <strong>
              {contacts.length}
            </strong>

            <p>
              Total demandes
            </p>

          </div>

        </div>

        {/* NOUVELLES */}

        <div className="stat-card">

          <span>
            🔔
          </span>

          <div>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    getStatus(
                      contact.status
                    ).toLowerCase() ===
                    "new"
                ).length
              }
            </strong>

            <p>
              Nouvelles
            </p>

          </div>

        </div>

        {/* TRAITÉES */}

        <div className="stat-card">

          <span>
            👁️
          </span>

          <div>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    getStatus(
                      contact.status
                    ).toLowerCase() !==
                    "new"
                ).length
              }
            </strong>

            <p>
              Traitées / vues
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {contacts.length === 0 ? (

        <div className="empty-contacts">

          <div className="empty-icon">
            📭
          </div>

          <h2>
            Aucune demande
          </h2>

          <p>
            Aucune demande de contact ou de
            réservation n'a encore été reçue.
          </p>

        </div>

      ) : (

        /* =================================================
           CONTACTS
        ================================================= */

        <div className="contacts-list">

          {contacts.map(
            (contact) => (

              <div
                className="contact-card"
                key={contact._id}
              >

                {/* ======================================
                    CARD HEADER
                ======================================= */}

                <div className="contact-card-header">

                  <div>

                    <h2>
                      {
                        contact.subject ||
                        "Demande de contact"
                      }
                    </h2>

                    <span className="contact-date">

                      🕒{" "}

                      {formatDate(
                        contact.createdAt
                      )}

                    </span>

                  </div>

                  <span
                    className={
                      `status-badge status-${getStatus(
                        contact.status
                      ).toLowerCase()}`
                    }
                  >
                    {
                      getStatus(
                        contact.status
                      )
                    }
                  </span>

                </div>

                {/* ======================================
                    CLIENT
                ======================================= */}

                <div className="contact-client">

                  <h3>
                    👤 Client
                  </h3>

                  <div className="client-info">

                    <p>

                      <strong>
                        Nom :
                      </strong>{" "}

                      {
                        contact.name ||
                        "Non renseigné"
                      }

                    </p>

                    <p>

                      <strong>
                        Email :
                      </strong>{" "}

                      {
                        contact.email ||
                        "Non renseigné"
                      }

                    </p>

                    <p>

                      <strong>
                        Téléphone :
                      </strong>{" "}

                      {
                        contact.phone ||
                        "Non renseigné"
                      }

                    </p>

                  </div>

                </div>

                {/* ======================================
                    MESSAGE
                ======================================= */}

                <div className="contact-message">

                  <h3>
                    💬 Demande
                  </h3>

                  <div className="message-content">

                    {
                      contact.message ||
                      "Aucun message."
                    }

                  </div>

                </div>

                {/* ======================================
                    ACTIONS
                ======================================= */}

                <div className="contact-actions">

                  {/* ==================================
                      EMAIL
                  =================================== */}

                  {contact.email && (

                    <a
                      href={`mailto:${contact.email}`}
                      className="action-btn email-btn"
                    >
                      📧 Répondre par email
                    </a>

                  )}

                  {/* ==================================
                      WHATSAPP
                  =================================== */}

                  {contact.phone && (

                    <a
                      href={getWhatsAppLink(
                        contact
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn whatsapp-btn"
                    >
                      💬 WhatsApp
                    </a>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}