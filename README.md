# QuizBall ⚽🏀🎾 (Culture Quiz)

Application web de quiz sportif conçue en **Mobile-First**, développée en **React (TypeScript + Vite)** pour le frontend et **Laravel 8 (PHP)** pour l'API REST, avec une base de données **MySQL 8.0**.

Ce projet répond à l'ensemble des exigences et critères d'évaluation du sujet **Culture Quiz** (voir [`CultureQuizz.pdf`](CultureQuizz.pdf)).

---

## 📋 Conformité avec le Barème du Sujet (20/20)

| Critère du barème | Statut | Détails de l'implémentation |
| :--- | :---: | :--- |
| **Mobile-First (2 pts)** | ✅ | Pensé et optimisé en priorité pour les smartphones, responsive tablettes et desktop. |
| **Page d'accueil : Logo & Titre (1 pt)** | ✅ | Logo officiel QuizBall généré et titre affiché dès l'écran d'accueil. |
| **Catégories issues de l'API (2 pts)** | ✅ | Récupération dynamique depuis l'endpoint `/api/categories` (Football, Basket, Tennis, Tous sports). |
| **Questions & 4 propositions issues de l'API (3 pts)** | ✅ | Récupérées via `/api/quiz`, 4 propositions mélangées à chaque tirage dont la bonne réponse. |
| **Timer 30s & passage automatique (2 pts)** | ✅ | Décompte visuel de 30 secondes par question. Passage automatique si le temps est écoulé. |
| **Coloration vert / rouge avant changement (1 pt)** | ✅ | La bonne réponse passe en **vert**, la mauvaise en **rouge**, avec un délai de feedback avant la suite. |
| **Score calculé et affiché à la fin des 10 questions (2 pts)** | ✅ | Écran récapitulatif avec score final, bilan des erreurs et enregistrement en base. |
| **Code maintenable & TypeScript (2 pts)** | ✅ | 100% React + TypeScript strict (aucun JS brut), composants découpés et réutilisables. |
| **Design cohérent & charte graphique (1 pt)** | ✅ | Thème sportif premium (dark mode, typographies Bebas Neue & Inter, animations fluides). |
| **Présentation orale préparée (4 pts)** | ✅ | Fiche mémo détaillée ci-dessous pour les 20 minutes de soutenance. |

---

## 📁 Architecture du Projet

```text
Quizball/
├── back/                   # Backend API (Laravel 8 / PHP)
│   ├── app/                # Contrôleurs, Modèles Eloquent
│   ├── database/           # Migrations et Seeders des 144 questions
│   ├── routes/api.php      # Endpoints REST de l'API
│   └── public/             # Point d'entrée Apache et configuration .htaccess
├── front/                  # Frontend (React 19 + TypeScript + Vite)
│   ├── src/views/          # Landing, réglages, quiz, résultats
│   ├── src/components/     # Composants réutilisables (Timer, etc.)
│   ├── src/services/api.ts # Appels typés à l'API Laravel
│   ├── src/data/sports.ts  # Définition des sports et accents visuels
│   └── public/             # Assets statiques et logo
├── quizball_mysql.sql      # Export complet MySQL (tables, schéma et 144 questions)
├── Dockerfile              # Conteneur unique de production (React build + Laravel Apache)
├── CultureQuizz.pdf        # Sujet et barème officiel du projet
└── README.md
```

---

## 👥 Répartition des Missions de Développement

> *Conformément aux consignes du sujet, voici la répartition des rôles sur le projet :*

- **Frontend & UI/UX (React + TypeScript)** :
  - Conception de l'interface Mobile-First et de la charte graphique sportive.
  - Développement des composants React (LandingView, SetupView, QuizView, ResultView, Timer).
  - Gestion des états, animations de transition et coloration des réponses (vert/rouge).
  - Intégration du timer de 30 secondes avec passage automatique en cas de temps écoulé.
- **Backend & API REST (Laravel 8 + PHP)** :
  - Création des modèles et migrations de données (`categories`, `questions`, `parties`).
  - Développement des endpoints de l'API (`/api/categories`, `/api/quiz`, `/api/scores`).
  - Écriture du seeder des 144 questions sportives équilibrées par niveau (facile, moyen, difficile).
  - Logique de tirage aléatoire et reproductible (graine pour le défi du jour).
- **DevOps, Base de données & Déploiement (MySQL + Coolify)** :
  - Mise en place et configuration de la base de données MySQL 8.0 et export SQL (`quizball_mysql.sql`).
  - Dockerisation complète en un conteneur unique (build multi-stage Node 20 + Apache PHP 8.2).
  - Configuration du serveur web Apache et routage `.htaccess` pour unifier le front React et l'API Laravel sous le même domaine (zéro problème de CORS).
  - Déploiement et sécurisation SSL sur VPS via Coolify.

---

## 📡 Endpoints de l'API REST

Toutes les routes de l'API sont préfixées par `/api` :

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retourne les 4 sports jouables et leur nombre de questions |
| `GET` | `/api/quiz?sport=foot&difficulte=moyen&limite=10` | Tire 10 questions avec leurs 4 propositions mélangées |
| `GET` | `/api/quiz?sport=foot&graine=2026-09-24` | Tirage identique pour tous les joueurs (défi quotidien) |
| `GET` | `/api/scores?sport=foot&mode=solo&limite=5` | Récupère le classement des meilleurs scores (Top 5) |
| `POST` | `/api/scores` | Enregistre le score d'une partie terminée |

---

## 🎮 Modes de Jeu

| Mode | Règles |
| :--- | :--- |
| **Solo (Sujet Officiel)** | **10 questions, timer de 30 s par question, niveau au choix** |
| **Contre-la-montre** | 60 s chrono pour enchaîner un maximum de questions sans pause |
| **Survie** | Mort subite : la première erreur arrête la partie, la difficulté augmente à chaque palier |
| **Défi du Jour** | Une seule question par jour, identique pour tout le monde, pour faire grimper sa série |

---

## 🗄️ Base de Données (MySQL 8.0)


### Schéma des tables :
- **`categories`** : `id`, `slug`, `nom`, `couleur`, `timestamps`
- **`questions`** : `id`, `categorie_id` (clé étrangère liée à `categories`), `question`, `bonne_reponse`, `mauvaise_1`, `mauvaise_2`, `mauvaise_3`, `difficulte` (`facile`, `moyen`, `difficile`), `timestamps`
- **`parties`** : `id`, `pseudo`, `categorie_id`, `difficulte`, `mode`, `score`, `total`, `timestamps`
- **`migrations`** : historique des migrations Laravel

---

## 🐳 Déploiement sur Coolify (Production)

L'application a été condensée dans **un seul `Dockerfile` tout-en-un** ultra-performant :
1. **Node 20** compile le frontend React Vite.
2. **PHP 8.2 & Apache** embarque Laravel et sert le frontend compilé dans `public/`.
3. Le fichier `.htaccess` redirige automatiquement les appels `/api/*` vers Laravel et le reste vers l'application React.



## 🎤 Préparation à la Soutenance Orale (20 mn)

Ce guide récapitule les 6 points demandés dans le sujet pour la présentation :

### 1. Explication du choix graphique
- **Mobile-First** : boutons larges, navigation au pouce, absence de menus complexes superflus.
- **Identité Sportive** : typographie d'impact `Bebas Neue` pour les scores et titres, police lisible `Inter` pour les questions.
- **Thème sombre dynamique** : background anthracite `#0F1115` avec accents de couleurs par sport (Vert Football `#01C187`, Orange Basket `#FE8D07`, Jaune Tennis `#FFC93C`, Bleu Multisport `#3FA9FF`).
- **Feedback instantané** : boutons vert (`#10B981`) pour les bonnes réponses et rouge (`#EF4444`) pour les erreurs.

### 2. Endpoints de l'API & Choix du Langage
- **Pourquoi Laravel (PHP) ?** :
  - Framework mature avec routage RESTful clair dans `routes/api.php`.
  - ORM **Eloquent** permettant des requêtes expressives, des relations simples (`Partie belongsTo Categorie`) et un tirage aléatoire sécurisé (`inRandomOrder()`).
  - Validation stricte des données entrantes (`Request::validate`) pour empêcher les injections et scores invalides.

### 3. Le Stockage utilisé et ses particularités
- **MySQL 8.0** :
  - Base relationnelle robuste avec intégrité référentielle (`ON DELETE CASCADE` pour les questions, `ON DELETE SET NULL` pour les scores).
  - Encodage `utf8mb4` complet pour gérer tous les accents et caractères spéciaux de la langue française.
  - Export direct fourni [`quizball_mysql.sql`](quizball_mysql.sql) pour reproduire la base instantanément.

### 4. Architecture de l'Application
- **Frontend** :
  - Découpage par vues : `LandingView`, `SetupView`, `QuizView`, `ResultView`.
  - Composants isolés : `Timer.tsx` pour l'affichage visuel et le compte à rebours.
  - Module centralisé `api.ts` pour encapsuler tous les `fetch` typés avec TypeScript.
- **Routage unifié en production** :
  - Apache sert `index.html` pour la navigation React SPA et route `/api/*` vers Laravel `index.php`.

### 5. Partie de code au choix à présenter
- **La machine à états du Quiz dans `front/src/views/QuizView.tsx`** :
  - Utilisation de `useEffect` et `setInterval` pour décompter les 30 secondes avec précision.
  - Gestion de l'état `figee` : dès qu'une réponse est cliquée ou que le timer expire, l'interface se bloque, applique les classes CSS `.is-bonne` et `.is-mauvaise`, puis patiente 1,6 s avant d'enchaîner.

### 6. Difficultés rencontrées et solutions
- **Respect du Mobile-First** : adaptation des hauteurs d'écran et du tactile sur smartphone pour éviter les défilements parasites pendant le quiz.
- **Déploiement sous Coolify** : fusion du frontend React et du backend Laravel dans un seul conteneur Docker Apache pour réduire par deux la mémoire RAM consommée et éliminer tout problème de CORS ou de réseau multi-conteneurs.
