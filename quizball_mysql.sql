-- ========================================================
-- QuizBall - Export MySQL Complet (Structure & Données)
-- Date: 2026-09-24 12:39:59
-- Compatible: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table: migrations
-- --------------------------------------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2023_02_09_101224_create_categories_table', 1),
(6, '2023_02_09_101541_create_questions_table', 1),
(7, '2023_02_09_101741_create_parties_table', 1);

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: password_resets
-- --------------------------------------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: failed_jobs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: personal_access_tokens
-- --------------------------------------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `slug`, `nom`, `couleur`, `created_at`, `updated_at`) VALUES
(1, 'foot', 'Football', '#01C187', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(2, 'basket', 'Basket', '#FE8D07', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(3, 'tennis', 'Tennis', '#FFC93C', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(4, 'multi', 'Tous sports', '#3FA9FF', '2026-09-22 15:25:29', '2026-09-22 15:25:29');

-- --------------------------------------------------------
-- Table: questions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `categorie_id` bigint(20) unsigned NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bonne_reponse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mauvaise_1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mauvaise_2` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mauvaise_3` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `difficulte` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'moyen',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_categorie_id_foreign` (`categorie_id`),
  CONSTRAINT `questions_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questions` (`id`, `categorie_id`, `question`, `bonne_reponse`, `mauvaise_1`, `mauvaise_2`, `mauvaise_3`, `difficulte`, `created_at`, `updated_at`) VALUES
(1, 1, 'Quel pays a remporté la Coupe du Monde de football en 2018 ?', 'France', 'Croatie', 'Brésil', 'Allemagne', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(2, 1, 'Quel joueur français a remporté le Ballon d\'Or en 1998 ?', 'Zinédine Zidane', 'Thierry Henry', 'Didier Deschamps', 'David Trezeguet', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(3, 1, 'Combien de joueurs d\'une même équipe sont présents sur le terrain au coup d\'envoi ?', '11', '10', '12', '9', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(4, 1, 'Quel club espagnol a remporté le plus grand nombre de Ligues des Champions ?', 'Real Madrid', 'FC Barcelone', 'Atlético Madrid', 'Séville FC', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(5, 1, 'Dans quel club anglais Erling Haaland a-t-il battu le record de buts en une saison ?', 'Manchester City', 'Manchester United', 'Liverpool', 'Chelsea', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(6, 1, 'Quel joueur argentin a guidé son pays au titre mondial en 2022 au Qatar ?', 'Lionel Messi', 'Angel Di Maria', 'Sergio Agüero', 'Paulo Dybala', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(7, 1, 'De quelle couleur est le carton qui expulse directement un joueur du terrain ?', 'Rouge', 'Jaune', 'Blanc', 'Noir', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(8, 1, 'Dans quel club Kylian Mbappé a-t-il signé à l\'été 2024 ?', 'Real Madrid', 'Bayern Munich', 'Arsenal', 'Juventus', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(9, 1, 'Quelle sélection nationale est surnommée la « Seleção » ?', 'Le Brésil', 'L\'Argentine', 'L\'Espagne', 'L\'Italie', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(10, 1, 'Combien de temps dure un match de football réglementaire hors temps additionnel ?', '90 minutes', '80 minutes', '100 minutes', '70 minutes', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(11, 1, 'Quel club français est le seul à avoir remporté la Ligue des Champions (en 1993) ?', 'Olympique de Marseille', 'Paris Saint-Germain', 'AS Monaco', 'Olympique Lyonnais', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(12, 1, 'Quel joueur est le seul autorisé à utiliser ses mains dans sa surface de réparation ?', 'Le gardien de but', 'Le capitaine', 'Le défenseur central', 'L\'avant-centre', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(13, 1, 'Quel attaquant portugais a remporté 5 Ballons d\'Or au cours de sa carrière ?', 'Cristiano Ronaldo', 'Luís Figo', 'Eusébio', 'Deco', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(14, 1, 'En quelle année l\'équipe de France a-t-elle remporté sa première Coupe du Monde ?', '1998', '1984', '2006', '1994', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(15, 1, 'Quel entraîneur français a mené le Real Madrid à 3 sacres consécutifs en Ligue des Champions (2016-2018) ?', 'Zinédine Zidane', 'Didier Deschamps', 'Arsène Wenger', 'Laurent Blanc', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(16, 1, 'Quel pays a remporté l\'Euro 2024 de football disputé en Allemagne ?', 'Espagne', 'Angleterre', 'France', 'Pays-Bas', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(17, 1, 'Quel joueur détient le record du transfert le plus onéreux de l\'histoire (222 M€) ?', 'Neymar', 'Kylian Mbappé', 'Philippe Coutinho', 'Paul Pogba', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(18, 1, 'Quel club italien est surnommé la « Vieille Dame » ou les « Bianconeri » ?', 'Juventus', 'AC Milan', 'Inter Milan', 'AS Rome', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(19, 1, 'Qui est le meilleur buteur de l\'histoire de l\'équipe de France masculine ?', 'Olivier Giroud', 'Thierry Henry', 'Antoine Griezmann', 'Michel Platini', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(20, 1, 'Quel gardien italien a été champion du monde en 2006 et a disputé plus de 1 000 matches ?', 'Gianluigi Buffon', 'Dino Zoff', 'Francesco Toldo', 'Walter Zenga', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(21, 1, 'Quel stade emblématique est le domicile du club de Liverpool FC ?', 'Anfield', 'Old Trafford', 'Etihad Stadium', 'Stamford Bridge', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(22, 1, 'Quel prix récompense chaque année le plus beau but inscrit au monde ?', 'Prix Puskás', 'Trophée Kopa', 'Trophée Yachine', 'Soulier d\'Or', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(23, 1, 'Quel attaquant polonais a empilé les buts au Bayern Munich puis au FC Barcelone ?', 'Robert Lewandowski', 'Miroslav Klose', 'Mario Mandžukić', 'Luka Jović', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(24, 1, 'Dans quelle ville se trouve le stade mythique de San Siro (Giuseppe Meazza) ?', 'Milan', 'Rome', 'Turin', 'Naples', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(25, 1, 'Quel pays a remporté la toute première Coupe du Monde de football en 1930 ?', 'Uruguay', 'Argentine', 'Brésil', 'Italie', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(26, 1, 'Quel club a créé l\'exploit en devenant champion d\'Angleterre en 2016 avec Claudio Ranieri ?', 'Leicester City', 'Blackburn Rovers', 'Wolverhampton', 'Southampton', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(27, 1, 'Quel joueur africain a été le premier à remporter le Ballon d\'Or en 1995 ?', 'George Weah', 'Samuel Eto\'o', 'Didier Drogba', 'Roger Milla', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(28, 1, 'Quel gardien soviétique est le seul portier de l\'histoire à avoir gagné le Ballon d\'Or (1963) ?', 'Lev Yachine', 'Dino Zoff', 'Gordon Banks', 'Sepp Maier', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(29, 1, 'Quel joueur détient le record absolu de buts sur une seule édition de Coupe du Monde (13 buts en 1958) ?', 'Just Fontaine', 'Pelé', 'Gerd Müller', 'Eusébio', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(30, 1, 'Quel joueur allemand a inscrit le but de la victoire en prolongation de la finale du Mondial 2014 ?', 'Mario Götze', 'André Schürrle', 'Mesut Özil', 'Toni Kroos', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(31, 1, 'En quelle année le Paris Saint-Germain a-t-il remporté la Coupe d\'Europe des Vainqueurs de Coupe (C2) ?', '1996', '1993', '1998', '2001', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(32, 1, 'Quel club a remporté la toute première Coupe d\'Europe des Clubs Champions en 1956 face à Reims ?', 'Real Madrid', 'Benfica', 'AC Milan', 'Inter Milan', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(33, 1, 'Quel joueur a réussi un triplé en finale de la Coupe du Monde 1966 avec l\'Angleterre ?', 'Geoff Hurst', 'Bobby Charlton', 'Bobby Moore', 'Jimmy Greaves', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(34, 1, 'Quel joueur détient le record du plus grand nombre d\'apparitions en phase finale de Coupe du Monde (26 matches) ?', 'Lionel Messi', 'Lothar Matthäus', 'Miroslav Klose', 'Paolo Maldini', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(35, 1, 'Quel entraîneur a mené la Grèce à la victoire surprise lors de l\'Euro 2004 ?', 'Otto Rehhagel', 'Guus Hiddink', 'Dick Advocaat', 'Luiz Felipe Scolari', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(36, 1, 'Qui était le capitaine de l\'équipe de France lors de la victoire à l\'Euro 1984 ?', 'Michel Platini', 'Alain Giresse', 'Jean Tigana', 'Maxime Bossis', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(37, 2, 'Avec quelle franchise Michael Jordan a-t-il conquis ses 6 titres de champion NBA ?', 'Chicago Bulls', 'Los Angeles Lakers', 'Boston Celtics', 'Miami Heat', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(38, 2, 'Combien de points vaut un tir réussi au-delà de la ligne des 6,75 m (ou 7,24 m en NBA) ?', '3 points', '2 points', '1 point', '4 points', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(39, 2, 'Quel joueur surnommé « King James » est devenu le meilleur marqueur de l\'histoire de la NBA ?', 'LeBron James', 'Kobe Bryant', 'Kevin Durant', 'Shaquille O\'Neal', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(40, 2, 'Combien de joueurs par équipe sont simultanément sur le parquet lors d\'un match de basket ?', '5', '6', '4', '7', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(41, 2, 'Quel géant français (2m22) a été choisi en 1ère position de la draft NBA 2023 par San Antonio ?', 'Victor Wembanyama', 'Bilal Coulibaly', 'Alexandre Sarr', 'Zaccharie Risacher', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(42, 2, 'À quelle hauteur réglementaire se situe l\'arceau d\'un panier de basket ?', '3,05 mètres', '2,80 mètres', '3,25 mètres', '3,50 mètres', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(43, 2, 'Quel geste spectaculaire consiste à claquer directement le ballon dans l\'arceau ?', 'Le dunk', 'Le layup', 'Le fadeaway', 'Le cross-over', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(44, 2, 'Quel meneur des Warriors est considéré comme le plus grand shooteur à 3 points de l\'histoire ?', 'Stephen Curry', 'Klay Thompson', 'Ray Allen', 'Reggie Miller', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(45, 2, 'Combien de points rapporte un lancer franc réussi ?', '1 point', '2 points', '3 points', '0,5 point', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(46, 2, 'Quelle franchise NBA joue dans la mythique salle du Madison Square Garden à New York ?', 'New York Knicks', 'Brooklyn Nets', 'Boston Celtics', 'Philadelphia 76ers', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(47, 2, 'Quelle infraction commet un joueur qui se déplace sans faire rebondir le ballon ?', 'Le marcher', 'La reprise de dribble', 'Le passage en force', 'Le pied', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(48, 2, 'Quelle est la durée réglementaire d\'un quart-temps en NBA ?', '12 minutes', '10 minutes', '15 minutes', '8 minutes', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(49, 2, 'Quel meneur français a remporté 4 bagues NBA avec les Spurs et a été MVP des Finales en 2007 ?', 'Tony Parker', 'Boris Diaw', 'Nicolas Batum', 'Evan Fournier', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(50, 2, 'De combien de secondes dispose une équipe en NBA pour tenter un tir au panier ?', '24 secondes', '30 secondes', '20 secondes', '14 secondes', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(51, 2, 'Quel pivot ultra-dominant a formé un tandem légendaire avec Kobe Bryant aux Lakers (2000-2002) ?', 'Shaquille O\'Neal', 'Patrick Ewing', 'Hakeem Olajuwon', 'David Robinson', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(52, 2, 'Quel joueur grec surnommé « The Greek Freak » a été champion NBA avec les Bucks en 2021 ?', 'Giannis Antetokounmpo', 'Luka Dončić', 'Nikola Jokić', 'Kristaps Porziņģis', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(53, 2, 'Quel pivot tricolore a été élu 4 fois Meilleur Défenseur de l\'année en NBA (DPOY) ?', 'Rudy Gobert', 'Joakim Noah', 'Victor Wembanyama', 'Clint Capela', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(54, 2, 'Quel surnom a été donné à l\'équipe américaine des Jeux Olympiques de Barcelone en 1992 ?', 'Dream Team', 'Redeem Team', 'Avengers', 'All-Stars', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(55, 2, 'Quel pivot serbe des Denver Nuggets a été élu triple MVP de la saison régulière en NBA ?', 'Nikola Jokić', 'Nikola Vučević', 'Jusuf Nurkić', 'Boban Marjanović', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(56, 2, 'Combien de fautes personnelles provoquent l\'expulsion d\'un joueur lors d\'une rencontre NBA ?', '6 fautes', '5 fautes', '4 fautes', '7 fautes', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(57, 2, 'Quel numéro mythique Kobe Bryant a-t-il endossé aux Lakers en plus du numéro 8 ?', '24', '23', '33', '10', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(58, 2, 'Quel coach mythique a décroché 11 bagues NBA avec les Bulls de Jordan et les Lakers de Kobe ?', 'Phil Jackson', 'Gregg Popovich', 'Pat Riley', 'Steve Kerr', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(59, 2, 'Quel meneur superstar slovène fait le bonheur des Dallas Mavericks ?', 'Luka Dončić', 'Goran Dragić', 'Bogdan Bogdanović', 'Deni Avdija', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(60, 2, 'Quelle franchise partage avec les Lakers le record du plus grand nombre de titres de champion NBA ?', 'Boston Celtics', 'Golden State Warriors', 'Chicago Bulls', 'San Antonio Spurs', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(61, 2, 'Quel joueur détient le record absolu du plus grand nombre de points en un match NBA (100 pts en 1962) ?', 'Wilt Chamberlain', 'Bill Russell', 'Kareem Abdul-Jabbar', 'Elgin Baylor', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(62, 2, 'Quelle légende des Boston Celtics a remporté 11 bagues de champion NBA comme joueur dans les années 50-60 ?', 'Bill Russell', 'Larry Bird', 'John Havlicek', 'Bob Cousy', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(63, 2, 'Quel professeur canadien a inventé le sport du basketball en 1891 ?', 'James Naismith', 'William Morgan', 'Walter Camp', 'Abner Doubleday', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(64, 2, 'Quel meneur légendaire du Utah Jazz détient le record de passes décisives en carrière NBA ?', 'John Stockton', 'Jason Kidd', 'Magic Johnson', 'Chris Paul', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(65, 2, 'Quelle franchise canadienne est devenue la première équipe non-américaine sacrée championne NBA (en 2019) ?', 'Toronto Raptors', 'Vancouver Grizzlies', 'Montreal Royals', 'Calgary Flames', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(66, 2, 'En quelle année l\'équipe de France masculine a-t-elle remporté son unique titre européen (EuroBasket) ?', '2013', '2011', '2005', '2015', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(67, 2, 'Quel joueur a été la silhouette qui a inspiré le logo officiel de la NBA ?', 'Jerry West', 'Michael Jordan', 'Oscar Robertson', 'Julius Erving', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(68, 2, 'Quel joueur a été élu MVP des Finales NBA 2014 sous le maillot des San Antonio Spurs ?', 'Kawhi Leonard', 'Tim Duncan', 'Tony Parker', 'Manu Ginóbili', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(69, 2, 'Quel record de victoires sur une seule saison régulière les Warriors ont-ils signé en 2015-2016 ?', '73 victoires', '72 victoires', '70 victoires', '75 victoires', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(70, 2, 'Quel joueur a rentré le tir à 3 points décisif dans la dernière minute du Game 7 des Finales 2016 pour Cleveland ?', 'Kyrie Irving', 'JR Smith', 'Kevin Love', 'LeBron James', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(71, 2, 'Quel pivot dominicain a mené les Boston Celtics au titre NBA en 2024 après 17 ans d\'attente ?', 'Al Horford', 'Kristaps Porziņģis', 'Robert Williams', 'Enes Kanter', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(72, 2, 'Quel tir signature à une main rendu célèbre par Kareem Abdul-Jabbar était réputé indéfendable ?', 'Le Skyhook', 'Le Fadeaway', 'Le Floater', 'Le Finger roll', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(73, 3, 'Sur quelle surface mythique se dispute le tournoi du Grand Chelem de Roland-Garros ?', 'Terre battue', 'Gazon', 'Dur (DecoTurf)', 'Moquette synthétique', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(74, 3, 'Combien de tournois majeurs composent le Grand Chelem de tennis chaque saison ?', '4', '3', '5', '6', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(75, 3, 'Quel champion espagnol a régné sur Roland-Garros avec un total record de 14 victoires ?', 'Rafael Nadal', 'Carlos Alcaraz', 'David Ferrer', 'Feliciano López', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(76, 3, 'Dans quelle ville britannique le prestigieux tournoi sur gazon de Wimbledon a-t-il lieu ?', 'Londres', 'Manchester', 'Édimbourg', 'Birmingham', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(77, 3, 'Quel maestro suisse réputé pour son revers à une main a remporté 20 titres du Grand Chelem ?', 'Roger Federer', 'Stan Wawrinka', 'Marc Rosset', 'Dominic Stricker', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(78, 3, 'Quel est le premier palier de points marqué par un joueur au cours d\'un jeu ordinaire ?', '15', '10', '5', '1', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(79, 3, 'Quel joueur serbe détient le record masculin du plus grand nombre de titres du Grand Chelem ?', 'Novak Djokovic', 'Goran Ivanišević', 'Daniil Medvedev', 'Marat Safin', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(80, 3, 'Comment nomme-t-on un service gagnant sur lequel le receveur ne parvient même pas à toucher la balle ?', 'Un ace', 'Un smash', 'Un lob', 'Un passing-shot', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(81, 3, 'Quelle joueuse américaine a dominé le tennis féminin moderne avec 23 titres du Grand Chelem en simple ?', 'Serena Williams', 'Venus Williams', 'Maria Sharapova', 'Lindsay Davenport', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(82, 3, 'Comment appelle-t-on le jeu décisif disputé lorsque les deux joueurs atteignent 6 jeux partout ?', 'Le tie-break', 'Le sudden death', 'Le money-time', 'Le set en or', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(83, 3, 'De quelle couleur sont les balles de tennis homologuées en compétition officielle ?', 'Jaune', 'Blanche', 'Verte', 'Orange', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(84, 3, 'Quel jeune prodige espagnol a remporté l\'US Open, Wimbledon et Roland-Garros avant ses 22 ans ?', 'Carlos Alcaraz', 'Jannik Sinner', 'Casper Ruud', 'Holger Rune', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(85, 3, 'Quel joueur est le dernier Français à avoir triomphé en simple messieurs à Roland-Garros (en 1983) ?', 'Yannick Noah', 'Henri Leconte', 'Guy Forget', 'Cédric Pioline', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(86, 3, 'Quel tournoi du Grand Chelem ouvre traditionnellement la saison chaque année au mois de janvier ?', 'Open d\'Australie', 'Roland-Garros', 'Wimbledon', 'US Open', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(87, 3, 'Quelle joueuse française a remporté le tournoi de Wimbledon en 2013 ?', 'Marion Bartoli', 'Amélie Mauresmo', 'Mary Pierce', 'Caroline Garcia', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(88, 3, 'Quel joueur italien est devenu numéro 1 mondial en 2024 après ses victoires en Australie et à l\'US Open ?', 'Jannik Sinner', 'Matteo Berrettini', 'Lorenzo Musetti', 'Fabio Fognini', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(89, 3, 'Combien de jeux d\'écart sont requis pour remporter un set ordinaire (ex: 6-4) ?', '2 jeux', '1 jeu', '3 jeux', '4 jeux', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(90, 3, 'Comment qualifie-t-on une balle frappée à la volée très près du filet qui retombe juste derrière ?', 'Un amorti', 'Un smash', 'Un lift', 'Un lob', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(91, 3, 'Quelle compétition historique masculine par équipes nationales attribue le « Saladier d\'Argent » ?', 'La Coupe Davis', 'La Laver Cup', 'L\'ATP Cup', 'La Fed Cup', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(92, 3, 'Quelle tradition vestimentaire stricte est imposée à tous les athlètes sur le gazon de Wimbledon ?', 'Tenue entièrement blanche', 'Short sombre exigé', 'Casquette obligatoire', 'Bandeau tricolore', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(93, 3, 'Quel joueur écossais a décroché deux médailles d\'or olympiques en simple et deux titres à Wimbledon ?', 'Andy Murray', 'Tim Henman', 'Cameron Norrie', 'Greg Rusedski', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(94, 3, 'Dans quel complexe sportif new-yorkais se dispute annuellement l\'US Open ?', 'Flushing Meadows', 'Melbourne Park', 'Queen\'s Club', 'Key Biscayne', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(95, 3, 'Quelle championne polonaise a accumulé les couronnes à Roland-Garros entre 2020 et 2024 ?', 'Iga Świątek', 'Aryna Sabalenka', 'Elena Rybakina', 'Agnieszka Radwańska', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(96, 3, 'Quelle ancienne numéro 1 mondiale française a été directrice du tournoi de Roland-Garros ?', 'Amélie Mauresmo', 'Mary Pierce', 'Marion Bartoli', 'Nathalie Dechy', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(97, 3, 'Quel Australien est le seul joueur de l\'histoire à avoir réalisé deux fois le Grand Chelem calendaire (1962 et 1969) ?', 'Rod Laver', 'Ken Rosewall', 'Roy Emerson', 'John Newcombe', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(98, 3, 'Combien de jeux a duré le match le plus long de l\'histoire du tennis entre Isner et Mahut à Wimbledon en 2010 ?', '183 jeux (70-68 au 5e)', '142 jeux', '164 jeux', '205 jeux', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(99, 3, 'Quelle championne allemande a accompli le « Golden Slam » parfait en 1988 (4 Majeurs + Or Olympique) ?', 'Steffi Graf', 'Martina Navrátilová', 'Chris Evert', 'Monica Seles', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(100, 3, 'Quel joueur suédois a remporté 5 fois d\'affilée Wimbledon et 6 Roland-Garros avant de se retirer à 26 ans ?', 'Björn Borg', 'Mats Wilander', 'Stefan Edberg', 'Robin Söderling', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(101, 3, 'Quel joueur suédois a créé la sensation en devenant le premier à vaincre Rafael Nadal à Roland-Garros (en 2009) ?', 'Robin Söderling', 'Novak Djokovic', 'Roger Federer', 'Dominic Thiem', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(102, 3, 'Quelle joueuse australienne détient le record historique absolu de titres du Grand Chelem en simple (24 sacres) ?', 'Margaret Court', 'Serena Williams', 'Billie Jean King', 'Evonne Goolagong', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(103, 3, 'En quelle année la France de Yannick Noah a-t-elle remporté sa première Coupe Davis moderne face aux USA à Lyon ?', '1991', '1986', '1996', '2001', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(104, 3, 'Quel joueur américain a créé la surprise en remportant Roland-Garros à seulement 17 ans et 3 mois en 1989 ?', 'Michael Chang', 'Andre Agassi', 'Pete Sampras', 'Jim Courier', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(105, 3, 'De quelle nationalité était Gustavo Kuerten, triple vainqueur de Roland-Garros (1997, 2000, 2001) ?', 'Brésilienne', 'Argentine', 'Chilienne', 'Espagnole', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(106, 3, 'Quel tournoi a accueilli la dernière finale de Grand Chelem jouée par Roger Federer en 2019 face à Djokovic ?', 'Wimbledon', 'Open d\'Australie', 'US Open', 'Roland-Garros', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(107, 3, 'Quel était le surnom de Pete Sampras, célèbre pour son service d\'une efficacité redoutable ?', 'Pistol Pete', 'The Rocket', 'The Bull', 'The Magician', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(108, 3, 'Quel score minimum avec deux points d\'écart faut-il atteindre pour remporter un tie-break ordinaire ?', '7 points', '10 points', '5 points', '6 points', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(109, 4, 'Tous les combien d\'années les Jeux Olympiques d\'été ont-ils lieu en règle générale ?', '4 ans', '2 ans', '5 ans', '3 ans', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(110, 4, 'Quel sprinteur jamaïcain est l\'homme le plus rapide de l\'histoire avec son record du monde sur 100m (9s58) ?', 'Usain Bolt', 'Tyson Gay', 'Yohan Blake', 'Asafa Powell', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(111, 4, 'Quel judoka français poids lourd a décroché 3 médailles d\'or olympiques individuelles et plus de 10 titres mondiaux ?', 'Teddy Riner', 'David Douillet', 'Clarisse Agbegnenou', 'Djamel Bouras', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(112, 4, 'Quelle couleur de maillot récompense le leader du classement général sur le Tour de France cycliste ?', 'Jaune', 'Vert', 'Blanc à pois rouges', 'Rose', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(113, 4, 'Quel nageur prodige français a conquis 4 médailles d\'or individuelles aux Jeux Olympiques de Paris 2024 ?', 'Léon Marchand', 'Florent Manaudou', 'Camille Lacourt', 'Alain Bernard', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(114, 4, 'Combien d\'anneaux entrelacés composent l\'emblème officiel des Jeux Olympiques ?', '5', '4', '6', '7', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(115, 4, 'Dans quel sport d\'hiver les joueurs poussent-ils un palet à l\'aide d\'une crosse sur la glace ?', 'Le hockey sur glace', 'Le curling', 'Le bobsleigh', 'Le patinage de vitesse', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(116, 4, 'Quelle équipe nationale de rugby réalise la célèbre danse rituelle du « Haka » avant chaque rencontre ?', 'La Nouvelle-Zélande', 'L\'Australie', 'L\'Afrique du Sud', 'Les Fidji', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(117, 4, 'Quelle est la distance exacte et officielle d\'une course de marathon en athlétisme ?', '42,195 km', '40 km', '45 km', '38,5 km', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(118, 4, 'Quelle métropole a été la ville hôte des Jeux Olympiques et Paralympiques d\'été en 2024 ?', 'Paris', 'Tokyo', 'Los Angeles', 'Londres', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(119, 4, 'Sur quelle surface de combat traditionnelle s\'affrontent les judokas vêtus d\'un judogi ?', 'Un tatami', 'Un ring', 'Une piste', 'Un court', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(120, 4, 'Quel pilote néerlandais a enchaîné les titres mondiaux de Formule 1 au volant de sa Red Bull ?', 'Max Verstappen', 'Lewis Hamilton', 'Charles Leclerc', 'Lando Norris', 'facile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(121, 4, 'Quel nageur américain est l\'athlète le plus médaillé de l\'histoire des JO avec 23 médailles d\'or ?', 'Michael Phelps', 'Mark Spitz', 'Ryan Lochte', 'Caeleb Dressel', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(122, 4, 'Combien de points rapporte un essai non transformé au rugby à XV ?', '5 points', '3 points', '7 points', '4 points', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(123, 4, 'Quel perchiste suédois vole régulièrement au-dessus de 6,25 m et bat ses propres records du monde ?', 'Armand Duplantis', 'Renaud Lavillenie', 'Sergueï Bubka', 'Sam Kendricks', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(124, 4, 'Quelle nation a remporté la Coupe du Monde de rugby à XV organisée en France en 2023 ?', 'Afrique du Sud', 'Nouvelle-Zélande', 'Angleterre', 'France', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(125, 4, 'Quel champion britannique détient conjointement avec Michael Schumacher le record de 7 titres mondiaux en F1 ?', 'Lewis Hamilton', 'Sebastian Vettel', 'Fernando Alonso', 'Alain Prost', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(126, 4, 'Quelle est la durée d\'un round officiel dans un combat de boxe anglaise professionnelle masculine ?', '3 minutes', '2 minutes', '5 minutes', '4 minutes', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(127, 4, 'Quel coureur cycliste slovène a réussi le doublé Giro d\'Italie - Tour de France en 2024 ?', 'Tadej Pogačar', 'Primož Roglič', 'Jonas Vingegaard', 'Remco Evenepoel', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(128, 4, 'Combien de joueurs d\'une équipe de handball sont présents en même temps sur le terrain ?', '7', '6', '8', '5', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(129, 4, 'En escrime, quelle arme s\'ajoute au fleuret et à l\'épée pour composer les trois disciplines olympiques ?', 'Le sabre', 'La dague', 'La rapière', 'Le javelot', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(130, 4, 'Quel sport d\'hiver combine la course en ski de fond et le tir à la carabine ?', 'Le biathlon', 'Le combiné nordique', 'Le bobsleigh', 'Le skeleton', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(131, 4, 'Quelle nation dispute chaque hiver le Tournoi des Six Nations avec la France, l\'Angleterre, l\'Écosse, l\'Irlande et le Pays de Galles ?', 'L\'Italie', 'L\'Espagne', 'Le Portugal', 'La Géorgie', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(132, 4, 'Dans quelle épreuve collective d\'athlétisme les relayeurs se passent-ils un témoin à pleine vitesse ?', 'Le relais 4x100m', 'Le 110m haies', 'Le 3000m steeple', 'Le décathlon', 'moyen', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(133, 4, 'Quel pilote français a remporté 4 titres de champion du monde de F1 et entretenu une rivalité mythique avec Senna ?', 'Alain Prost', 'Jean Alesi', 'René Arnoux', 'Didier Pironi', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(134, 4, 'Quel athlète tchèque a réussi l\'exploit inimaginable de remporter le 5 000m, le 10 000m et le marathon aux JO d\'Helsinki 1952 ?', 'Emil Zátopek', 'Paavo Nurmi', 'Abebe Bikila', 'Haile Gebrselassie', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(135, 4, 'En quelle année la première édition du Tour de France cycliste s\'est-elle élancée ?', '1903', '1896', '1910', '1920', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(136, 4, 'Sous quel nom de naissance Mohamed Ali a-t-il été champion olympique de boxe à Rome en 1960 ?', 'Cassius Clay', 'Joe Frazier', 'Sonny Liston', 'George Foreman', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(137, 4, 'Quel est le score parfait maximal pouvant être réalisé dans une partie de bowling (12 strikes consécutifs) ?', '300 points', '200 points', '250 points', '400 points', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(138, 4, 'Quelle gymnaste roumaine est entrée dans l\'histoire en obtenant la toute première note parfaite de 10.0 aux JO de Montréal 1976 ?', 'Nadia Comăneci', 'Simone Biles', 'Svetlana Khorkina', 'Larisa Latynina', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(139, 4, 'Quel marathonien kényan a été le premier être humain à courir un marathon en moins de 2 heures lors d\'un défi à Vienne en 2019 ?', 'Eliud Kipchoge', 'Kelvin Kiptum', 'Kenenisa Bekele', 'Wilson Kipsang', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(140, 4, 'Quelle judokate française ultra-dominante a été sextuple championne du monde en catégorie moins de 63 kg ?', 'Clarisse Agbegnenou', 'Lucie Décosse', 'Gévrise Émane', 'Céline Lebrun', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(141, 4, 'Sur quel circuit sarthois légendaire se déroule la course d\'endurance automobile des 24 Heures du Mans ?', 'Circuit des 24 Heures (Bugatti)', 'Circuit Paul Ricard', 'Magny-Cours', 'Spa-Francorchamps', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(142, 4, 'Quelle distance de natation doit être parcourue lors d\'un triathlon olympique officiel (distance M) ?', '1 500 mètres', '1 000 mètres', '2 000 mètres', '3 800 mètres', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(143, 4, 'Dans quelle civilisation antique les Jeux Olympiques sont-ils nés en 776 avant J.-C. dans le Péloponnèse ?', 'Grèce antique', 'Rome antique', 'Égypte antique', 'Perse antique', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29'),
(144, 4, 'Quelle légende ukrainienne du saut à la perche a battu 35 records du monde entre 1984 et 1994 ?', 'Sergueï Bubka', 'Renaud Lavillenie', 'Maksim Tarasov', 'Igor Trandenkov', 'difficile', '2026-09-22 15:25:29', '2026-09-22 15:25:29');

-- --------------------------------------------------------
-- Table: parties
-- --------------------------------------------------------
DROP TABLE IF EXISTS `parties`;
CREATE TABLE `parties` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie_id` bigint(20) unsigned DEFAULT NULL,
  `difficulte` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solo',
  `score` int(10) unsigned NOT NULL,
  `total` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parties_categorie_id_foreign` (`categorie_id`),
  CONSTRAINT `parties_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
