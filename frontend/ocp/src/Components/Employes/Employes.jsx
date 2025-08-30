import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import ProductDetailsCard from './ProductDetailsCard';
import './Employes.css';

export default function Employes() {
  const [associations, setAssociations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axiosInstance.get('/association/all')
      .then(res => setAssociations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSelect = async (association) => {
    setSelected(association);
    setSelectedProduct(null);
    try {
      const res = await axiosInstance.get(`/products/by-association/${association.id}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  // Afficher la fiche produit si un produit est sélectionné
  if (selectedProduct) {
    return (
      <ProductDetailsCard 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
    );
  }

  // Afficher les détails de l'association si sélectionnée
  if (selected) {
    return (
      <div className="employes-container">
        <div className="association-details">
          <button className="back-button" onClick={() => setSelected(null)}>← Retour</button>
          <img 
            src={selected.imageUrl || 'https://via.placeholder.com/600x300'} 
            alt={selected.name} 
            className="association-image"
          />
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <p><strong>Adresse :</strong> {selected.adresse}</p>
          <p><strong>Contact :</strong> {selected.contact}</p>

          <h3>Produits</h3>
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map(prod => (
                <div 
                  className="product-card" 
                  key={prod.id} 
                  onClick={() => setSelectedProduct(prod)}
                >
                  <img 
                    src={prod.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={prod.name} 
                    className="product-image" 
                  />
                  <div className="product-name">{prod.name}</div>
                  <div className="product-price">{prod.price} DH</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun produit disponible</p>
          )}
        </div>
      </div>
    );
  }

  // Afficher la liste des associations
  return (
    <div className="employes-container">
      <h1 className="employes-title">Liste des associations</h1>
      <div className="associations-grid">
        {associations.map(a => (
          <div className="association-card" key={a.id}>
            <img 
              src={a.imageUrl || 'https://via.placeholder.com/300x180'} 
              alt={a.name} 
              className="association-image"
            />
            <div className="association-content">
              <div className="association-name">{a.name}</div>
              <div className="association-desc">{a.description}</div>
              <button className="details-button" onClick={() => handleSelect(a)}>
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
