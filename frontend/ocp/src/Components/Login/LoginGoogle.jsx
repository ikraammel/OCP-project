import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; 

function LoginGoogle() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="btn btn-light w-100 mt-3"
      disabled={loading}
    >
      {loading ? (
        <span>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Redirection vers Google...
        </span>
      ) : (
        <>
          <FcGoogle size={20} className="me-2" />
          Continuer avec Google
        </>
      )}
    </button>
  );
}

export default LoginGoogle;
