import React from 'react';
import './ProductDetailsCard.css';

export default function ProductDetailsCard({ product, onBack }) {
  if (!product) return null;

  return (
    <div className="product-details-card">
      <button className="back-button" onClick={onBack}>← Retour</button>
      <img
        src={product.imageUrl || 'https://via.placeholder.com/400'}
        alt={product.name}
        className="product-detail-image"
      />
      <h2>{product.name}</h2>
      <p><strong>Prix :</strong> {product.price} DH</p>
      <p><strong>Description :</strong> {product.description}</p>
      <p><strong>Catégorie :</strong> {product.category?.name}</p>
    </div>
  );
}
