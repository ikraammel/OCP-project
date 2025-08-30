import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig';
import Collapse from 'bootstrap/js/dist/collapse';
import { useAuth } from '../AuthContext';
import './style.css';

function Navbar() {
  const navBarCollapseRef = useRef(null);
  const bsCollapseRef = useRef(null); 
  const navigate = useNavigate();
  const { role, token, logout, cartItems, setCartItems } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // 🔹 Récupération panier employé
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get(`/cart/me/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du panier :", err);
      }
    };

    if (role === "ROLE_EMPLOYE") {
      fetchCartItems();
    }
  }, [role, token, setCartItems]);

  // 🔹 Gestion resize pour mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔹 Initialisation Bootstrap Collapse
  useEffect(() => {
    if (navBarCollapseRef.current) {
      bsCollapseRef.current = new Collapse(navBarCollapseRef.current, { toggle: false });
    }
  }, []);

  // 🔹 Fermeture navbar mobile
  const closeNavBar = () => {
    if (bsCollapseRef.current && isMobile) {
      bsCollapseRef.current.hide();
    }
  };

  // 🔹 Déconnexion
  const handleLogout = () => {
    logout();
    navigate('/');
  };
 useEffect(() => {
  console.log("Navbar role updated:", role);
}, [role]);


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 px-4">
      <div className="container-fluid justify-content-between">
        <Link className="navbar-brand" to="/" onClick={closeNavBar}>
          <img src="/OCPFR.webp" alt="logo OCP" height="50" />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button"
          onClick={() => bsCollapseRef.current.toggle()}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" ref={navBarCollapseRef}>
          <ul className="navbar-nav">
            <li className='nav-item'>
              <Link className='nav-link' to="/" onClick={closeNavBar}>Accueil</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/produits" onClick={closeNavBar}>Catalogue</Link>
            </li>

            {role === "association" && (
              <li className='nav-item'>
                <Link className='nav-link' to="/association-dashboard" onClick={closeNavBar}>Mes produits</Link>
              </li>
            )}

            {role === "ROLE_EMPLOYE" && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  🛒 Panier ({Array.isArray(cartItems) ? cartItems.length : 0})
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: '300px' }}>
                  {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                    <li className="dropdown-item">Votre panier est vide</li>
                  ) : (
                    cartItems.map((item) => (
                      <li key={item.id || item.product?.id} className="dropdown-item d-flex justify-content-between">
                        <span>{item.product?.name || "Produit"} x {item.quantity || 1}</span>
                        <span>{(item.product?.price || 0) * (item.quantity || 1)} MAD</span>
                      </li>
                    ))
                  )}
                  {Array.isArray(cartItems) && cartItems.length > 0 && (
                    <li className="dropdown-item text-center">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          navigate('/panier');
                          closeNavBar();
                        }}
                      >
                        Voir le panier
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {role === "ROLE_ADMIN" && (
              <li className='nav-item'>
                <Link className='nav-link' to="/admin-dashboard" onClick={closeNavBar}>
                  Dashboard Admin
                </Link>
              </li>
            )}


            {!role ? (
              <>
                <li className='nav-item dropdown'>
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    Se connecter
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/association-login" onClick={closeNavBar}>
                        Espace Association
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/ocp-login" onClick={closeNavBar}>
                        Espace Employé OCP
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to="/register-association" onClick={closeNavBar}>
                    S'inscrire (Association)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to="/register-ocp" onClick={closeNavBar}>
                    S'inscrire (Employé)
                  </Link>
                </li>
              </>
            ) : (
              <li className='nav-item'>
                <button 
                  className='btn btn-link nav-link' 
                  onClick={() => setShowLogoutModal(true)}
                >
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {showLogoutModal && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowLogoutModal(false)} style={{ zIndex: 1040 }}></div>
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Annuler</button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => {
                      logout();
                      closeNavBar();
                      navigate('/');
                      setShowLogoutModal(false);
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
