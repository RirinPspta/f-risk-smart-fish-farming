-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for smart_fishing
CREATE DATABASE IF NOT EXISTS `smart_fishing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_fishing`;

-- Dumping structure for table smart_fishing.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.cache: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.cache_locks: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.jobs: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.job_batches: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.migrations: ~5 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_06_21_115118_create_personal_access_tokens_table', 1),
	(5, '2026_06_21_115128_create_water_qualities_table', 1);

-- Dumping structure for table smart_fishing.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.personal_access_tokens: ~10 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 2, 'auth_token', '3457e2419cd5423ef7591ef73111a31289b2079a2f5abc585338971dc98953c6', '["*"]', '2026-06-23 02:09:23', NULL, '2026-06-23 01:55:12', '2026-06-23 02:09:23'),
	(2, 'App\\Models\\User', 1, 'auth_token', 'cbf260b982e98e3711b3bbc89dcfc49dd4f570ce7ef2fc70b2ddb8745ceded12', '["*"]', '2026-06-24 20:44:59', NULL, '2026-06-24 19:53:03', '2026-06-24 20:44:59'),
	(3, 'App\\Models\\User', 1, 'auth_token', '558e39219e5b620e1bbd91d86b926227ae45c0c20051223243c69f9d615b42df', '["*"]', '2026-06-24 20:52:57', NULL, '2026-06-24 20:51:17', '2026-06-24 20:52:57'),
	(9, 'App\\Models\\User', 4, 'auth_token', '93229f56a7ab63ad53f998bdca8c9746dcd3660c319eeec84415357a67262faf', '["*"]', '2026-06-25 00:54:47', NULL, '2026-06-25 00:37:03', '2026-06-25 00:54:47'),
	(14, 'App\\Models\\User', 6, 'auth_token', 'bb2b3c2d325517100e232eb7d4f5bd4787916f0d73a18d767e55b4f0e1c230d4', '["*"]', '2026-06-25 01:53:36', NULL, '2026-06-25 01:44:24', '2026-06-25 01:53:36'),
	(18, 'App\\Models\\User', 4, 'auth_token', 'fcfe2b9caa1c105dfa7496fab5116be0d0c47f655f809a1b89aad07ac5352f78', '["*"]', NULL, NULL, '2026-06-25 02:36:17', '2026-06-25 02:36:17'),
	(20, 'App\\Models\\User', 4, 'auth_token', 'cb16d96176f35f25abf02742eb324bb223c143ae5b4946f1e89bd880d62aeea8', '["*"]', NULL, NULL, '2026-06-25 02:36:49', '2026-06-25 02:36:49'),
	(21, 'App\\Models\\User', 6, 'auth_token', 'bbabdcb6d71dd88ea151a62eb1c31e117c4d025afdff5c774a7531b84a276755', '["*"]', NULL, NULL, '2026-06-25 02:37:03', '2026-06-25 02:37:03'),
	(24, 'App\\Models\\User', 1, 'auth_token', '21a3f848b6fe67f82cdf60e813648ccc0b9e3cf58a4b98f5566c5d41c1ed622c', '["*"]', '2026-06-27 03:33:21', NULL, '2026-06-25 02:51:54', '2026-06-27 03:33:21'),
	(27, 'App\\Models\\User', 4, 'auth_token', 'a28d855233a6077615fb74bd26066a0d90e0e5786275cac0ac5cee07be3574b1', '["*"]', '2026-06-27 06:57:41', NULL, '2026-06-27 05:31:21', '2026-06-27 06:57:41');

-- Dumping structure for table smart_fishing.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.sessions: ~0 rows (approximately)

-- Dumping structure for table smart_fishing.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'petani',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.users: ~5 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Administrator F-RISK', 'admin@smartfishing.com', NULL, '$2y$12$OTYD60nZlMRFzMoNsihToewRNFZt04PY0WFXpnutIZX1NAItI.eYS', 'admin', NULL, '2026-06-23 01:52:16', '2026-06-23 01:52:16'),
	(2, 'Gede Bagus', 'gedebagus@gmail.com', NULL, '$2y$12$fLgxaXR8vSseXLfE6fU.W.E2H/LCPLx3exMTr9OjFefZ7Pe3bpRzW', 'petambak', NULL, '2026-06-23 01:52:17', '2026-06-25 03:03:40'),
	(4, 'Undiksha', 'undiksha@gmail.com', NULL, '$2y$12$.ZF73d4jWzW/qJzD0pl5KeDVRmpVJyhwlgv7UvM94xyQtiAiB4f9m', 'petambak', NULL, '2026-06-24 22:01:01', '2026-06-24 22:01:01'),
	(8, 'Bli Putu', 'bliputu@gmail.com', NULL, '$2y$12$8cP/9ME9K7GkMll5Frha8uOvoI3m0FEZCk9svSVO68AKAnjPeljc2', 'petambak', NULL, '2026-06-25 03:03:25', '2026-06-25 03:03:25'),
	(9, 'Gek Ayu', 'gekayu@gmail.com', NULL, '$2y$12$OfgL9BtCJFNf5RB5PGhXWepwg9fVdqw2rRJMV9oaOfoGOTC3Sf/V.', 'petambak', NULL, '2026-06-25 03:07:25', '2026-06-25 03:07:25');

-- Dumping structure for table smart_fishing.water_qualities
CREATE TABLE IF NOT EXISTS `water_qualities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `tanggal_pengukuran` date NOT NULL,
  `ph` double NOT NULL,
  `suhu` double NOT NULL,
  `dissolved_oxygen` double NOT NULL,
  `kekeruhan` double NOT NULL,
  `nitrate` double NOT NULL,
  `amonia` double NOT NULL,
  `status_air` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rekomendasi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `water_qualities_user_id_foreign` (`user_id`),
  CONSTRAINT `water_qualities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_fishing.water_qualities: ~17 rows (approximately)
INSERT INTO `water_qualities` (`id`, `user_id`, `tanggal_pengukuran`, `ph`, `suhu`, `dissolved_oxygen`, `kekeruhan`, `nitrate`, `amonia`, `status_air`, `rekomendasi`, `created_at`, `updated_at`) VALUES
	(1, 2, '2026-06-14', 7.2, 28.5, 6.5, 30, 12, 0.02, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa. Pantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(2, 2, '2026-06-15', 7.4, 29, 6.2, 32.5, 12.8, 0.03, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa. Pantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(3, 2, '2026-06-16', 7.5, 28.8, 5.8, 45, 15.2, 0.04, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa. Pantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(4, 2, '2026-06-17', 7.1, 26.5, 4.5, 55, 18, 0.08, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa. Pantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(5, 2, '2026-06-18', 5.8, 24, 1.8, 160, 210, 3.5, 'Beresiko', '⚠️ STATUS AIR: BERISIKO\nKondisi air saat ini kurang baik dan berpotensi membahayakan ikan Nila.\n\nParameter Dominan:\n- Kadar oksigen terlarut sangat rendah\n- Kadar amonia melebihi batas aman\n- Air sangat keruh, kualitas air menurun\n- Suhu air terlalu rendah untuk ikan Nila\n- Air terlalu asam, berbahaya bagi ikan\n- Nitrat menumpuk, indikasi air sudah lama tidak diganti\n\nRekomendasi:\n- Nyalakan atau tambah aerator/kincir air segera\n- Hentikan pemberian pakan dan ganti sebagian air kolam\n- Ganti sebagian air dan bersihkan endapan di dasar kolam\n- Kurangi kedalaman air dan pastikan kolam mendapat sinar matahari cukup\n- Tambahkan kapur Dolomit atau Kalsit secara bertahap\n- Ganti 20-30% air kolam dan bersihkan filter', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(6, 2, '2026-06-19', 6.8, 27, 5.5, 40, 16.5, 0.05, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa. Pantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(7, 2, '2026-06-20', 7.3, 28.2, 6.1, 28, 11.2, 0.02, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini masih aman, namun perlu diperhatikan catatan berikut:\n- Air terlalu jernih. Pantau kondisi plankton, belum perlu tindakan segera.\nPantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(8, 2, '2026-06-21', 7.6, 28.9, 6.4, 22, 9.5, 0.02, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini masih aman, namun perlu diperhatikan catatan berikut:\n- Air terlalu jernih. Pantau kondisi plankton, belum perlu tindakan segera.\nPantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(9, 2, '2026-06-22', 7.4, 28.4, 6.8, 18, 8.2, 0.01, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini masih aman, namun perlu diperhatikan catatan berikut:\n- Air terlalu jernih. Pantau kondisi plankton, belum perlu tindakan segera.\nPantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(10, 2, '2026-06-23', 7.3, 28, 7, 15, 7.5, 0.01, 'Aman', '✅ STATUS AIR: AMAN\nKondisi air kolam saat ini masih aman, namun perlu diperhatikan catatan berikut:\n- Air terlalu jernih. Pantau kondisi plankton, belum perlu tindakan segera.\nPantau kondisi air setiap hari.', '2026-06-23 01:52:17', '2026-06-23 01:52:17'),
	(13, 2, '2026-06-23', 5.9, 25, 11, 27, 63, 0.05, 'Beresiko', '⚠️ STATUS AIR: BERISIKO\nKondisi air saat ini kurang baik dan berpotensi membahayakan ikan Nila.\n\nParameter Dominan:\n- Air terlalu jernih, kandungan plankton sangat rendah\n- Air terlalu asam, berbahaya bagi ikan\n- Nitrat menumpuk, indikasi air sudah lama tidak diganti\n\nRekomendasi:\n- Tambahkan pupuk organik untuk menumbuhkan plankton\n- Tambahkan kapur Dolomit atau Kalsit secara bertahap\n- Ganti 20-30% air kolam dan bersihkan filter', '2026-06-23 01:58:39', '2026-06-23 01:58:39'),
	(17, 4, '2026-06-25', 5.9, 25, 11, 27, 63, 0.05, '✅ AMAN 99%', '✅ STATUS AIR: AMAN 99%\n\nKondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\n\nNitrat mulai meningkat. Kurangi jumlah pakan atau bersihkan filter kolam.\npH air lebih rendah dari normal. Tambahkan kapur Dolomit secara bertahap.\nAir terlalu jernih. Pantau kondisi plankton, belum perlu tindakan segera.\n\nPantau kondisi air setiap hari.', '2026-06-24 22:02:42', '2026-06-24 22:02:42'),
	(18, 4, '2026-06-25', 6.8, 32, 11, 27, 63, 0.05, '⚠️ BERISIKO 52%', '⚠️ STATUS AIR: BERISIKO 52%\n\nKondisi air saat ini kurang baik dan berpotensi membahayakan ikan Nila.\n\nParameter Dominan:\n- Air terlalu jernih, kandungan plankton sangat rendah\n- Suhu air terlalu tinggi untuk ikan Nila\n- Nitrat menumpuk, indikasi air sudah lama tidak diganti\n\nRekomendasi:\n- Tambahkan pupuk organik untuk menumbuhkan plankton\n- Pasang peneduh di atas kolam dan tingkatkan sirkulasi air\n- Ganti 20-30% air kolam dan bersihkan filter\n\nUkur ulang kondisi air 1-2 jam setelah tindakan dilakukan.', '2026-06-24 22:03:35', '2026-06-24 22:03:35'),
	(19, 4, '2026-06-25', 6.8, 25, 11, 41, 27, 0.2, '⚠️ BERISIKO 56%', '⚠️ STATUS AIR: BERISIKO 56%\n\nKondisi air saat ini kurang baik dan berpotensi membahayakan ikan Nila.\n\nParameter Dominan:\n- Kondisi air secara keseluruhan kurang ideal\n\nRekomendasi:\n- Pantau pergerakan dan nafsu makan ikan secara langsung\n\nUkur ulang kondisi air 1-2 jam setelah tindakan dilakukan.', '2026-06-24 22:05:22', '2026-06-24 22:05:22'),
	(21, 4, '2026-06-27', 7, 28, 5, 50, 39, 0.7, '✅ AMAN 82%', '✅ STATUS AIR: AMAN 82%\n\nKondisi air kolam saat ini sangat baik untuk ikan Nila. Tidak diperlukan tindakan khusus. Lanjutkan rutinitas perawatan seperti biasa.', '2026-06-27 05:34:49', '2026-06-27 05:34:49'),
	(22, 4, '2026-06-27', 1, 1, 1, 1, 1, 1, '⚠️ BERISIKO 71%', '⚠️ STATUS AIR: BERISIKO 71%\n\nKondisi air saat ini kurang baik dan berpotensi membahayakan ikan Nila.\n\nParameter Dominan:\n- Kadar oksigen terlarut sangat rendah\n- Air terlalu jernih, kandungan plankton sangat rendah\n- Suhu air terlalu rendah untuk ikan Nila\n- Air terlalu asam, berbahaya bagi ikan\n\nRekomendasi:\n- Nyalakan atau tambah aerator/kincir air segera\n- Tambahkan pupuk organik untuk menumbuhkan plankton\n- Kurangi kedalaman air dan pastikan kolam mendapat sinar matahari cukup\n- Tambahkan kapur Dolomit atau Kalsit secara bertahap\n\nUkur ulang kondisi air 1-2 jam setelah tindakan dilakukan.', '2026-06-27 06:00:22', '2026-06-27 06:00:22'),
	(23, 4, '2026-06-27', 1, 26, 6, 40, 1, 8, '✅ AMAN 57%', '✅ STATUS AIR: AMAN 57%\n\nKondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\n\npH air lebih rendah dari normal. Tambahkan kapur Dolomit secara bertahap.\nAmonia mulai terdeteksi. Kurangi jumlah pakan untuk sementara waktu.\n\nPantau kondisi air setiap hari.', '2026-06-27 06:57:40', '2026-06-27 06:57:40');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
