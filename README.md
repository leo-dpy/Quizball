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
php artisan migrate:fresh --seed   # crée les tables et les 4 sports
php artisan quiz:generer           # remplit la base depuis Wikidata (~10 min)
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

## 🧠 D'où viennent les questions

Les questions sont **générées depuis [Wikidata](https://www.wikidata.org)**, en français,
par la commande `php artisan quiz:generer`.

```bash
php artisan quiz:generer                        # tous les sports, 1000 questions visées chacun
php artisan quiz:generer --sport=foot --cible=500
php artisan quiz:generer --garder               # ajoute sans effacer l'existant
```

**Comment ça marche :** chaque « collecte » est une requête SPARQL + un gabarit de question
(« De quelle nationalité est X ? », « Dans quel stade joue le club Y ? »…). Les mauvaises
réponses sont tirées des autres valeurs de la même collecte, donc toujours du même type.
La difficulté vient de la notoriété du sujet sur Wikidata : beaucoup de pages liées = facile.

**Pourquoi pas une API de quiz toute faite ?** Aucune ne convient : l'API française
(quizzapi) est hors service, OpenTDB n'a que 176 questions de sport en anglais, et
The Trivia API demande une clé payante pour le français — avec seulement ~40 questions
de football, ~14 de basket et ~15 de tennis en filtrant par sport.

> ⚠️ **SSL sous Windows** : PHP n'embarque pas de liste d'autorités de certification, donc
> l'appel à Wikidata échoue avec `cURL error 60`. La commande utilise automatiquement le
> paquet livré avec Git. Pour en imposer un autre, ajouter dans le `.env` :
> `WIKIDATA_CA_BUNDLE=C:\chemin\vers\cacert.pem`

La base `database.sqlite` étant versionnée, il n'est pas nécessaire de relancer la
génération pour jouer : les questions arrivent avec le dépôt.

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
