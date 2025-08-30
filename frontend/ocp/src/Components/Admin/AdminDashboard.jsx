import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
  const { token } = useAuth(); 
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssociations = async () => {
    if (!token) {
      setError("Vous devez être connecté en tant qu'administrateur");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/association/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssociations(res.data);
    } catch (err) {
      console.error(err.response);
      setError(
        err.response?.status + ": " +
        (err.response?.data?.message || "Erreur lors du chargement")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette association ?")) return;

    try {
      await axios.delete(`http://localhost:8080/association/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssociations(associations.filter(a => a.id !== id));
      toast.success("✅ Association supprimée avec succès !");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Erreur lors de la suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">📋 Gestion des Associations</h2>

      {/* Table responsive */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm">
          <thead className="table">
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Contact</th>
              <th>Adresse</th>
              <th>Profil complet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {associations.map((assoc) => (
              <tr key={assoc.id}>
                <td>{assoc.name || "—"}</td>
                <td>{assoc.description || "—"}</td>
                <td>{assoc.contact || "—"}</td>
                <td>{assoc.adresse || "—"}</td>
                <td>{assoc.profileCompleted ? "✅ Oui" : "❌ Non"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(assoc.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AdminDashboard;
