FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY front/package*.json ./
RUN npm ci

COPY front/ ./
RUN npm run build

FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install pdo_mysql bcmath zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY back/composer.json back/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist --ignore-platform-req=php

COPY back/ .

RUN composer dump-autoload --optimize

COPY --from=frontend-builder /app/dist/ /var/www/html/public/

ENV APP_NAME="QuizBall" \
    APP_ENV="production" \
    APP_DEBUG="false" \
    APP_KEY="base64:7v+2jTSnRNtupINEG5k1s0wDa68hxNlS0ZYh9ARkpUg=" \
    APP_URL="http://localhost" \
    DB_CONNECTION="mysql" \
    LOG_CHANNEL="stack" \
    LOG_LEVEL="error" \
    TRUSTED_PROXIES="*"

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]
