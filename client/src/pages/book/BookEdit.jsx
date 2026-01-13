import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLibroById, updateLibro } from "../../services/apiServices";
import { toast } from "react-toastify";

const confToast = {
  position: "bottom-center",
  autoClose: 1000,
  theme: "light",
};

function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    anio_publicacion: "",
    genero: "",
    existencias: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const response = await getLibroById(id);
        setBook(response.data);
      } catch (error) {
        console.error("Error cargando libro:", error);
        toast.error("Error al cargar los datos del libro", confToast);
        navigate("/libros");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!book.titulo) newErrors.titulo = "El título es obligatorio";
    if (!book.autor) newErrors.autor = "El autor es obligatorio";
    if (!book.editorial) newErrors.editorial = "La editorial es obligatoria";
    if (!book.anio_publicacion)
      newErrors.anio_publicacion = "El año de publicación es obligatorio";
    if (!book.genero) newErrors.genero = "El género es obligatorio";
    return newErrors;
  };

  //-------------------------------------------------------
  // Manejar envío del formulario
  //-------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Preparar payload con tipos correctos
      const payload = {
        ...book,
        anio_publicacion: parseInt(book.anio_publicacion, 10),
        existencias: parseInt(book.existencias, 10),
      };

      // Actualizar libro existente
      const response = await updateLibro(id, payload);
      toast.success("Libro actualizado con éxito", confToast);

      // Redirigir a la lista de libros después del éxito
      if (response.status === 200 || response.status === 201) {
        setTimeout(() => navigate("/libros"), 1000);
      }
    } catch (error) {
      console.error("Error al guardar libro:", error);

      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error del servidor con respuesta
        const message =
          error.response.data?.message || "Error al guardar el libro";
        toast.error(message, confToast);
      } else {
        // Otro tipo de error
        toast.error("Ocurrió un error inesperado", confToast);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="section_forms">
        <div className="container_form">
          <p>Actualizando datos del libro...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section_forms">
      <form className="container_form" onSubmit={handleSubmit}>
        <input
          className="input_form"
          type="text"
          name="titulo"
          placeholder="Título"
          value={book.titulo}
          onChange={handleChange}
        />
        {errors.titulo && <span>{errors.titulo}</span>}
        <input
          className="input_form"
          type="text"
          name="autor"
          placeholder="Autor"
          value={book.autor}
          onChange={handleChange}
        />
        {errors.autor && <span>{errors.autor}</span>}
        <input
          className="input_form"
          type="text"
          name="editorial"
          placeholder="Editorial"
          value={book.editorial}
          onChange={handleChange}
        />
        {errors.editorial && <span>{errors.editorial}</span>}
        <input
          className="input_form"
          type="text"
          name="anio_publicacion"
          placeholder="Año de publicación"
          value={book.anio_publicacion}
          onChange={handleChange}
        />
        {errors.anio_publicacion && <span>{errors.anio_publicacion}</span>}
        <input
          className="input_form"
          type="text"
          name="genero"
          placeholder="Género"
          value={book.genero}
          onChange={handleChange}
        />
        {errors.genero && <span>{errors.genero}</span>}
        <input
          className="input_form"
          type="number"
          name="existencias"
          placeholder="Existencias"
          value={book.existencias}
          onChange={handleChange}
        />
        {errors.existencias && <span>{errors.existencias}</span>}
        <button type="submit">Actualizar libro</button>
      </form>
    </section>
  );
}

export default BookEdit;
