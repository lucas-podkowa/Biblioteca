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
  const response = await axiosInstance.post("/auth/login", credentials, {
    headers: {
      authorization: localStorage.getItem("permiso"),
    },
  });
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
