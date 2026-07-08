import "./Footer.css";

export default function Footer(){

  return(
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">

          <h3>🌍 Travel App</h3>

          <p>
            Votre plateforme de réservation
            hôtels, restaurants, spas et circuits.
          </p>

        </div>


        <div className="footer-section">

          <h4>Navigation</h4>

          <p>Accueil</p>
          <p>Hôtels</p>
          <p>Restaurants</p>
          <p>Circuits</p>

        </div>


        <div className="footer-section">

          <h4>Contact</h4>

          <p>📍 Sfax, Tunisie</p>
          <p>✉️ lobnamaalej89@gmail.com</p>
          <p>📞 +216 58229886</p>

        </div>


      </div>


      <div className="footer-bottom">

        © 2026 Travel App - Tous droits réservés

      </div>


    </footer>
  );

}