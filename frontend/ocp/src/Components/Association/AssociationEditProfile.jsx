import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AssociationEditProfile.css';

export default function AssociationEditProfile() {
  const { token } = useAuth(); 
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
    if (!token) {
      navigate('/association-login');
      return;
    }

    const fetchAssociation = async () => {
      try {
        const res = await axiosInstance.get(`/association/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
          adresse: res.data.adresse || "",
          contact: res.data.contact || "",
          categoryId: res.data.category?.id || "",
          imageUrl: res.data.imageUrl || ""
        });
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger les informations de l'association");
      }
    };

    const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories", {
      headers: { Authorization: `Bearer ${token}` }
    });
    // 🔹 Assure-toi que c'est bien un tableau
    setCategories(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
  }
};


    fetchAssociation();
    fetchCategories();

  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) throw new Error("Utilisateur non connecté");

      await axiosInstance.put(
        `/association/update-profile`,
        { ...formData, category: { id: formData.categoryId } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profil mis à jour avec succès !");
      setTimeout(() => navigate("/association-dashboard"), 2000);

    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="form-container">
      <h2>Modifier votre profil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <label>URL de l'image</label>
        <input
          type="text"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <label>Adresse</label>
        <input
          type="text"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
        />
        <label>Contact</label>
        <input
          type="text"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
        />
        <label>Catégorie</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        >
          <option value="">Choisir une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Mettre à jour</button>
      </form>
      <ToastContainer />
    </div>
  );
}
