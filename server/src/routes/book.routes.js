import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getAvailableBooks,
  updateBookStock,
} from "../controller/book.controller.js";

import {
  valCreateBook,
  valUpdateBook,
  valUpdateBookStock,
  valBookId,
} from "../middleware/book.validator.js";

import { verifyToken, requireRole, ROLES } from "../middleware/auth.middleware.js";

import { upSimple } from "../middleware/filesUpload.js";

const router = Router();

// Rutas públicas - cualquiera puede ver libros
router.get("/libros", getAllBooks);
router.get("/libros/disponibles", getAvailableBooks);
router.get("/libros/:id", valBookId, getBookById);

// Rutas protegidas - solo Bibliotecario/Admin pueden gestionar libros
router.post("/libros", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), upSimple, valCreateBook, createBook);
router.put("/libros/:id", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valUpdateBook, updateBookById);
router.patch("/libros/:id/existencias", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valUpdateBookStock, updateBookStock);
router.delete("/libros/:id", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valBookId, deleteBookById);

export default router;
