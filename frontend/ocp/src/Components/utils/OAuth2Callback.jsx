import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("Aucun token trouvé dans l'URL");
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    // ⚡ Récupérer les infos utilisateur depuis le backend
    axios
      .get("http://localhost:8080/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { uid, role } = res.data;

        localStorage.setItem("uid", uid);
        localStorage.setItem("role", role || "association");
        login(token, role || "association", uid);

        // Vérifier si l’association existe
        return axios.get("http://localhost:8080/association/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        // Si 200 OK, l'association existe
        navigate("/association-dashboard");
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // Pas de profil => redirection vers setup
          navigate("/association-setup");
        } else {
          console.error("Erreur callback OAuth:", err);
          navigate("/association-login");
        }
      });
  }, [navigate, login]);

  return <p>Connexion en cours...</p>;
}
