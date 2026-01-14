import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLibros, getResenias } from "../services/apiServices";
import BookCard from "../components/BookCard";
import "./Home.css";

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener libros para mostrar los destacados
        const booksResponse = await getLibros();
        // Mostrar los primeros 6 libros como destacados
        setFeaturedBooks(booksResponse.data.slice(0, 6));

        // Obtener reseñas recientes
        const reviewsResponse = await getResenias();
        // Mostrar las últimas 4 reseñas
        setRecentReviews(reviewsResponse.data.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenido a la <span className="highlight">Biblioteca</span>
          </h1>
          <p className="hero-subtitle">
            Descubre miles de libros, realiza préstamos y comparte tus opiniones
            con nuestra comunidad de lectores.
          </p>
          <div className="hero-actions">
            <Link to="/libros" className="btn-primary">
              Explorar Catálogo
            </Link>
            {!sessionStorage.getItem("token") && (
              <Link to="/register" className="btn-secondary">
                Crear Cuenta
              </Link>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">📚</span>
            <span className="stat-label">Amplio Catálogo</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🔄</span>
            <span className="stat-label">Préstamos Fáciles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">⭐</span>
            <span className="stat-label">Reseñas de la Comunidad</span>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Libros Destacados</h2>
          <Link to="/libros" className="view-all-link">
            Ver todos →
          </Link>
        </div>
        <div className="featured-books-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id_libro} book={book} />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="section-header">
          <h2>Reseñas Recientes</h2>
        </div>
        <div className="reviews-grid">
          {recentReviews.map((review) => (
            <div key={review.id_resenia} className="review-card">
              <div className="review-rating">
                {renderStars(review.calificacion)}
              </div>
              <p className="review-text">"{review.texto_resenia}"</p>
              <div className="review-footer">
                <span className="review-book">
                  Libro ID: {review.id_libro}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!sessionStorage.getItem("token") && (
        <section className="cta-section">
          <h2>¿Listo para comenzar?</h2>
          <p>
            Únete a nuestra comunidad y disfruta de todos los beneficios de la
            biblioteca.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn-primary">
              Registrarse Gratis
            </Link>
            <Link to="/login" className="btn-outline">
              Ya tengo cuenta
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
