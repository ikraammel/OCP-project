import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Accueil/Home";
import Navbar from "./Components/Navbar/Navbar";
import Produits from "./Components/Catalogue produits/Produits";
import Commande from "./Components/Commande/Commande";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Paiement from "./Components/Paiement/Paiement";
import Footer from "./Components/Footer/Footer";
import Panier from "./Components/Panier/Panier";
import ProfileSetup from "./Components/Association/ProfileSetup";
import AssociationDashboard from "./Components/Association/AssociationDashboard";
import Employes from "./Components/Employes/Employes";
import LoginEmployes from "./Components/Login/LoginEmployes";
import RegisterEmployes from "./Components/Register/RegisterEmployes";
import AssociationEditProfile from "./Components/Association/AssociationEditProfile";
import AddProduct from "./Components/Catalogue produits/AddProduct";
import DeleteProduct from "./Components/Catalogue produits/DeleteProduct";
import EditProduct from "./Components/Catalogue produits/EditProduct";
import ProductDetails from "./Components/Catalogue produits/ProductDetails";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Components/AuthContext";
import OAuth2Callback from "./Components/utils/OAuth2Callback";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produits" element={<Produits />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/commande" element={<Commande />} />
      <Route path="/paiement" element={<Paiement />} />
      <Route path="/register-association" element={<Register title="Inscription Espace Associations" redirectPath="/association-login" loginPath="/association-login" />} />
      <Route path="/register-ocp" element={<RegisterEmployes />} />
      <Route path="/association-login" element={<Login title="Connexion Espace Associations" registerPath="/register-association" />} />
      <Route path="/ocp-login" element={<LoginEmployes registerPath="/register-ocp" />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/association-setup" element={<ProfileSetup />} />
      <Route path="/association-dashboard" element={<AssociationDashboard />} />
      <Route path="/employes" element={<Employes />} />
      <Route path="/association/edit-profile" element={<AssociationEditProfile />} />
      <Route path="/association/add-product" element={<AddProduct />} />
      <Route path="/association/edit-product/:id" element={<EditProduct />} />
      <Route path="/association/delete-product" element={<DeleteProduct />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="app-content">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
