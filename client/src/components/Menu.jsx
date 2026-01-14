import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Menu.css";

function Menu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decoded.rol);
          setUserName(decoded.nombre || "Usuario");
        } catch {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserName("");
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName("");
      }
    };

    checkAuth();
    // Re-check on storage changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    navigate("/");
  };

  // Determinar qué enlaces mostrar según el rol
  const getRoleLabel = () => {
    switch (userRole) {
      case 1:
        return "Admin";
      case 2:
        return "Bibliotecario";
      case 3:
        return "Lector";
      default:
        return "";
    }
  };

  // Menú para usuarios NO autenticados
  if (!isLoggedIn) {
    return (
      <header>
        <nav className="menu-principal">
          <ul className="menu-lista">
            <li className="brand">
              <Link to="/">📚 Biblioteca</Link>
            </li>
            <li className="nav-links">
              <Link to="/">Inicio</Link>
              <Link to="/libros">Catálogo</Link>
              <Link to="/nosotros">Nosotros</Link>
            </li>
            <li className="auth-links">
              <Link to="/login" className="auth-btn login">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="auth-btn register">
                Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  // Menú para usuarios autenticados
  return (
    <header>
      <nav className="menu-principal">
        <ul className="menu-lista">
          <li className="brand">
            <Link to="/">📚 Biblioteca</Link>
          </li>

          {/* Enlaces comunes para todos los usuarios autenticados */}
          <li className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/libros">Catálogo</Link>

            {/* Enlaces específicos para Lector (rol 3) */}
            {userRole === 3 && (
              <Link to="/reservas">Mis Reservas</Link>
            )}

            {/* Enlaces específicos para Bibliotecario (rol 2) y Admin (rol 1) */}
            {(userRole === 1 || userRole === 2) && (
              <>
                <Link to="/reservas">Reservas</Link>
                <Link to="/usuarios">Usuarios</Link>
              </>
            )}

            <Link to="/nosotros">Nosotros</Link>
          </li>

          {/* Información del usuario y logout */}
          <li className="user-section">
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{getRoleLabel()}</span>
            </div>
            <button className="btn-logout" onClick={logout}>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Menu;
