# Usa una imagen liviana de Node.js versión 20 basada en Alpine Linux
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala solo las dependencias de producción de forma limpia
RUN npm ci --omit=dev

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Crea el directorio de 'uploads' por si no existe para evitar errores al subir archivos
RUN mkdir -p uploads

# Informa a Docker que el contenedor escuchará en el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación usando node
CMD ["node", "index.js"]

