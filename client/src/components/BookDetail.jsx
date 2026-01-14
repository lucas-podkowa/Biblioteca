import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  getLibroById,
  getReseniasByLibro,
  createReserva,
  getReservasByUsuario,
} from "../services/apiServices";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import "./BookDetail.css";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasReservedBook, setHasReservedBook] = useState(false);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserId(decoded.id);
        setUserRole(decoded.rol);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBookData();
  }, [id]);

  useEffect(() => {
    // Check if user has reserved this book (for review permissions)
    if (userId && id) {
      checkUserReservation();
    }
  }, [userId, id]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const [bookRes, reviewsRes] = await Promise.all([
        getLibroById(id),
        getReseniasByLibro(id),
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error al cargar libro:", error);
      toast.error("Error al cargar el libro");
    } finally {
      setLoading(false);
    }
  };

  const checkUserReservation = async () => {
    try {
      const res = await getReservasByUsuario(userId);
      const hasReserved = res.data.some(
        (r) => r.id_libro === Number(id)
      );
      setHasReservedBook(hasReserved);
    } catch {
      // Si falla, asumir que no ha reservado
      setHasReservedBook(false);
    }
  };

  const handleReservar = async () => {
    if (!isLoggedIn) {
      toast.info("Inicie sesión para reservar libros");
      navigate("/login");
      return;
    }

    if (!book.existencias || book.existencias <= 0) {
      toast.warning("No hay existencias disponibles");
      return;
    }

    setReserving(true);
    try {
      await createReserva({
        id_usuario: userId,
        id_libro: Number(id),
      });
      toast.success("¡Libro reservado correctamente!");
      // Refetch book to update stock
      fetchBookData();
      setHasReservedBook(true);
    } catch (error) {
      console.error("Error al reservar:", error);
      const msg = error.response?.data?.message || "Error al reservar el libro";
      toast.error(msg);
    } finally {
      setReserving(false);
    }
  };

  const handleReviewAdded = () => {
    // Refetch reviews
    getReseniasByLibro(id).then((res) => setReviews(res.data));
  };

  if (loading) {
    return (
      <div className="book-detail-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-error">
        <p>Libro no encontrado</p>
        <button onClick={() => navigate("/libros")}>Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div className="book-detail">
      <button className="btn-back" onClick={() => navigate("/libros")}>
        ← Volver al catálogo
      </button>

      <div className="book-detail-content">
        {/* Book Info Section */}
        <div className="book-info-section">
          <div className="book-cover">
            {book.image_url ? (
              <img src={book.image_url} alt={book.titulo} />
            ) : (
              <div className="book-cover-placeholder">📖</div>
            )}
          </div>

          <div className="book-info">
            <h1>{book.titulo}</h1>
            <p className="book-author">por {book.autor}</p>

            <div className="book-metadata">
              {book.editorial && (
                <div className="meta-item">
                  <span className="meta-label">Editorial:</span>
                  <span>{book.editorial}</span>
                </div>
              )}
              {book.anio_publicacion && (
                <div className="meta-item">
                  <span className="meta-label">Año:</span>
                  <span>{book.anio_publicacion}</span>
                </div>
              )}
              {book.genero && (
                <div className="meta-item">
                  <span className="meta-label">Género:</span>
                  <span>{book.genero}</span>
                </div>
              )}
            </div>

            {/* Stock and Reserve */}
            <div className="book-availability">
              <div className="stock-info">
                <span className="stock-label">Disponibles:</span>
                <span
                  className={`stock-number ${book.existencias > 0 ? "in-stock" : "out-of-stock"
                    }`}
                >
                  {book.existencias || 0} unidades
                </span>
              </div>

              {isLoggedIn && userRole === 3 && (
                <button
                  className="btn-reservar"
                  onClick={handleReservar}
                  disabled={reserving || !book.existencias || book.existencias <= 0}
                >
                  {reserving
                    ? "Reservando..."
                    : book.existencias > 0
                      ? "📚 Reservar Libro"
                      : "Sin existencias"}
                </button>
              )}

              {!isLoggedIn && (
                <p className="login-hint">
                  <a href="/login">Inicie sesión</a> para reservar este libro
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="book-reviews-section">
          <ReviewList reviews={reviews} />

          {/* Show review form only if user is logged in and has reserved the book */}
          {isLoggedIn && hasReservedBook && (
            <ReviewForm
              libroId={Number(id)}
              userId={userId}
              onReviewAdded={handleReviewAdded}
            />
          )}

          {isLoggedIn && !hasReservedBook && userRole === 3 && (
            <div className="review-hint">
              <p>📝 Reserve este libro para poder dejar una reseña</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
