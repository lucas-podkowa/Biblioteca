import "./ReviewList.css";

export default function ReviewList({ reviews }) {
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

    if (!reviews || reviews.length === 0) {
        return (
            <div className="no-reviews">
                <p>No hay reseñas para este libro aún.</p>
                <p className="hint">¡Sé el primero en dejar una reseña!</p>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            <h3>Reseñas ({reviews.length})</h3>
            <div className="reviews-container">
                {reviews.map((review) => (
                    <div key={review.id_resenia} className="review-item">
                        <div className="review-header">
                            <div className="review-rating">{renderStars(review.calificacion)}</div>
                            <span className="review-user">
                                Usuario #{review.id_usuario}
                            </span>
                        </div>
                        <p className="review-text">{review.texto_resenia}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
