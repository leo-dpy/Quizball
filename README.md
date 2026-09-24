# QuizBall ⚽🏀🎾

Quiz sportif conçu en **Mobile-First** : football, basket, tennis et tous sports.
Frontend **React (TypeScript + Vite)**, API **Laravel**.

---

## 📁 Architecture du Projet

```text
Quizball/
├── back/                   # Backend API (Laravel 8 / PHP)
│   ├── app/                # Contrôleurs, Modèles
│   ├── database/           # Migrations, seeder, base SQLite (suivie sur Git)
│   ├── routes/api.php      # Endpoints de l'API
│   └── culturequizz.sql    # Ancien export SQL (historique)
├── front/                  # Frontend (React 19 + TypeScript + Vite)
│   ├── src/views/          # Landing, réglages, quiz, résultats
│   ├── src/services/api.ts # Appels à l'API Laravel
│   ├── src/data/sports.ts  # Sports affichés (slug, nom, couleur)
│   └── public/             # Assets statiques
├── .env.example            # Modèle des variables d'environnement (racine)
├── .env                    # Variables d'environnement locales (racine)
└── README.md
```

---

## ⚙️ Prérequis

- **Node.js** (v18 ou supérieur) et **npm**
- **PHP** (>= 8.0) avec les extensions PDO (SQLite)
- **Composer** — si tu ne l'as pas, voir l'astuce ci-dessous

---

## 🚀 Installation & Démarrage

### 1. Cloner le projet & configurer l'environnement

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd Quizball

# Sur Windows (PowerShell) :
copy .env.example .env

# Sur Linux / macOS :
cp .env.example .env
```

### 2. Backend (`back/`)

```bash
cd back

# Si composer n'est pas installé sur la machine :
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php --quiet && rm composer-setup.php
# puis utiliser "php composer.phar" au lieu de "composer"

composer install
php artisan key:generate
php artisan migrate:fresh --seed   # crée les tables, les 4 sports et les 144 questions
php artisan serve                  # http://127.0.0.1:8000
```

> ⚠️ **PHP 8.4** : le `composer.lock` fige des dépendances qui exigent PHP < 8.3.
> Sur PHP 8.4, installer avec `composer install --ignore-platform-req=php`.
> Les avertissements de dépréciation sont neutralisés en tête de `back/public/index.php`,
> sinon ils s'affichent en HTML devant le JSON et cassent les réponses de l'API.

### 3. Frontend (`front/`)

```bash
cd front
npm install
npm run dev                        # http://localhost:5173
```

Le serveur Vite redirige `/api` vers `http://127.0.0.1:8000`, donc les deux serveurs
doivent tourner en même temps pour jouer.

---

## 🐳 Déploiement sur Coolify (VPS + MySQL)

Le projet est entièrement conteneurisé et prêt pour un déploiement en 1 clic sur **Coolify** via Docker Compose.

### Architecture déployée :
- **Base MySQL** : Hébergée séparément sur ton VPS / Coolify. Le fichier export complet [`quizball_mysql.sql`](quizball_mysql.sql) est fourni à la racine (tables, index, sports et les 144 questions).
- **`backend`** : API Laravel sous PHP 8.2 & Apache. Au démarrage, il teste la connexion à MySQL, vérifie les migrations (`php artisan migrate --force`) et active le cache de production.
- **`frontend`** : React 19 compilé et servi par un Nginx ultra-léger. Nginx route automatiquement les requêtes `/api/*` en interne vers le conteneur `backend` : **un seul domaine et un seul certificat SSL suffisent**, sans configuration complexe de CORS !

### Étapes de déploiement dans Coolify :

1. **Remplir ta base de données MySQL** :
   - Importe le fichier [`quizball_mysql.sql`](quizball_mysql.sql) dans ta base existante (via phpMyAdmin, Adminer, ou en ligne de commande : `mysql -u user -p base < quizball_mysql.sql`).

2. **Créer la ressource dans Coolify** :
   - Dans ton projet Coolify, clique sur **+ New Resource** > **Public / Private Repository**.
   - Renseigne l'URL de ton repo Git Quizball.
   - Choisis le type de build : **Docker Compose**.

3. **Variables d'environnement** :
   Dans l'onglet **Environment Variables** de Coolify, copie les variables de [`.env.production.example`](.env.production.example) et renseigne les identifiants de ta base de données :
   ```env
   APP_NAME=QuizBall
   APP_ENV=production
   APP_KEY=base64:7v+2jTSnRNtupINEG5k1s0wDa68hxNlS0ZYh9ARkpUg=
   APP_DEBUG=false
   APP_URL=https://ton-domaine.com

   DB_CONNECTION=mysql
   DB_HOST=ip_ou_hote_de_ta_base
   DB_PORT=3306
   DB_DATABASE=nom_de_ta_base
   DB_USERNAME=ton_utilisateur
   DB_PASSWORD=ton_mot_de_passe
   ```

4. **Domaine & SSL** :
   - Assigne ton domaine (ex: `https://quizball.ton-domaine.com`) au service **`frontend`**.
   - Coolify génère automatiquement le certificat HTTPS Let's Encrypt.

5. **Déployer** :
   - Clique sur **Deploy**. Coolify compile le front et le back, valide la connexion à ta base et met le site en ligne !

---

## 📡 Endpoints de l'API

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Les sports jouables et leur nombre de questions |
| `GET` | `/api/quiz?sport=foot&difficulte=moyen&limite=10` | Tire les questions d'une partie, propositions déjà mélangées |
| `GET` | `/api/quiz?sport=foot&graine=2026-09-22` | Même tirage pour tout le monde (défi du jour) |
| `GET` | `/api/scores?sport=foot&mode=solo&limite=5` | Le classement des meilleurs scores, par sport et par mode |
| `POST` | `/api/scores` | Enregistre le score d'une partie terminée |
| `GET` | `/api/questions` | Toutes les questions (administration) |
| `POST` | `/api/questions` | Ajoute une question |
| `PUT` | `/api/questions/{id}` | Modifie une question |
| `DELETE` | `/api/questions/{id}` | Supprime une question |

**Paramètres** : `sport` vaut `foot`, `basket`, `tennis` ou `multi` ;
`difficulte` vaut `facile`, `moyen`, `difficile` ou `toutes` ;
`mode` vaut `solo`, `chrono`, `survie` ou `defi`.

---

## 🎮 Modes de jeu

| Mode | Règle |
| :--- | :--- |
| **Solo** | 10 questions, difficulté au choix, 15 s par question |
| **Contre-la-montre** | 60 s pour toute la partie, les questions s'enchaînent sans pause |
| **Survie** | Une erreur et c'est fini ; la difficulté monte à chaque palier |
| **Défi du jour** | Une seule question, la même pour tous selon la date, un seul essai par jour |

Le défi du jour s'appuie sur un tirage reproductible côté API (paramètre `graine`)
et se verrouille dans le navigateur via `localStorage` jusqu'au lendemain. Chaque jour
relevé fait monter la **série**, affichée sur l'écran de fin et dans la section
Progression de la landing.

Les boutons d'abonnement mènent à une **page de paiement fictive** (maquette de
démonstration) : rien n'est envoyé, rien n'est débité.

---

## 🗄️ Schéma de la base

| Table | Colonnes |
| :--- | :--- |
| `categories` | `slug`, `nom`, `couleur` |
| `questions` | `categorie_id`, `question`, `bonne_reponse`, `mauvaise_1`, `mauvaise_2`, `mauvaise_3`, `difficulte` |
| `parties` | `pseudo`, `categorie_id`, `difficulte`, `score`, `total` |

---

## 🧠 Les questions du quiz
 
Les questions sont gérées dans le seeder Laravel [QuestionSeeder.php](back/database/seeders/QuestionSeeder.php).
 
- **144 questions au total**, réparties entre les 4 sports (Football, Basket, Tennis, Tous sports).
- **3 paliers de difficulté réels** :
+  - **Facile** : culture sportive générale accessible à tous.
+  - **Moyen** : pour les amateurs de sport (palmarès, records, finales).
+  - **Difficile** : pour les passionnés (années, anecdotes, détails techniques).
- **4 propositions par question** : la bonne réponse et 3 leurres crédibles, mélangés à chaque tirage.
 
Pour réinitialiser ou actualiser la base de données :
```bash
php artisan migrate:fresh --seed
```

---

## 🎯 Fonctionnalités

- 📱 **Mobile-First** : interface pensée d'abord pour le smartphone.
- 🏠 **Landing** : choix du sport, qui lance directement le quiz correspondant.
- 🎚️ **Réglages** : pseudo et difficulté (facile, moyen, difficile ou toutes).
- ⏱️ **Timer 15s** : décompte visuel par question, passage automatique si le temps est écoulé.
- 🎨 **Feedback immédiat** : bonne réponse en vert, mauvaise en rouge.
- 📊 **Résultats** : score, récap des questions ratées avec la bonne réponse.
- 🏆 **Classement** : score envoyé à l'API et top 5 par sport.

---

## 🛠️ Scripts Utiles

### Frontend (`front/`)
- `npm run dev` : démarre le serveur local Vite.
- `npm run build` : compile le TypeScript et génère le bundle de production.
- `npm run lint` : vérifie la qualité du code avec Oxlint.

### Backend (`back/`)
- `php artisan serve` : démarre le serveur local.
- `php artisan route:list` : liste toutes les routes.
- `php artisan migrate:fresh --seed` : réinitialise la base et recharge les questions.
