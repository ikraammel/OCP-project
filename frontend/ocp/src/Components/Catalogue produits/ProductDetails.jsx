import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Produit introuvable</p>;

  return (
    <div className="product-details">
      <button onClick={() => navigate(-1)}>⬅ Retour</button>
      <h1>{product.name}</h1>
      <img
        src={product.imageUrl || "https://via.placeholder.com/400"}
        alt={product.name}
        style={{ width: "300px", height: "300px", objectFit: "cover" }}
      />
      <p><strong>Prix :</strong> {product.price} DH</p>
      <p><strong>Description :</strong> {product.description}</p>
      <p><strong>Catégorie :</strong> {product.category?.name}</p>
    </div>
  );
}
