import "./styles/misEstilos.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import About from "./pages/About";
import Loan from "./pages/Loan";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Register from "./pages/auth/Register";
import Usuarios from "./pages/auth/Usuarios";
import Login from "./pages/auth/Login";

// importacion de libros
import Books from "./pages/book/Books";
import BookCreate from "./pages/book/BookCreate";
import BookEdit from "./pages/book/BookEdit";
import BookDetail from "./components/BookDetail";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Menu></Menu>
      {/* fuera de las rutas se coloca la barra de navegacion para que esté siempre visible */}

      <section className="contenido">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/usuarios" element={<Usuarios />}></Route>

          <Route path="/libro/crear" element={<BookCreate />} />
          <Route path="/libro/editar/:id" element={<BookEdit />}></Route>

          {/* Ruta padre */}
          <Route path="/libros" element={<Books />}>
            {/* Ruta hija */}
            <Route path=":id" element={<BookDetail />} />
          </Route>

          <Route path="/reservas/" element={<Loan></Loan>}></Route>
          <Route path="/nosotros" element={<About></About>}></Route>
          {/* la ruta de escape/falla siempre se coloca al final */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </section>

      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
