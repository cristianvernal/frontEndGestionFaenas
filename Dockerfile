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
# Usa una imagen base de NGINX
FROM nginx:alpine
 
# Elimina la configuración predeterminada de NGINX
RUN rm -rf /usr/share/nginx/html/*
 
# Copia los archivos de la aplicación Angular desde la carpeta dist a la carpeta de NGINX
COPY ./dist/front-end3 /usr/share/nginx/html
 
# Expone el puerto 80 para el tráfico HTTP
EXPOSE 80
 
# Comando para ejecutar NGINX en primer plano
CMD ["nginx", "-g", "daemon off;"]
