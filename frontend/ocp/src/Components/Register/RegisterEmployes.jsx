import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterEmployes({ title = "Inscription Espace Employés OCP", redirectPath = "/ocp-login", loginPath = "/ocp-login" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goToLogin = () => navigate(loginPath);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!email.endsWith("@ocp.com")) {
      setError("L'adresse mail doit se terminer par @ocp.com");
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
        body: JSON.stringify({ email, firstName, lastName, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSubmit} className="register-form p-4 rounded shadow" style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center">{title}</h2>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre.email@ocp.com" required />
        </div>

        <div className="mb-3">
          <label>Prénom</label>
          <input type="text" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Nom</label>
          <input type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Mot de passe</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Confirmer mot de passe</label>
          <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
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

export default RegisterEmployes;
