import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Travel App */}
        <div className="footer-section">
          <h3>🌍 Travel App</h3>

          <p>
            Réservez facilement vos prochaines expériences de voyage.
          </p>
        </div>

        {/* Nos services */}
        <div className="footer-section">
          <h4>Nos services</h4>

          <p>🏨 Hôtels</p>
          <p>✈ Agences de voyage</p>
          <p>🌍 Circuits touristiques</p>
          <p>🍽 Restaurants</p>
          <p>💆 Spa & Bien-être</p>
          <p>📍 Destinations</p>
          <p>🎯 Offres spéciales</p>
          <p>🎟 Coupons</p>
        </div>

        {/* Fonctionnalités */}
        <div className="footer-section">
          <h4>Fonctionnalités</h4>

          <p>✔ Recherche intelligente</p>
          <p>✔ Réservation en ligne</p>
          <p>✔ Paiement Stripe</p>
          <p>✔ QR Code après paiement</p>
          <p>✔ Historique des réservations</p>
          <p>✔ Chat intégré</p>
          <p>✔ Authentification sécurisée</p>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>

          <div className="footer-support">
            ✉{" "}
            <a href="mailto:lobnamaalej89@gmail.com">
              lobnamaalej89@gmail.com
            </a>

            <br />

            💬{" "}
            <a
              href="https://wa.me/21658229886"
              target="_blank"
              rel="noopener noreferrer"
            >
              +216 58 229 886
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Travel App - Tous droits réservés.
      </div>
    </footer>
  );
}
