import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ProfileSetup() {
  const {token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    adresse: "",
    contact: "",
    categoryId: "",
    imageUrl: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
  if (!token) return;

  // Vérifier si l'association existe
  axiosInstance.get("/association/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    // Profil existant → rediriger vers le dashboard
    navigate("/association-dashboard");
  })
  .catch(err => {
    if (err.response?.status === 404) {
      // Profil non trouvé → rester sur la page, pas besoin de log d'erreur
      console.log("Profil association non trouvé, compléter le profil");
    } else {
      // Autres erreurs → afficher toast et log
      console.error("Erreur vérification association:", err);
      toast.error("Impossible de vérifier le profil de l'association");
    }
  });

  // Charger les catégories
  axiosInstance.get("/categories", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setCategories(res.data))
  .catch(err => console.error("Erreur chargement catégories:", err));

}, [token, navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!token) throw new Error('Utilisateur non connecté');

      const response = await axiosInstance.post('/association/new', {
        name: formData.name,
        description: formData.description,
        adresse: formData.adresse,
        contact: formData.contact,
        imageUrl: formData.imageUrl,
        category: { id: formData.categoryId },
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Profil créé avec succès !");
        navigate('/association-dashboard');
      }
    } catch (error) {
      console.error('Erreur détaillée:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      toast.error(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Complétez votre profil Association</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'association"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <input
          type="text"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={(e) => setFormData({...formData, adresse: e.target.value})}
        />
        <input
          type="text"
          placeholder="Contact"
          value={formData.contact}
          onChange={(e) => setFormData({...formData, contact: e.target.value})}
        />
        <input
          type="text"
          placeholder="URL de l'image"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
        />
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
