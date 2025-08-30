import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Register({ title, redirectPath, loginPath }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation simple du mot de passe
  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~-]).{8,}$/;
    return regex.test(pwd);
  };

  const goToLogin = () => {
    navigate(loginPath || "/association-login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      navigate(redirectPath || "/association-login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSubmit} className="login-form p-4 rounded shadow">
        <h2 className="mb-4 text-center">{title || "Inscription"}</h2>

        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmer mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        <button type="submit" className="btn btn-custom w-100" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <div className="text-center mt-2">
          <span>Vous avez déjà un compte ? </span>
          <button type="button" className="btn btn-link text-info p-0" onClick={goToLogin}>
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
