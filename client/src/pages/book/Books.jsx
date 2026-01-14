import "./../../styles/misEstilos.css";
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BookCard from "./../../components/BookCard";
import { getLibros } from "../../services/apiServices";

function Books() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const userRole = Number(sessionStorage.getItem("role"));

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getLibros();
        setBooks(response.data);
        setAllBooks(response.data);
      } catch (error) {
        console.error("Error al traer libros:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // Filtramos localmente cada vez que cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setBooks(allBooks);
    } else {
      const filtered = allBooks.filter(
        (libro) =>
          libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          libro.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setBooks(filtered);
    }
  }, [searchTerm, allBooks]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando libros...</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <Outlet />

      <div className="books-header">
        <h1>Catálogo de Libros</h1>
        <p className="books-subtitle">
          Explora nuestra colección de {allBooks.length} libros
        </p>
      </div>

      {/* Toolbar con buscador y acciones */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="buscador"
        />

        {/* Botón de crear libro solo para Bibliotecario/Admin */}
        {(userRole === 1 || userRole === 2) && (
          <Link to="/libro/crear" className="btn-crear-libro">
            + Nuevo Libro
          </Link>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {searchTerm && (
        <p className="search-results">
          {books.length} resultado{books.length !== 1 ? "s" : ""} para "{searchTerm}"
        </p>
      )}

      {/* Grid de libros */}
      {books.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron libros</p>
          {searchTerm && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchTerm("")}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="books-container">
          {books.map((unLibro) => (
            <BookCard key={unLibro.id_libro} book={unLibro} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;
