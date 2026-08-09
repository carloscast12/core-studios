import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import corestudios from "../assets/corestudios.png";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!token) return null;

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <>
    {menuOpen && (
      <div className="navbar-backdrop" onClick={() => setMenuOpen(false)} />
    )}
    <nav className={`navbar${menuOpen ? " menu-open" : ""}`}>
      {/* Logo */}
      <img
        src={corestudios}
        alt="Core Studios"
        className="navbar-logo"
        onClick={() => goTo("/dashboard")}
      />

      {/* Toggle (solo mobile) */}
      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Links + Avatar/Logout (dropdown en mobile) */}
      <div className="navbar-menu">
        <div className="navbar-links">
          <span
            onClick={() => goTo("/dashboard")}
            className={`nav-link${location.pathname === "/dashboard" ? " active" : ""}`}
          >
            Home
          </span>

          <span
            onClick={() => goTo("/social")}
            className={`nav-link${location.pathname === "/social" ? " active" : ""}`}
          >
            Social
          </span>

          <span
            onClick={() => goTo("/servicios")}
            className={`nav-link${location.pathname === "/servicios" ? " active" : ""}`}
          >
            Servicios adicionales
          </span>
        </div>

        {/* Avatar + Logout */}
        <div className="navbar-right">
          <div
            onClick={() => goTo("/profile")}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#E6F1FB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "500",
              color: "#185FA5",
              cursor: "pointer",
              backgroundImage: user?.avatar ? `url(${user.avatar})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
          </div>
          <span onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </span>
        </div>
      </div>
    </nav>
    </>
  );
}

export default Navbar;
