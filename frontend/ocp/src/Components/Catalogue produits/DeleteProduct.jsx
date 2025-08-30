import React, { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from '../AuthContext';
import './DeleteProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteProduct() {
  const {token } = useAuth();
  const [assocId, setAssocId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Récupérer l'association
        const assocResponse = await axiosInstance.get(`/association/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssocId(assocResponse.data.id);

        // Récupérer les produits
        const productsResponse = await axiosInstance.get(
          `/products/by-association/${assocResponse.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Erreur lors de la récupération des données");
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(products.filter(p => p.id !== productId));
      toast.success("Produit supprimé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="product-list-container">
      <h2>Gestion des produits</h2>

      {products.length > 0 ? (
        <ul className="product-list">
          {products.map(product => (
            <li key={product.id} className="product-item">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Prix: {product.price} DH</p>
                <p>Stock: {product.nb_items}</p>
              </div>

              <div className="product-action">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting}
                  className="delete-btn"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun produit disponible</p>
      )}

      <ToastContainer />
    </div>
  );
}

export default DeleteProduct;
