# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build-stage
 
# Establece el directorio de trabajo
WORKDIR /app
 
# Copia el archivo de configuración de paquetes y los instala
COPY package*.json ./
RUN npm install
 
# Copia el resto del proyecto y realiza la compilación
COPY . .
RUN npm run build -- --configuration=production
 
# Etapa 2: Servir la aplicación con NGINX
FROM nginx:stable-alpine AS production-stage
 
# Copia los archivos compilados de Angular desde la etapa de construcción a la carpeta predeterminada de NGINX
COPY --from=build-stage /app/dist/front-end3 /usr/share/nginx/html
 
# Copia un archivo de configuración de NGINX personalizado (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf
 
# Exponer el puerto en el que se ejecutará NGINX
EXPOSE 80
 
# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
