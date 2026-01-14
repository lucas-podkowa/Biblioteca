import { Router } from "express";
import { getAllUsers, getUserById, updateUserById, deleteUser } from "../controller/user.controller.js";
import { valUpdateUser, valUserId, } from "../middleware/user.validator.js";
import { verifyToken, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas protegidas - solo Bibliotecario/Admin pueden gestionar usuarios
router.get("/usuarios", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), getAllUsers);
router.get("/usuarios/:id", verifyToken, valUserId, getUserById);
router.put("/usuarios/:id", verifyToken, requireRole(ROLES.ADMIN, ROLES.BIBLIOTECARIO), valUpdateUser, updateUserById);
router.delete("/usuarios/:id", verifyToken, requireRole(ROLES.ADMIN), valUserId, deleteUser);

export default router;
