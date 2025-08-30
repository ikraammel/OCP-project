import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import './Produits.css';

function Produits() {
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [search,setSearch] = useState('')

  const { role, cartItems, setCartItems, loading } = useAuth();

  // 🔹 Charger les produits depuis le backend
  useEffect(() => {
  axiosInstance.get('/products')
    .then(res => {
      console.log("Produits récupérés:", res.data);
      setProducts(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => console.error("Erreur chargement produits:", err));
}, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ Normalisation: minuscules + suppression des accents
  const normalize = (s) =>
    (s ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // 🔹 Filtrage client: name, description, categoryName, associationName, price
  const filteredProducts = useMemo(() => {
    const q = normalize(debouncedSearch);
    if (!q) return products;

    return products.filter((p) => {
      const fields = [
        p.name,
        p.description,
        p.categoryName,
        p.associationName,
        p.price != null ? String(p.price) : ''
      ];
      return fields.some((f) => normalize(f).includes(q));
    });
  }, [products, debouncedSearch]);

  // 🔹 Récupérer le panier depuis le backend
  const fetchCartItems = async () => {
    try {
      const res = await axiosInstance.get('/cart/me/items');
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur fetchCartItems:", err.response ? err.response.data : err.message);
      setCartItems([]); // forcer un tableau vide en cas d'erreur
    }
  };

  useEffect(() => {
    if (role === "ROLE_EMPLOYE") {
      fetchCartItems();
    }
  }, [role]);

  // 🔹 Ajouter un produit au panier
  const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await axiosInstance.post('/cart/add', { productId, quantity });
    setCartItems(Array.isArray(res.data) ? res.data : []);
    toast.success(`Produit ajouté au panier ! x${quantity} 🎉`);
  } catch (err) {
    console.error("Erreur addToCart:", err.response ? err.response.data : err.message);
    toast.error("Erreur lors de l'ajout au panier ⚠️");
  }
};


  // 🔹 Calcul du total sécurisé
  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)), 0)
    : 0;

  return (
    <div className="produits-container">
      {loading ? <div>Chargement...</div> : (
        <>
          <h2 className="produits-title">Nos produits</h2>
          {/* 🔎 Barre de recherche */}
            <div className="search-bar">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher (nom, catégorie, association, prix...)"
                className="search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>
                  ✕
                </button>
              )}
            </div>

            {/* compteur + message 0 résultat */}
            <div className="search-meta">
              {debouncedSearch
                ? <span>{filteredProducts.length} résultat(s) pour « {debouncedSearch} »</span>
                : <span>{products.length} produit(s)</span>}
            </div>

          <div className="produits-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-results">
                Aucun produit ne correspond à « {debouncedSearch} ».
                <button onClick={() => setSearch('')}>Réinitialiser</button>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="produit-card">
                  <img src={product.imageUrl} alt={product.name} className="produit-image" />
                  <div className="produit-content">
                    <h3 className="produit-name">{product.name}</h3>
                    <p className="produit-description">{product.description}</p>
                    <p className="produit-price"><strong>{product.price} MAD</strong></p>
                    <p><em>Catégorie : {product.categoryName || "Non spécifiée"}</em></p>
                    <p><em>Association : {product.associationName || "Non spécifiée"}</em></p>

                    {role === "ROLE_EMPLOYE" && (
                      <div className="add-cart-section">
                        <input
                          type="number"
                          min="1"
                          value={product.quantityToAdd || 1}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            setProducts(prev =>
                              prev.map(p =>
                                p.id === product.id ? { ...p, quantityToAdd: value } : p
                              )
                            );
                          }}
                          className="quantity-input"
                        />
                        <button
                          className="btn-add-cart"
                          onClick={() => addToCart(product.id, product.quantityToAdd || 1)}
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </>
      )}

      {/* Panier flottant */}
      {role === "ROLE_EMPLOYE" && Array.isArray(cartItems) && (
        <div className="floating-cart" onClick={() => setShowCart(true)}>
          🛒 {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
        </div>
      )}

      {/* Popup panier */}
      {showCart && Array.isArray(cartItems) && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Votre panier</h3>
            {cartItems.length === 0 ? (
              <p>Votre panier est vide.</p>
            ) : (
              <ul className="cart-list">
                {cartItems.map(item => (
                  <li key={item.id} className="cart-item">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{item.product.price * item.quantity} MAD</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="cart-actions">
              <button className="btn-close" onClick={() => setShowCart(false)}></button>
              {cartItems.length > 0 && <button className="btn-validate">Valider la commande</button>}
            </div>
            <p className="cart-total">Total : {totalPrice} MAD</p>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Produits;
