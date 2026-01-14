import { useNavigate, Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ book }) {
  // Desestructuración del objeto recibido
  const { id_libro, titulo, autor, editorial, image_url, existencias } = book;
  const navigate = useNavigate();
  const userRole = Number(sessionStorage.getItem("role"));

  const handleClick = () => {
    navigate(`/libros/${id_libro}`);
  };

  return (
    <div className="book-card" onClick={handleClick}>
      <div className="book-card-image">
        {image_url ? (
          <img src={image_url} alt={titulo} />
        ) : (
          <div className="book-placeholder">📖</div>
        )}
        {existencias !== undefined && (
          <span
            className={`stock-badge ${existencias > 0 ? "available" : "unavailable"}`}
          >
            {existencias > 0 ? `${existencias} disp.` : "Agotado"}
          </span>
        )}
      </div>
      <div className="book-card-content">
        <h3 className="book-title">{titulo}</h3>
        <p className="book-author">{autor}</p>
        {editorial && <p className="book-editorial">{editorial}</p>}
      </div>

      {/* Opciones de gestión para Bibliotecario/Admin */}
      {(userRole === 1 || userRole === 2) && (
        <div className="book-card-actions" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/libro/editar/${id_libro}`}
            className="btn-edit"
          >
            ✏️ Editar
          </Link>
        </div>
      )}
    </div>
  );
}
