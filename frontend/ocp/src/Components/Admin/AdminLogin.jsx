import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../AuthContext";

function LoginAdmin({ title }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/users/login", { email, password });
      const { token, roles } = res.data;

      if (!token) throw new Error("Impossible de récupérer le token");
      if (!roles.includes("ROLE_ADMIN")) {
        setError("Accès refusé : vous n'êtes pas admin");
        setLoading(false);
        return;
    }

      login(token, "ROLE_ADMIN");
      navigate("/admin-dashboard"); // Redirection vers le dashboard admin

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSubmit} className="login-form p-4 rounded shadow">
        <h2 className="mb-4 text-center">{title || "Connexion Admin"}</h2>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="position-relative mb-3">
          <label className="form-label">Mot de Passe</label>
          <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password-btn">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && <div className="text-danger mt-2">{error}</div>}

        <button type="submit" className="btn btn-custom w-100" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
