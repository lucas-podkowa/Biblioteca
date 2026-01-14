import axiosInstance from "./axiosInstance";

// ============================================
// Autenticación
// ============================================

/**
 * Iniciar sesión con email y contraseña
 * @param {Object} credentials - { mail, pass }
 * @returns {Promise} - Respuesta del servidor con token
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response;
};

/**
 * Registrar un nuevo usuario
 * @param {Object} userData - { nombre, apellido, mail, pass }
 * @returns {Promise} - Respuesta del servidor
 */
export const register = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response;
};

// ============================================
// Usuarios
// ============================================

/**
 * Obtener lista de todos los usuarios
 * @returns {Promise} - Lista de usuarios
 */
export const getUsuarios = async () => {
  const response = await axiosInstance.get("/usuarios/");
  return response;
};

/**
 * Obtener un usuario por su ID
 * @param {number|string} id - ID del usuario
 * @returns {Promise} - Datos del usuario
 */
export const getUsuarioById = async (id) => {
  const response = await axiosInstance.get(`/usuarios/${id}`);
  return response;
};

// ============================================
// Libros
// ============================================

/**
 * Obtener lista de libros con filtro opcional
 * @param {string} searchTerm - Término de búsqueda opcional
 * @returns {Promise} - Lista de libros
 */
export const getLibros = async (searchTerm = "") => {
  const response = await axiosInstance.get("/libros", {
    params: { searchTerm },
  });
  return response;
};

/**
 * Obtener libros disponibles (con existencias > 0)
 * @returns {Promise} - Lista de libros disponibles
 */
export const getLibrosDisponibles = async () => {
  const response = await axiosInstance.get("/libros/disponibles");
  return response;
};

/**
 * Obtener un libro por su ID
 * @param {number|string} id - ID del libro
 * @returns {Promise} - Datos del libro
 */
export const getLibroById = async (id) => {
  const response = await axiosInstance.get(`/libros/${id}`);
  return response;
};

/**
 * Crear un nuevo libro (sin imagen)
 * @param {Object} bookData - Datos del libro
 * @returns {Promise} - Respuesta del servidor
 */
export const createLibro = async (bookData) => {
  const response = await axiosInstance.post("/libros", bookData);
  return response;
};

/**
 * Crear un nuevo libro con imagen (FormData)
 * @param {FormData} formData - FormData con datos del libro e imagen
 * @returns {Promise} - Respuesta del servidor
 */
export const createLibroWithImage = async (formData) => {
  const response = await axiosInstance.post("/libros", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * Actualizar un libro existente
 * @param {number|string} id - ID del libro
 * @param {Object} bookData - Datos actualizados del libro
 * @returns {Promise} - Respuesta del servidor
 */
export const updateLibro = async (id, bookData) => {
  const response = await axiosInstance.put(`/libros/${id}`, bookData);
  return response;
};

/**
 * Eliminar un libro
 * @param {number|string} id - ID del libro
 * @returns {Promise} - Respuesta del servidor
 */
export const deleteLibro = async (id) => {
  const response = await axiosInstance.delete(`/libros/${id}`);
  return response;
};

// ============================================
// Reservas (Préstamos)
// ============================================

/**
 * Obtener todas las reservas (solo Bibliotecario/Admin)
 * @returns {Promise} - Lista de todas las reservas
 */
export const getReservas = async () => {
  const response = await axiosInstance.get("/prestamos");
  return response;
};

/**
 * Obtener reservas de un usuario específico
 * @param {number|string} userId - ID del usuario
 * @returns {Promise} - Lista de reservas del usuario
 */
export const getReservasByUsuario = async (userId) => {
  const response = await axiosInstance.get(`/prestamos/usuario/${userId}`);
  return response;
};

/**
 * Obtener una reserva por su ID
 * @param {number|string} id - ID de la reserva
 * @returns {Promise} - Datos de la reserva
 */
export const getReservaById = async (id) => {
  const response = await axiosInstance.get(`/prestamos/${id}`);
  return response;
};

/**
 * Crear una nueva reserva
 * @param {Object} reservaData - { id_usuario, id_libro }
 * @returns {Promise} - Reserva creada
 */
export const createReserva = async (reservaData) => {
  const response = await axiosInstance.post("/prestamos", reservaData);
  return response;
};

/**
 * Actualizar una reserva (principalmente para devoluciones)
 * @param {number|string} id - ID de la reserva
 * @param {Object} reservaData - Datos actualizados
 * @returns {Promise} - Respuesta del servidor
 */
export const updateReserva = async (id, reservaData) => {
  const response = await axiosInstance.put(`/prestamos/${id}`, reservaData);
  return response;
};

/**
 * Registrar devolución de un libro
 * @param {number|string} id - ID de la reserva
 * @returns {Promise} - Respuesta del servidor
 */
export const devolverLibro = async (id) => {
  const fechaDevolucion = new Date().toISOString().split('T')[0];
  const response = await axiosInstance.put(`/prestamos/${id}`, {
    fecha_devolucion: fechaDevolucion
  });
  return response;
};

/**
 * Eliminar una reserva
 * @param {number|string} id - ID de la reserva
 * @returns {Promise} - Respuesta del servidor
 */
export const deleteReserva = async (id) => {
  const response = await axiosInstance.delete(`/prestamos/${id}`);
  return response;
};

// ============================================
// Reseñas
// ============================================

/**
 * Obtener todas las reseñas
 * @returns {Promise} - Lista de todas las reseñas
 */
export const getResenias = async () => {
  const response = await axiosInstance.get("/resenias");
  return response;
};

/**
 * Obtener reseñas de un libro específico
 * @param {number|string} libroId - ID del libro
 * @returns {Promise} - Lista de reseñas del libro
 */
export const getReseniasByLibro = async (libroId) => {
  const response = await axiosInstance.get(`/resenias/libro/${libroId}`);
  return response;
};

/**
 * Obtener reseñas de un usuario específico
 * @param {number|string} userId - ID del usuario
 * @returns {Promise} - Lista de reseñas del usuario
 */
export const getReseniasByUsuario = async (userId) => {
  const response = await axiosInstance.get(`/resenias/usuario/${userId}`);
  return response;
};

/**
 * Crear una nueva reseña
 * @param {Object} reseniaData - { id_usuario, id_libro, texto_resenia, calificacion }
 * @returns {Promise} - Reseña creada
 */
export const createResenia = async (reseniaData) => {
  const response = await axiosInstance.post("/resenias", reseniaData);
  return response;
};

/**
 * Actualizar una reseña existente
 * @param {number|string} id - ID de la reseña
 * @param {Object} reseniaData - Datos actualizados
 * @returns {Promise} - Respuesta del servidor
 */
export const updateResenia = async (id, reseniaData) => {
  const response = await axiosInstance.put(`/resenias/${id}`, reseniaData);
  return response;
};

/**
 * Eliminar una reseña
 * @param {number|string} id - ID de la reseña
 * @returns {Promise} - Respuesta del servidor
 */
export const deleteResenia = async (id) => {
  const response = await axiosInstance.delete(`/resenias/${id}`);
  return response;
};
