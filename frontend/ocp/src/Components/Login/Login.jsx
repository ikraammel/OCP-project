import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginGoogle from "./LoginGoogle";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../AuthContext";
import './Login.css';


function Login({ title }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const goToInscription = () => navigate("/register-association");

  // 🔹 Vérification association après login
  const verifyAssociation = async (token) => {
    try {
      await axios.get("http://localhost:8080/association/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ Association existe
      navigate("/association-dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        // ❌ Pas encore de profil association
        navigate("/association-setup");
      } else {
        console.error("Erreur vérification association:", err);
        setError("Impossible de vérifier le profil de l'association");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      // 🔹 Login via backend Spring
      const res = await axios.post("http://localhost:8080/users/login", { email, password });
      const { token } = res.data;

      if (!token) throw new Error("Impossible de récupérer le token");

      // ✅ Stockage token + rôle "association"
      login(token, "association");
      setSuccess("Connexion réussie !");

      // 🔹 Vérification du profil association
      await verifyAssociation(token);

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSubmit} className="login-form p-4 rounded shadow">
        <h2 className="mb-4 text-center">{title || "Connexion"}</h2>

        {/* Champ email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="exemple@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Champ mot de passe */}
        <div className="position-relative mb-3">
          <label className="form-label">Mot de Passe</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-btn"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Messages */}
        {error && <div className="text-danger mt-2">{error}</div>}
        {success && <div className="text-success mt-2">{success}</div>}

        {/* Bouton connexion */}
        <button type="submit" className="btn btn-custom w-100" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Google Login */}
        <LoginGoogle />

        {/* Lien inscription */}
        <div className="text-center mt-2">
          <span>Pas encore de compte ? </span>
          <button
            type="button"
            className="btn btn-link text-info w-100"
            onClick={goToInscription}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
