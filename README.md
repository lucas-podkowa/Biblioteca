# Biblioteca (Gestión de Libros)

Este proyecto es una aplicación web para la gestión de una biblioteca, construida con una arquitectura de cliente-servidor (frontend y backend separados).

## Tecnologías Utilizadas

### Frontend (Cliente)
- **Framework:** React 18+ (con Vite)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **UI Feedback:** React Toastify
- **Autenticación:** JWT Decode

### Backend (Servidor)
- **Servidor:** Node.js con Express
- **Base de Datos:** PostgreSQL (`pg`)
- **Autenticación:** JSON Web Tokens (JWT) y Bcryptjs
- **Manejo de Archivos:** Multer
- **Validaciones:** Express Validator
- **Logging:** Morgan

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales:

- `/client`: Contiene el código fuente del frontend React.
- `/server`: Contiene el código fuente de la API RESTful en Node.js/Express.

## Configuración e Instalación

### Requisitos Previos
- Node.js instalado.
- PostgreSQL instalado y configurado (Base de datos creada).

### Instalación del Servidor (Backend)

1. Navega al directorio del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Crea un archivo `.env` basado en la configuración de base de datos y llaves secretas necesarias.
4. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### Instalación del Cliente (Frontend)

1. Navega al directorio del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el cliente en modo desarrollo:
   ```bash
   npm run dev
   ```

## Autores
Desarrollado como parte de un proyecto de gestión de bibliotecas.

## Docker y CI/CD

El proyecto cuenta con una configuración para despliegue automatizado utilizando GitHub Actions y paquetes de Docker.

### Pipeline de CI/CD
El flujo de trabajo se encuentra en `.github/workflows/ci-cd.yml` y realiza lo siguiente:
1. **CI (Integración Continua)**: En cada Pull Request a `main`, se instalan dependencias, se ejecuta el linter y se verifica que el cliente compile correctamente.
2. **CD (Despliegue Continuo)**: Al hacer push a la rama `main`:
   - Construye las imágenes Docker para `client` y `server`.
   - Las sube al **GitHub Container Registry (GHCR)**.

### Variables de Entorno en GitHub
Para que el cliente se construya apuntando a la API de producción correcta en el pipeline, debes configurar el secreto en el repositorio de GitHub:
- Ve a **Settings > Secrets and variables > Actions**.
- Crea un **New repository secret**.
- Nombre: `VITE_API_BASE_URL`
- Valor: La URL pública de tu backend desplegado (ejemplo: `https://api.tu-dominio.com/api`).

