import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/apiServices";

export default function Register() {
    let confToast = {
        position: "bottom-center",
        autoClose: 2000,
        theme: "light",
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        mail: "",
        pass: "",
        confirmPass: "",
    });

    // Expresión regular para validar email
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Validación de contraseña: mínimo 6 caracteres, al menos 1 dígito, 1 minúscula y 1 mayúscula
    const isValidPassword = (password) => {
        return (
            password.length >= 6 &&
            /\d/.test(password) &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password)
        );
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            toast.error("Por favor, completa todos los campos.", confToast);
            return;
        }

        if (!isValidEmail(formData.mail)) {
            toast.error(
                "Por favor, ingresa un correo electrónico válido.",
                confToast
            );
            return;
        }

        if (!isValidPassword(formData.pass)) {
            toast.error(
                "La contraseña debe tener al menos 6 caracteres, al menos 1 dígito, 1 minúscula y 1 mayúscula",
                confToast
            );
            return;
        }

        if (formData.pass !== formData.confirmPass) {
            toast.error("Las contraseñas no coinciden.", confToast);
            return;
        }

        try {
            const userData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                mail: formData.mail,
                pass: formData.pass,
            };

            await register(userData);
            toast.success("Registro exitoso. Redirigiendo al login...", confToast);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Error al registrar usuario", confToast);
            } else {
                toast.error("Error de conexión: " + error.message, confToast);
            }
        }
    };

    return (
        <section className="section_forms">
            <form onSubmit={handleSubmit} className="container_form">
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Crear Cuenta
                </h2>

                <div>
                    <label className="label_form">
                        Nombre <span className="requerido">*</span>
                    </label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="input_form"
                        type="text"
                        required
                    />
                </div>

                <div>
                    <label className="label_form">
                        Apellido <span className="requerido">*</span>
                    </label>
                    <input
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="input_form"
                        type="text"
                        required
                    />
                </div>

                <div>
                    <label className="label_form">
                        Email <span className="requerido">*</span>
                    </label>
                    <input
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        className="input_form"
                        type="email"
                        required
                    />
                </div>

                <div>
                    <label className="label_form">
                        Contraseña <span className="requerido">*</span>
                    </label>
                    <input
                        name="pass"
                        value={formData.pass}
                        onChange={handleChange}
                        className="input_form"
                        type="password"
                        required
                    />
                </div>

                <div>
                    <label className="label_form">
                        Confirmar Contraseña <span className="requerido">*</span>
                    </label>
                    <input
                        name="confirmPass"
                        value={formData.confirmPass}
                        onChange={handleChange}
                        className="input_form"
                        type="password"
                        required
                    />
                </div>

                <div className="div_btn">
                    <input className="btn_login" type="submit" value="Registrarse" />
                </div>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <p style={{ fontSize: "0.9rem" }}>
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            style={{ color: "var(--azul-claro)", fontWeight: "bold" }}
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    );
}
