import { getAll, getById, create, updateById, deleteById, getByUserId, getByBookId, getActiveByBookId } from "../model/reserve.model.js";
import bookModel from "../model/book.model.js";

export const getAllReserves = async (req, res) => {
  try {
    const reserves = await getAll();
    res.status(200).json(reserves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReserveById = async (req, res) => {
  try {
    const reserve = await getById(req.params.id);
    if (!reserve) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.status(200).json(reserve);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReserve = async (req, res) => {
  try {
    const { id_usuario, id_libro } = req.body;

    // Verificar que el usuario autenticado puede crear esta reserva
    // Lector solo puede crear para sí mismo, Bibliotecario para cualquiera
    if (req.user.rol === 3 && req.user.id !== id_usuario) {
      return res.status(403).json({
        message: "No puede crear reservas para otros usuarios"
      });
    }

    // Verificar disponibilidad del libro
    const book = await bookModel.getById(id_libro);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (book.existencias <= 0) {
      return res.status(400).json({
        message: "No hay existencias disponibles de este libro"
      });
    }

    // Verificar si el usuario ya tiene este libro prestado
    const activeReserves = await getActiveByBookId(id_libro);
    const userHasBook = activeReserves.some(r => r.id_usuario === id_usuario);
    if (userHasBook) {
      return res.status(400).json({
        message: "Ya tiene este libro en préstamo"
      });
    }

    // Crear la reserva con fecha actual
    const fecha_prestamo = new Date().toISOString().split('T')[0];
    const newReserve = await create({
      id_usuario,
      id_libro,
      fecha_prestamo,
      fecha_devolucion: null
    });

    // Decrementar existencias del libro
    await bookModel.updateStockById(id_libro, book.existencias - 1);

    res.status(201).json(newReserve);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReserveById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_devolucion } = req.body;

    // Obtener la reserva actual
    const currentReserve = await getById(id);
    if (!currentReserve) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // Si se está registrando una devolución (fecha_devolucion no era null y ahora sí)
    if (fecha_devolucion && !currentReserve.fecha_devolucion) {
      // Incrementar existencias del libro
      const book = await bookModel.getById(currentReserve.id_libro);
      if (book) {
        await bookModel.updateStockById(currentReserve.id_libro, book.existencias + 1);
      }
    }

    const updated = await updateById(id, { ...currentReserve, ...req.body });
    if (!updated) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.status(200).json({ message: "Reserva actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReserveById = async (req, res) => {
  try {
    const reserve = await getById(req.params.id);
    if (!reserve) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // Si la reserva está activa (no devuelta), incrementar existencias
    if (!reserve.fecha_devolucion) {
      const book = await bookModel.getById(reserve.id_libro);
      if (book) {
        await bookModel.updateStockById(reserve.id_libro, book.existencias + 1);
      }
    }

    const deleted = await deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.status(200).json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservesByUserId = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Lector solo puede ver sus propias reservas
    if (req.user.rol === 3 && req.user.id !== Number(id_usuario)) {
      return res.status(403).json({
        message: "No puede ver reservas de otros usuarios"
      });
    }

    const reserves = await getByUserId(id_usuario);
    res.status(200).json(reserves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservesByBookId = async (req, res) => {
  try {
    const reserves = await getByBookId(req.params.id_libro);
    res.status(200).json(reserves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};