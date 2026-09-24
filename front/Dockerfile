# Étape 1 : Build de l'application React avec Vite
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Argument pour surcharger l'URL de base de l'API si besoin au build
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Étape 2 : Image Nginx ultra-légère pour servir le front et proxifier l'API
FROM nginx:alpine

# Copie des fichiers compilés dans le document root de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie du template Nginx (substitué par envsubst au démarrage du conteneur)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Variables d'environnement par défaut pour le template Nginx
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=80

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
