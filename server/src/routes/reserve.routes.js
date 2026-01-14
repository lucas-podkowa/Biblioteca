import { Router } from "express";
import {
  getAllReserves,
  getReserveById,
  createReserve,
  updateReserveById,
  deleteReserveById,
  getReservesByUserId,
  getReservesByBookId,
} from "../controller/reserve.controller.js";

import { valCreateReserve, valUpdateReserve, valReserveId, valUserId, valBookId, } from "../middleware/reserve.validator.js";
import { verifyToken, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas - ninguna (las reservas requieren autenticación)

// Rutas protegidas - requieren autenticación
// Obtener todas las reservas (solo Bibliotecario/Admin)
router.get("/prestamos", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), getAllReserves);

// Obtener reservas de un usuario específico
// Bibliotecario puede ver cualquiera, Lector solo las suyas propias
router.get("/prestamos/usuario/:id_usuario", verifyToken, valUserId, getReservesByUserId);

// Obtener reservas de un libro (Bibliotecario/Admin)
router.get("/prestamos/libro/:id_libro", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valBookId, getReservesByBookId);

// Obtener una reserva por ID
router.get("/prestamos/:id", verifyToken, valReserveId, getReserveById);

// Crear reserva - Lector puede crear para sí mismo, Bibliotecario para cualquier usuario
router.post("/prestamos", verifyToken, valCreateReserve, createReserve);

// Actualizar reserva (principalmente para devoluciones) - Bibliotecario/Admin
router.put("/prestamos/:id", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valUpdateReserve, updateReserveById);

// Eliminar reserva - Bibliotecario/Admin
router.delete("/prestamos/:id", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valReserveId, deleteReserveById);

export default router;
