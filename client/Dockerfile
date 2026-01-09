# Etapa 1: Construcción (Build)
# Usa Node.js 20 en Alpine para compilar el proyecto frontend
FROM node:20-alpine as build

# Establece el directorio de trabajo para la etapa de construcción
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala todas las dependencias necesarias para construir el proyecto
RUN npm ci

# Copia el resto del código del frontend
COPY . .

# Ejecuta el script de construcción para generar los archivos estáticos (en la carpeta /dist)
RUN npm run build

# Etapa 2: Producción
# Usa el servidor web Nginx en versión Alpine para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos estáticos generados en la etapa anterior al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia un archivo de configuración personalizado de Nginx al contenedor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Informa que el contenedor escuchará en el puerto 80
EXPOSE 80

# Inicia Nginx en primer plano para mantener el contenedor en ejecución
CMD ["nginx", "-g", "daemon off;"]

