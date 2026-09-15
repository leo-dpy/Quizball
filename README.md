# Culture Quiz 🧠🏆

Application web de quiz de culture générale conçue en **Mobile-First**, développée avec **React (TypeScript + Vite)** pour le frontend et **Laravel** pour l'API backend.

---

## 📁 Architecture du Projet

```text
CultureQuizz/
├── back/                   # Backend API (Laravel 8 / PHP)
│   ├── app/                # Contrôleurs, Modèles
│   ├── database/           # Migrations, seeders, base SQLite (suivie sur Git)
│   ├── routes/api.php      # Endpoints de l'API
│   └── culturequizz.sql    # Export SQL de la base de données
├── front/                  # Frontend (React 19 + TypeScript + Vite)
│   ├── src/                # Composants, vues, services API, styles
│   ├── public/             # Assets statiques
│   └── package.json        # Dépendances et scripts front
├── .env.example            # Modèle des variables d'environnement unique (racine)
├── .env                    # Variables d'environnement locales (racine)
├── CultureQuizz.pdf        # Sujet et consignes du projet
├── .gitignore              # Fichier d'exclusion Git unifié
└── README.md               # Documentation globale d'installation
```

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- **Node.js** (v18 ou supérieur) et **npm**
- **PHP** (>= 8.0) avec les extensions PDO (SQLite ou MySQL)
- **Composer** (gestionnaire de paquets PHP)
- *(Optionnel)* Un serveur de base de données **MySQL / MariaDB** (ex: Laragon, XAMPP, WampServer) si vous n'utilisez pas SQLite.

---

## 🚀 Installation & Démarrage

### 1. Cloner le projet & configurer l'environnement

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd CultureQuizz

# Créer votre fichier .env unique à la racine depuis le modèle :
# Sur Windows (PowerShell) :
copy .env.example .env

# Sur Linux / macOS :
cp .env.example .env
```

---

### 2. Configuration du Backend (`back/`)

Le backend expose les routes API nécessaires pour récupérer les catégories et les questions.

1. **Accédez au dossier backend :**
   ```bash
   cd back
   ```

2. **Installez les dépendances PHP :**
   ```bash
   composer install
   ```

3. **Générez la clé d'application Laravel :**
   ```bash
   php artisan key:generate
   ```

5. **Configuration de la Base de Données :**

   - **Option A : SQLite (Recommandé en local / prêt à l'emploi)**
     Vérifiez dans votre `.env` la configuration suivante :
     ```env
     DB_CONNECTION=sqlite
     ```
     *(La base `database/database.sqlite` est déjà présente. Si vous souhaitez réinitialiser les tables et données de test, exécutez `php artisan migrate --seed`)*.

   - **Option B : MySQL**
     Créez une base de données nommée `culturequizz` dans votre SGBD, puis importez le fichier [culturequizz.sql](file:///c:/Users/leodu/Documents/Cours/React%20JS/EXO/CultureQuizz/back/culturequizz.sql) ou configurez votre `.env` :
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=culturequizz
     DB_USERNAME=root
     DB_PASSWORD=
     ```
     Puis lancez :
     ```bash
     php artisan migrate --seed
     ```

6. **Démarrez le serveur Laravel :**
   ```bash
   php artisan serve
   ```
   > 🌐 L'API est désormais disponible sur : `http://127.0.0.1:8000`

---

### 3. Configuration du Frontend (`front/`)

Le frontend est développé en React avec Vite et TypeScript.

1. **Ouvrez un nouveau terminal et rendez-vous dans le dossier front :**
   ```bash
   cd front
   ```

2. **Installez les dépendances Node :**
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement :**
   ```bash
   npm run dev
   ```
   > 🚀 L'application s'ouvre sur : `http://localhost:5173`

---

## 📡 Endpoints de l'API

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Récupère toutes les catégories de quiz |
| `GET` | `/api/questions` | Récupère la liste des questions et propositions |
| `POST` | `/api/questions` | Ajoute une nouvelle question |
| `PUT` | `/api/questions/{id}` | Modifie une question existante |
| `DELETE` | `/api/questions/{id}` | Supprime une question |
| `GET` | `/api/users` | Récupère la liste des utilisateurs et scores |
| `POST` | `/api/users` | Enregistre un nouveau score / utilisateur |

---

## 🎯 Fonctionnalités du Projet (Cahier des charges)

- 📱 **Mobile-First** : Interface conçue prioritairement pour les smartphones.
- 🏠 **Page d'accueil** : Logo de l'application et bouton de démarrage.
- 📂 **Choix de la catégorie** : Chargement dynamique depuis l'API Laravel (`/api/categories`).
- ⏱️ **Timer 30s** : Décompte visuel pour chaque question, passage automatique si le temps est écoulé.
- 🎨 **Feedback visuel immédiat** :
  - Réponse correcte : coloriage en **vert**.
  - Mauvaise réponse : coloriage en **rouge**.
- 📊 **Résultats & Score** : Affichage du score total à l'issue des 10 questions.

---

## 🛠️ Scripts Utiles

### Frontend (`front/`)
- `npm run dev` : Démarre le serveur local Vite.
- `npm run build` : Compile l'application TypeScript et génère le bundle de production dans `dist/`.
- `npm run lint` : Vérifie la qualité du code avec Oxlint.

### Backend (`back/`)
- `php artisan serve` : Démarre le serveur local de développement.
- `php artisan route:list` : Liste toutes les routes de l'application.
- `php artisan migrate:fresh --seed` : Réinitialise la base de données avec les seeders.
