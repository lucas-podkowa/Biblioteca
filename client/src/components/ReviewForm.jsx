import { useState } from "react";
import { toast } from "react-toastify";
import { createResenia } from "../services/apiServices";
import "./ReviewForm.css";

export default function ReviewForm({ libroId, userId, onReviewAdded }) {
    const [calificacion, setCalificacion] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [texto, setTexto] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (calificacion === 0) {
            toast.warning("Por favor, seleccione una calificación");
            return;
        }

        if (!texto.trim()) {
            toast.warning("Por favor, escriba su reseña");
            return;
        }

        setSubmitting(true);

        try {
            await createResenia({
                id_usuario: userId,
                id_libro: libroId,
                texto_resenia: texto.trim(),
                calificacion: calificacion,
            });

            toast.success("¡Reseña enviada correctamente!");
            setCalificacion(0);
            setTexto("");

            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error("Error al crear reseña:", error);
            const msg = error.response?.data?.message || "Error al enviar la reseña";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>Escribir una reseña</h3>
            <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="rating-input">
                    <label>Tu calificación:</label>
                    <div className="stars-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${star <= (hoverRating || calificacion) ? "active" : ""
                                    }`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setCalificacion(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Area */}
                <div className="text-input">
                    <label htmlFor="reviewText">Tu reseña:</label>
                    <textarea
                        id="reviewText"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Comparte tu experiencia con este libro..."
                        rows={4}
                        maxLength={500}
                    />
                    <span className="char-count">{texto.length}/500</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-submit-review"
                    disabled={submitting}
                >
                    {submitting ? "Enviando..." : "Enviar Reseña"}
                </button>
            </form>
        </div>
    );
}
