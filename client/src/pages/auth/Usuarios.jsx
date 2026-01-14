import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { getUsuarios } from "../../services/apiServices";
import "./Usuarios.css";

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Solo Bibliotecario y Admin pueden ver usuarios
      if (decoded.rol !== 1 && decoded.rol !== 2) {
        toast.error("No tiene permisos para ver esta página");
        navigate("/");
        return;
      }
      setUserRole(decoded.rol);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userRole) {
      fetchUsuarios();
    }
  }, [userRole]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (rolId) => {
    switch (rolId) {
      case 1:
        return "Administrador";
      case 2:
        return "Bibliotecario";
      case 3:
        return "Lector";
      default:
        return "Desconocido";
    }
  };

  const getRoleClass = (rolId) => {
    switch (rolId) {
      case 1:
        return "rol-admin";
      case 2:
        return "rol-bibliotecario";
      case 3:
        return "rol-lector";
      default:
        return "";
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>Gestión de Usuarios</h1>
        <Link to="/register" className="btn-new-user">
          + Nuevo Usuario
        </Link>
      </div>

      <div className="usuarios-toolbar">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="usuarios-count">
          {filteredUsuarios.length} usuarios encontrados
        </span>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((user) => (
              <tr key={user.id_usuario}>
                <td>{user.id_usuario}</td>
                <td>
                  {user.nombre} {user.apellido}
                </td>
                <td>{user.mail}</td>
                <td>
                  <span className={`rol-badge ${getRoleClass(user.id_rol)}`}>
                    {getRoleName(user.id_rol)}
                  </span>
                </td>
                <td className="actions-cell">
                  <Link
                    to={`/reservas?usuario=${user.id_usuario}`}
                    className="btn-action btn-ver-reservas"
                    title="Ver reservas del usuario"
                  >
                    📚 Reservas
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
