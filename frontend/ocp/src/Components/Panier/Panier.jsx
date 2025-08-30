import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Panier.css';

function Panier() {
  const { token, cartItems, setCartItems } = useAuth(); // plus besoin de uid
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setCartItems([]); // forcer tableau vide si pas de token
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get('/cart/me/items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setCartItems([]);
        toast.error("Erreur lors de la récupération du panier ! ⚠️");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, setCartItems]);

  const confirmRemove = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const removeItem = async () => {
  if (!selectedItem || !token) return;

  try {
    await axiosInstance.post(
      '/cart/remove',
      { productId: selectedItem.id }, // <-- corps attendu par Spring
      {
        headers: { Authorization: `Bearer ${token}` } // <-- ici, pas dans le body
      }
    );

    setCartItems(prev => prev.filter(item => item.id !== selectedItem.id));
    toast.success("Produit supprimé du panier 🛒");
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de la suppression ⚠️");
  } finally {
    setShowPopup(false);
    setSelectedItem(null);
  }
};


  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0)
    : 0;

  if (loading) return <p>Chargement du panier...</p>;

  const updateQuantity = async (item, newQty) => {
  if (newQty < 1 || !token) return;

  try {
    const res = await axiosInstance.post(
      '/cart/update',
      { productId: item.product.id, quantity: newQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCartItems(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de la mise à jour ⚠️");
  }
};


  return (
    <div className="panier-container">
      <h2>Mon Panier 🛒</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Votre panier est vide.</p>
      ) : (
        <div className="cart-table-wrapper">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.product.price} MAD</td>
                  <td>
                    <div className="quantity-spinner">
                      <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        className="quantity-input"
                      />
                      <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                    </div>
                  </td>


                  <td>{item.product.price * item.quantity} MAD</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmRemove(item)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h4>Total : {totalPrice} MAD</h4>
            <button className="btn btn-success" onClick={() => navigate('/commande')}>
              Passer la commande
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment supprimer <b>{selectedItem?.product.name}</b> du panier ?</p>
            <div className="popup-actions">
              <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Annuler</button>
              <button className="btn btn-danger" onClick={removeItem}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Panier;
