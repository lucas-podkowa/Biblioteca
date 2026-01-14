import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  getReservas,
  getReservasByUsuario,
  devolverLibro,
  deleteReserva,
  createReserva,
  getUsuarios,
  getLibrosDisponibles,
} from "../services/apiServices";
import "./Loan.css";

function Loan() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id_usuario: "",
    id_libro: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.rol);
      setUserId(decoded.id);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userId && userRole) {
      fetchReservas();
    }
  }, [userId, userRole]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      let response;

      // Lector (rol 3) solo ve sus propias reservas
      if (userRole === 3) {
        response = await getReservasByUsuario(userId);
      } else {
        // Bibliotecario y Admin ven todas las reservas
        response = await getReservas();
      }

      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleDevolucion = async (reservaId) => {
    if (!window.confirm("¿Confirmar devolución del libro?")) return;

    try {
      await devolverLibro(reservaId);
      toast.success("Devolución registrada correctamente");
      fetchReservas();
    } catch (error) {
      console.error("Error al registrar devolución:", error);
      toast.error("Error al registrar la devolución");
    }
  };

  const handleDelete = async (reservaId) => {
    if (!window.confirm("¿Eliminar esta reserva?")) return;

    try {
      await deleteReserva(reservaId);
      toast.success("Reserva eliminada");
      fetchReservas();
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      toast.error("Error al eliminar la reserva");
    }
  };

  const openNewReservaModal = async () => {
    try {
      // Cargar usuarios y libros disponibles
      if (userRole !== 3) {
        const usersRes = await getUsuarios();
        setUsuarios(usersRes.data);
      }
      const booksRes = await getLibrosDisponibles();
      setLibrosDisponibles(booksRes.data);

      // Pre-seleccionar usuario si es Lector
      if (userRole === 3) {
        setFormData({ ...formData, id_usuario: userId });
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos para la reserva");
    }
  };

  const handleCreateReserva = async (e) => {
    e.preventDefault();

    if (!formData.id_libro) {
      toast.warning("Seleccione un libro");
      return;
    }

    const reservaData = {
      id_usuario: userRole === 3 ? userId : Number(formData.id_usuario),
      id_libro: Number(formData.id_libro),
    };

    if (!reservaData.id_usuario) {
      toast.warning("Seleccione un usuario");
      return;
    }

    try {
      await createReserva(reservaData);
      toast.success("Reserva creada correctamente");
      setShowModal(false);
      setFormData({ id_usuario: "", id_libro: "" });
      fetchReservas();
    } catch (error) {
      console.error("Error al crear reserva:", error);
      const msg = error.response?.data?.message || "Error al crear la reserva";
      toast.error(msg);
    }
  };

  const getEstadoReserva = (reserva) => {
    if (reserva.fecha_devolucion) {
      return { text: "Devuelto", class: "estado-devuelto" };
    }
    return { text: "Activo", class: "estado-activo" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="loan-container">
      <div className="loan-header">
        <h1>{userRole === 3 ? "Mis Reservas" : "Gestión de Reservas"}</h1>
        <button className="btn-new-reserva" onClick={openNewReservaModal}>
          + Nueva Reserva
        </button>
      </div>

      {reservas.length === 0 ? (
        <div className="empty-state">
          <p>No hay reservas registradas</p>
          {userRole === 3 && (
            <p className="hint">
              Puede reservar libros desde el catálogo o usando el botón "Nueva
              Reserva"
            </p>
          )}
        </div>
      ) : (
        <div className="reservas-table-container">
          <table className="reservas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Libro</th>
                {userRole !== 3 && <th>Usuario</th>}
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => {
                const estado = getEstadoReserva(reserva);
                return (
                  <tr key={reserva.id_prestamo}>
                    <td>{reserva.id_prestamo}</td>
                    <td>{reserva.libro_titulo || `Libro #${reserva.id_libro}`}</td>
                    {userRole !== 3 && (
                      <td>
                        {reserva.usuario_nombre
                          ? `${reserva.usuario_nombre} ${reserva.usuario_apellido}`
                          : `Usuario #${reserva.id_usuario}`}
                      </td>
                    )}
                    <td>{formatDate(reserva.fecha_prestamo)}</td>
                    <td>{formatDate(reserva.fecha_devolucion)}</td>
                    <td>
                      <span className={`estado-badge ${estado.class}`}>
                        {estado.text}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {!reserva.fecha_devolucion && (
                        <button
                          className="btn-action btn-devolver"
                          onClick={() => handleDevolucion(reserva.id_prestamo)}
                          title="Registrar devolución"
                        >
                          ✓ Devolver
                        </button>
                      )}
                      {(userRole === 1 || userRole === 2) && (
                        <button
                          className="btn-action btn-eliminar"
                          onClick={() => handleDelete(reserva.id_prestamo)}
                          title="Eliminar reserva"
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para nueva reserva */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva Reserva</h2>
            <form onSubmit={handleCreateReserva}>
              {/* Selector de usuario (solo para Bibliotecario/Admin) */}
              {userRole !== 3 && (
                <div className="form-group">
                  <label>Usuario</label>
                  <select
                    value={formData.id_usuario}
                    onChange={(e) =>
                      setFormData({ ...formData, id_usuario: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar usuario...</option>
                    {usuarios.map((u) => (
                      <option key={u.id_usuario} value={u.id_usuario}>
                        {u.nombre} {u.apellido} ({u.mail})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selector de libro */}
              <div className="form-group">
                <label>Libro</label>
                <select
                  value={formData.id_libro}
                  onChange={(e) =>
                    setFormData({ ...formData, id_libro: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar libro...</option>
                  {librosDisponibles.map((libro) => (
                    <option key={libro.id_libro} value={libro.id_libro}>
                      {libro.titulo} - {libro.autor} (Stock: {libro.existencias})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Crear Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loan;
