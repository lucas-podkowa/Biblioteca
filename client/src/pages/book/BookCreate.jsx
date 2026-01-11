import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLibroWithImage } from "../../services/apiServices";
import { toast } from "react-toastify";

function BookCreate() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [book, setBook] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    anio_publicacion: "",
    genero: "",
    imagen: null,
    // existencias: "",
  });

  const confToast = {
    position: "bottom-center",
    autoClose: 20000,
    theme: "light",
  };

  //... (omitted code)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      //---------------------------- con imagen --------------------

      const formData = new FormData();
      formData.append("titulo", book.titulo);
      formData.append("autor", book.autor);
      formData.append("editorial", book.editorial);
      formData.append("anio_publicacion", book.anio_publicacion);
      formData.append("genero", book.genero);

      // Si el campo imagen no es null, lo agregamos
      if (book.imagen) formData.append("imagen", book.imagen);

      const response = await createLibroWithImage(formData);
      //---------------------------- con imagen --------------------

      //---------------------modo corto --------------------
      // const formData = new FormData();
      // Object.entries(book).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      //---------------------modo corto --------------------

      if (response.status === 201 || response.status === 200) {
        toast.success("Libro creado con exito", confToast);
        navigate("/libros");
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        // Si viene un array de errores del backend (express-validator)
        if (Array.isArray(data.errors)) {
          //const fieldErrors = {};
          data.errors.forEach((err) => {
            toast.error(err.msg, confToast);
            //fieldErrors[err.path] = err.msg;
          });

          // setErrors((prevErrors) => ({
          //   ...prevErrors,
          //   ...fieldErrors
          // }));
        }

        // Si viene un mensaje simple (otro tipo de error)
        else if (data.message) {
          toast.error(data.message, confToast);
        } else {
          toast.error("Error al guardar el libro", confToast);
        }
      } else {
        toast.error("Ocurrió un error inesperado", confToast);
      }
    }
  };

  return (
    <section className="section_forms">
      <form className="container_form" onSubmit={handleSubmit}>
        <div>
          {/* <label className="label_form">Título</label> */}
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            onChange={handleChange}
            className="input_form"
          />
          {errors.titulo && <span className="requerido">{errors.titulo}</span>}
        </div>

        <div>
          {/* <label className="label_form">Autor</label> */}
          <input
            type="text"
            name="autor"
            placeholder="Autor"
            onChange={handleChange}
            value={book.autor}
            className="input_form"
          />
          {errors.autor && <span className="requerido">{errors.autor}</span>}
        </div>

        <div>
          {/* <label className="label_form">Editorial</label> */}
          <input
            type="text"
            name="editorial"
            placeholder="Editorial"
            onChange={handleChange}
            className="input_form"
          />
          {errors.editorial && (
            <span className="requerido">{errors.editorial}</span>
          )}
        </div>

        <div>
          {/* <label className="label_form">Año de publicación</label> */}
          <input
            type="text"
            name="anio_publicacion"
            placeholder="Año de publicación"
            onChange={handleChange}
            className="input_form"
          />
          {errors.anio_publicacion && (
            <span className="requerido">{errors.anio_publicacion}</span>
          )}
        </div>

        <div>
          {/* <label className="label_form">Género</label> */}
          <input
            type="text"
            name="genero"
            placeholder="Género"
            onChange={handleChange}
            className="input_form"
          />
          {errors.genero && <span className="requerido">{errors.genero}</span>}
        </div>

        {/* ------------------------------------------------------------ */}
        <div>
          {/* <label className="label_form">Imágen</label> */}
          <input
            type="file"
            name="imagen"
            placeholder="Imágen"
            // onChange={handleImagen}
            onChange={handleChange}
            className="input_form"
          />
          {errors.imagen && <span className="requerido">{errors.imagen}</span>}
        </div>
        {/* ------------------------------------------------------------ */}

        {/* <div>
          <label className="label_form">Existencias</label>
          <input
            type="number"
            name="existencias"
            placeholder="Existencias"
            onChange={handleChange}
            className="input_form"
          />
          {errors.existencias && (
            <span className="requerido">{errors.existencias}</span>
          )}
        </div> */}

        <div className="div_btn">
          <button type="submit" className="btn_login">
            Crear libro
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookCreate;
