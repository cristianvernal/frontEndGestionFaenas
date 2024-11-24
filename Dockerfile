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

# Log para ver el contenido de los directorios antes de copiar
RUN echo "Contenido del directorio /app/dist:" && ls -R /app/dist

RUN echo "Contenido del directorio ./dist:" && ls -R ./dist


# Etapa 2: Servir la aplicación con NGINX
# Usa una imagen base de NGINX
FROM nginx:alpine

# Elimina la configuración predeterminada de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

#Copiar certificados (cloudflare)
#COPY ssl/sistemagfclpublic.pem /etc/ssl/certs/sistemagfclpublic.pem
#COPY ssl/sistemagfclprivate.pem /etc/ssl/private/sistemagfclprivate.pem

# Copia los archivos de la aplicación Angular desde la carpeta dist a la carpeta de NGINX
COPY ./dist/front-end3/browser /usr/share/nginx/html

# Expone el puerto 80 para el tráfico HTTP
EXPOSE 80
EXPOSE 443

# Comando para ejecutar NGINX en primer plano
CMD ["nginx", "-g", "daemon off;"]
