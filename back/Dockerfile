FROM php:8.2-apache

# Installation des dépendances système et extensions PHP nécessaires pour Laravel & MySQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install pdo_mysql bcmath zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Activation du module rewrite d'Apache
RUN a2enmod rewrite

# Configuration du DocumentRoot vers public/
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Récupération de Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Optimisation du cache de build Docker pour les dépendances Composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist --ignore-platform-req=php

# Copie du code source
COPY . .

# Génération de l'autoloader optimisé
RUN composer dump-autoload --optimize

# Permissions pour le serveur web
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
