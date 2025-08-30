import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

function LoginEmployes() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/users/login-employe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Échec de la connexion");
      }

      const data = await response.json();
      console.log("Connexion réussie :", data);

      // 🔹 Mettre à jour le contexte avec uid, role, token
      login(data.token, "ROLE_EMPLOYE");

      // Rediriger vers la page d'accueil ou catalogue
      navigate("/produits");
    } catch (err) {
      setError("Identifiants incorrects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToInscription = () => navigate("/register-ocp");

  const title = "Connexion Employé";

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleLogin}
        className="login-form p-4 rounded shadow"
        style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">{title}</h2>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="exemple@ocp.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="position-relative mb-3">
          <label>Mot de Passe</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "70%",
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              border: "none",
              color: "#333",
              cursor: "pointer",
              fontSize: "22px",
              padding: "4px",
            }}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && <div className="text-danger mt-2">{error}</div>}

        <button type="submit" className="btn btn-custom w-100" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="text-center mt-3">
          <span>Pas encore de compte ? </span>
          <button type="button" className="btn btn-link text-info" onClick={goToInscription}>
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginEmployes;
