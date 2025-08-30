import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostLoginRedirect() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await axios.get(`http://localhost:8080/users/type/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        switch (res.data.type) {
          case "employe":
            navigate("/employes");
            break;
          case "association":
            navigate("/association-dashboard");
            break;
          default:
            navigate("/association-login");
        }
      } catch (error) {
        console.error("Erreur lors de la redirection après login:", error);
        navigate("/association-login");
      }
    };

    if (!loading && user) {
      redirectUser();
    }
  }, [user, loading, navigate]);

  return null; // Pas de rendu
}
