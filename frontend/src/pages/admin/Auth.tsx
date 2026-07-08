import { useState } from "react";
import { loginUser, registerUser } from "../../services/auth.service";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await loginUser({
          email,
          password,
        });

        const token = res.token;
        const user = res.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));



        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        await registerUser({
          username,
          email,
          password
        });

        alert("Account created successfully");
        setIsLogin(true);
      }

    } catch (err) {
      console.log(err);
      alert("Authentication failed");
    }
  };

 return (
  <div className="auth-container">

    <div className="auth-card">

      <h1>
        {isLogin ? "🔐 Connexion" : "✨ Créer un compte"}
      </h1>


      {!isLogin && (
        <input
          className="auth-input"
          placeholder="Nom utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}



      <input
        className="auth-input"
        type="email"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />



      <input
        className="auth-input"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />



      <button
        className="auth-btn"
        onClick={handleSubmit}
      >
        {isLogin ? "Se connecter" : "Créer un compte"}
      </button>



      <p className="switch-text">

        {isLogin
          ? "Vous n'avez pas de compte ?"
          : "Vous avez déjà un compte ?"
        }

      </p>



      <button
        className="switch-btn"
        onClick={() => setIsLogin(!isLogin)}
      >

        {isLogin
          ? "Créer un compte"
          : "Retour connexion"
        }

      </button>


    </div>

  </div>
);
}

export default Auth;