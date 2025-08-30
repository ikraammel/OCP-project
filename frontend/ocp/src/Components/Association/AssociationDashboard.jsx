import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../AuthContext";
import './style.css';

export default function AssociationDashboard() {
  const {token } = useAuth();
  const [association, setAssociation] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/association-login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔹 Récupérer l'association
        const associationRes = await axiosInstance.get(`/association/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssociation(associationRes.data);

        // 🔹 Récupérer les produits si l'association existe
        if (associationRes.data?.id) {
          const productsRes = await axiosInstance.get(
            `/products/by-association/${associationRes.data.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProducts(productsRes.data || []);
        }

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!association) return <p>Aucune association trouvée</p>;

  return (
    <div className="dashboard">
      <h1>Bienvenue, {association.name}</h1>
      <p>{association.description}</p>
      <p>Catégorie : {association.category?.name}</p>
      <p>Adresse : {association.adresse}</p>
      <p>Contact : {association.contact}</p>
      <img
        src={association.imageUrl || 'https://via.placeholder.com/300x180'}
        alt={association.name}
      />
      <hr />

      <h2>Vos produits</h2>
      {products.length > 0 ? (
        <ul>
          {products.map(prod => (
            <li key={prod.id} className="product-item">
              <Link to={`/product/${prod.id}`}>
                {prod.imageUrl && (
                  <img src={prod.imageUrl} alt={prod.name} />
                )}
                <span>{prod.name} - {prod.price} DH</span>
              </Link>
              <button
                className="edit-product-btn"
                onClick={() => navigate(`/association/edit-product/${prod.id}`)}
              >
                Modifier
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun produit disponible</p>
      )}

      <div className="dashboard-actions">
        <Link to="/association/edit-profile" className="dashboard-btn">
          Modifier mon profil
        </Link>
        <button onClick={() => navigate("/association/add-product")}>
          Ajouter un produit
        </button>
        <button onClick={() => navigate("/association/delete-product")}>
          Supprimer un produit
        </button>
      </div>
    </div>
  );
}
