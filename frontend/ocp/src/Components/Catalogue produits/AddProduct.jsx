import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from '../AuthContext';
import './AddProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {
  const {token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [assocId, setAssocId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    nb_items: "",
    price: "",
    imageUrl: "",
    categoryId: ""
  });

  // 🔹 Récupérer l'association et les catégories
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
        setAssocId(res.data.id);
      } catch (err) {
        console.error("Erreur association:", err);
        toast.error("Impossible de récupérer votre association");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur catégories:", err);
      }
    };

    fetchAssociation();
    fetchCategories();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!token) throw new Error("Utilisateur non connecté");
      if (!assocId) throw new Error("Association introuvable");

      const productDto = {
        name: formData.name,
        description: formData.description,
        nb_items: parseInt(formData.nb_items, 10),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        categoryId: parseInt(formData.categoryId, 10),
        associationId: assocId
      };

      const response = await axiosInstance.post("/products/newProduct", productDto, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Réponse API:", response.data);

      toast.success("Produit ajouté avec succès !");
      setTimeout(() => navigate("/association-dashboard"), 1500);

    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du produit");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Ajouter un produit</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>Nom</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Stock</label>
        <input type="number" name="nb_items" value={formData.nb_items} onChange={handleChange} required />

        <label>Prix</label>
        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />

        <label>URL de l'image</label>
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />

        <label>Catégorie</label>
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit">Ajouter</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddProduct;
