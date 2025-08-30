import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './style.css';

function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'apparition au chargement de la page
    setIsVisible(true);
  }, []);

  const categories = [
    { 
      id: 1, 
      name: "Secteur alimentaire",
      icon: "🍎",
      description: "Découvrez nos produits alimentaires de qualité",
      color: "#FF7B54"
    },
    { 
      id: 2, 
      name: "Produits Agricoles",
      icon: "🌾",
      description: "Des produits agricoles frais et locaux",
      color: "#4CAF50"
    },
    { 
      id: 3, 
      name: "Équipements",
      icon: "🔧",
      description: "Tout l'équipement nécessaire pour vos activités",
      color: "#2196F3"
    },
  ];

  return (
    <div className="home-container">
      <section className="banner">
        <div className="banner-overlay">
          <div className="banner-content">
            <h1>Bienvenue sur la Marketplace Officielle de l'OCP</h1>
            <p>Découvrez un univers de produits exclusifs et de qualité</p>
            <button className="shop-now" onClick={() => navigate('/produits')}>
              Explorer nos Produits
            </button>
          </div>
        </div>
      </section>

      {/* Accès rapides */}
      <section className="access-section">
        <h2>Accès Rapide</h2>
        <div className="access-cards">
          <div
            className="access-card association-card"
            onClick={() => navigate('/association-login')}
          >
            <div className="card-icon">👥</div>
            <h3>Espace Associations</h3>
            <p>Ajoutez vos produits et gérez vos ventes.</p>
          </div>
          <div
            className="access-card ocp-card"
            onClick={() => navigate('/ocp-login')}
          >
            <div className="card-icon">🏢</div>
            <h3>Espace Employés OCP</h3>
            <p>Accédez aux offres spéciales et avantages.</p>
          </div>
          <div
            className="access-card ocp-card"
            onClick={() => navigate('/admin-login')}
          >
            <div className="card-icon">🏢</div>
            <h3>Espace Admin</h3>
            <p>Gérez l'ensemble des associations.</p>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className={`categories ${isVisible ? 'visible' : ''}`}>
        <h2>Nos Catégories</h2>
        <p className="section-subtitle">Explorez nos différentes gammes de produits</p>
        <div className="category-list">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="category-card animated-category"
              style={{ 
                background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;