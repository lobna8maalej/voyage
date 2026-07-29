import { Link } from "react-router-dom";
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

          <Link to="/hotels">🏨 Hôtels</Link>

          <Link to="/agency">✈ Agences de voyage</Link>

          <Link to="/circuits">🌍 Circuits touristiques</Link>

          <Link to="/restaurants">🍽 Restaurants</Link>

          <Link to="/spa">💆 Spa & Bien-être</Link>

          <Link to="/destinations">📍 Destinations</Link>

          <Link to="/offers">🎯 Offres spéciales</Link>

          <Link to="/coupons">🎟 Coupons</Link>

        </div>

        {/* Fonctionnalités */}
        <div className="footer-section">

          <h4>Fonctionnalités</h4>

          <Link to="/">✔ Recherche intelligente</Link>

          <Link to="/bookings">✔ Réservation en ligne</Link>

          <Link to="/payments">✔ Paiement Stripe</Link>

          <Link to="/bookings">✔ QR Code après paiement</Link>

          <Link to="/history">✔ Historique des réservations</Link>

          <Link to="/chat">✔ Chat intégré</Link>

          <Link to="/login">✔ Authentification sécurisée</Link>

        </div>

        {/* Support */}
        <div className="footer-section">

          <h4>Support</h4>

          <a href="mailto:lobnamaalej89@gmail.com">
            ✉ lobnamaalej89@gmail.com
          </a>

          <a href="tel:+21658229886">
            📞 +216 58 229 886
          </a>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Travel App - Tous droits réservés.
      </div>

    </footer>
  );
}