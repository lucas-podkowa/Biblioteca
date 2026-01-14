import { pool } from "../config/db.js";

export const getAll = async () => {
  try {
    const query = `
      SELECT p.*, 
             l.titulo as libro_titulo,
             u.nombre as usuario_nombre,
             u.apellido as usuario_apellido
      FROM prestamo p
      JOIN libro l ON p.id_libro = l.id_libro
      JOIN usuario u ON p.id_usuario = u.id_usuario
      ORDER BY p.fecha_prestamo DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching reserves:", error);
    throw new Error("Could not fetch reserves from the database.");
  }
};

export const getById = async (id) => {
  try {
    const query = "SELECT * FROM prestamo WHERE id_prestamo = $1";
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(`Error fetching reserve with id ${id}:`, error);
    throw new Error(`Could not fetch reserve with id ${id} from the database.`);
  }
};

export const create = async (reserve) => {
  try {
    const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = reserve;
    const query = "INSERT INTO prestamo (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) VALUES ($1, $2, $3, $4) RETURNING id_prestamo";
    const { rows } = await pool.query(query, [id_usuario, id_libro, fecha_prestamo, fecha_devolucion]);
    return { id: rows[0].id_prestamo, ...reserve };
  } catch (error) {
    console.error("Error creating reserve:", error);
    throw new Error("Could not create reserve in the database.");
  }
};

export const updateById = async (id, reserve) => {
  try {
    const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = reserve;
    const query = "UPDATE prestamo SET id_usuario = $1, id_libro = $2, fecha_prestamo = $3, fecha_devolucion = $4 WHERE id_prestamo = $5";
    const result = await pool.query(query, [id_usuario, id_libro, fecha_prestamo, fecha_devolucion, id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error updating reserve with id ${id}:`, error);
    throw new Error(`Could not update reserve with id ${id} in the database.`);
  }
};

export const deleteById = async (id) => {
  try {
    const query = "DELETE FROM prestamo WHERE id_prestamo = $1";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting reserve with id ${id}:`, error);
    throw new Error(`Could not delete reserve with id ${id} from the database.`);
  }
};

export const getByUserId = async (userId) => {
  try {
    const query = `
      SELECT p.*, l.titulo as libro_titulo, l.autor as libro_autor
      FROM prestamo p
      JOIN libro l ON p.id_libro = l.id_libro
      WHERE p.id_usuario = $1
      ORDER BY p.fecha_prestamo DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching reserves for user with id ${userId}:`, error);
    throw new Error(`Could not fetch reserves for user with id ${userId} from the database.`);
  }
};

export const getByBookId = async (bookId) => {
  try {
    const query = `
      SELECT p.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
      FROM prestamo p
      JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_libro = $1
      ORDER BY p.fecha_prestamo DESC
    `;
    const { rows } = await pool.query(query, [bookId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching reserves for book with id ${bookId}:`, error);
    throw new Error(`Could not fetch reserves for book with id ${bookId} from the database.`);
  }
};

export const getActiveByBookId = async (bookId) => {
  try {
    const query = "SELECT * FROM prestamo WHERE id_libro = $1 AND fecha_devolucion IS NULL";
    const { rows } = await pool.query(query, [bookId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching active reserves for book with id ${bookId}:`, error);
    throw new Error(`Could not fetch active reserves for book with id ${bookId} from the database.`);
  }
};
