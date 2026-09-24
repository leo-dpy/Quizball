#!/bin/bash
set -e

echo "==> QuizBall Backend - Démarrage..."

# Fixer les permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Si la connexion est configurée pour MySQL, attendre que la base soit joignable
if [ "${DB_CONNECTION}" = "mysql" ]; then
    echo "==> Vérification de la connexion à la base de données MySQL (${DB_HOST}:${DB_PORT:-3306})..."
    max_retries=30
    count=0
    until php -r "
    try {
        \$host = getenv('DB_HOST') ?: '127.0.0.1';
        \$port = getenv('DB_PORT') ?: '3306';
        \$db   = getenv('DB_DATABASE') ?: 'quizball';
        \$user = getenv('DB_USERNAME') ?: 'quizball';
        \$pass = getenv('DB_PASSWORD') ?: '';
        new PDO(\"mysql:host=\$host;port=\$port;dbname=\$db\", \$user, \$pass, [
            PDO::ATTR_TIMEOUT => 3,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        exit(0);
    } catch (\Throwable \$e) {
        fwrite(STDERR, '    [Connexion MySQL en attente] ' . \$e->getMessage() . PHP_EOL);
        exit(1);
    }
    "; do
        count=$((count+1))
        if [ $count -ge $max_retries ]; then
            echo "==> Erreur : Impossible de joindre MySQL après $max_retries essais. Vérifie tes variables DB_* dans Coolify."
            exit 1
        fi
        echo "    Nouvel essai dans 2s ($count/$max_retries)..."
        sleep 2
    done
    echo "==> Connexion MySQL établie avec succès !"

    echo "==> Vérification des migrations..."
    php artisan migrate --force

    SEED_NEEDED=$(php -r "
    require 'vendor/autoload.php';
    \$app = require_once 'bootstrap/app.php';
    \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    try {
        echo \App\Models\Categorie::count() === 0 ? 'yes' : 'no';
    } catch (\Throwable \$e) {
        echo 'no';
    }
    ")

    if [ "$SEED_NEEDED" = "yes" ]; then
        echo "==> Base vide détectée : injection des catégories et des 144 questions..."
        php artisan db:seed --force
    else
        echo "==> Données déjà présentes en base, seeder ignoré."
    fi
fi

# Optimisation en production
if [ "${APP_ENV}" = "production" ]; then
    echo "==> Mise en cache de la configuration et des routes..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

echo "==> Démarrage du serveur web Apache..."
exec "$@"
