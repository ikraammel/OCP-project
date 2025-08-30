import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProduct.css';

function EditProduct() {
  const { id } = useParams(); 
  const {token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    nb_items: "",
    price: "",
    imageUrl: "",
    categoryId: ""
  });

  useEffect(() => {
    if (!token) return;

    // récupérer le produit
    axiosInstance.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          nb_items: res.data.nb_items,
          price: res.data.price,
          imageUrl: res.data.imageUrl,
          categoryId: res.data.category?.id || ""
        });
      })
      .catch(err => console.error(err));

    // récupérer les catégories
    axiosInstance.get("/categories", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [id,token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vous devez être connecté pour modifier un produit");
      return;
    }

    try {
      await axiosInstance.put(`/products/${id}`, {
        ...formData,
        nb_items: parseInt(formData.nb_items, 10),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId, 10)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Produit modifié avec succès");
      setTimeout(() => {
        navigate("/association-dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la modification du produit");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Modifier le produit</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Mettre à jour</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default EditProduct;
