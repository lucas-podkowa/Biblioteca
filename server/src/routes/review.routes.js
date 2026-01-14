import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  getReviewsByBookId,
  getReviewsByUserId,
  createReview,
  updateReviewById,
  deleteReviewById,
} from "../controller/review.controller.js";
import { valCreateReview, valUpdateReview, valReviewId, valBookId, } from "../middleware/review.validator.js";
import { verifyToken, optionalAuth, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas - cualquiera puede ver reseñas
router.get("/resenias", getAllReviews);
router.get("/resenias/libro/:id_libro", valBookId, getReviewsByBookId);
router.get("/resenias/:id", valReviewId, getReviewById);

// Rutas protegidas - requieren autenticación
// Obtener reseñas del usuario actual
router.get("/resenias/usuario/:id_usuario", verifyToken, getReviewsByUserId);

// Crear reseña - solo usuarios autenticados (Lectores)
router.post("/resenias", verifyToken, valCreateReview, createReview);

// Actualizar reseña - solo el autor o admin
router.put("/resenias/:id", verifyToken, valUpdateReview, updateReviewById);

// Eliminar reseña - solo el autor, bibliotecario o admin
router.delete("/resenias/:id", verifyToken, valReviewId, deleteReviewById);

export default router;
