-- MySQL dump 10.13  Distrib 8.4.4, for Win64 (x86_64)
--
-- Host: localhost    Database: genkaix_task_2_interview_scheduler
-- ------------------------------------------------------
-- Server version	8.4.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Admin Genkaix','admin@genkaix.com','$2b$10$CLLRX4CK3KxqoypQYoKdtufg7m3NhSne/LciQ1Py.tPyFbog9LhHK',1,'2026-01-20 09:53:11');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_activity_logs`
--

DROP TABLE IF EXISTS `admin_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_activity_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_activity_logs`
--

LOCK TABLES `admin_activity_logs` WRITE;
/*!40000 ALTER TABLE `admin_activity_logs` DISABLE KEYS */;
INSERT INTO `admin_activity_logs` VALUES (1,1,'Freeze Slot','slot',13,'Slot frozen','2026-01-24 10:41:55'),(2,1,'Activate Slot','slot',13,'Slot activated','2026-01-24 10:41:58'),(3,1,'Delete Whitelist Email','whitelisted_email',25,'Deleted whitelisted candidate N/A','2026-01-24 11:04:50'),(4,1,'Cancel Booking','booking',20,'Cancelled booking for iamgroot2663@gmail.com','2026-01-24 11:11:05'),(5,1,'Delete Whitelist Email','whitelisted_email',26,'Deleted whitelisted candidate iamgroot2663@gmail.com','2026-01-24 11:11:54'),(6,1,'Cancel Booking','booking',22,'Cancelled booking for ram@gmail.com','2026-01-24 17:22:39'),(7,1,'Cancel Booking','booking',23,'Cancelled booking for ram@gmail.com','2026-01-24 18:47:14'),(8,1,'Cancel Booking','booking',25,'Cancelled booking for harsh@gmail.com','2026-01-25 17:11:18'),(9,1,'Cancel Booking','booking',26,'Cancelled booking for harsh@gmail.com','2026-01-25 17:12:38'),(10,1,'Cancel Booking','booking',24,'Cancelled booking for iamgroot2663@gmail.com','2026-01-25 17:12:49');
/*!40000 ALTER TABLE `admin_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_bookings`
--

DROP TABLE IF EXISTS `interview_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot_id` int NOT NULL,
  `whitelisted_email_id` int NOT NULL,
  `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `meeting_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewer_role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slot_id` (`slot_id`),
  UNIQUE KEY `whitelisted_email_id` (`whitelisted_email_id`),
  UNIQUE KEY `unique_whitelisted_email` (`whitelisted_email_id`),
  CONSTRAINT `fk_booking_slot` FOREIGN KEY (`slot_id`) REFERENCES `interview_slots` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_whitelisted_email` FOREIGN KEY (`whitelisted_email_id`) REFERENCES `whitelisted_email` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_bookings`
--

LOCK TABLES `interview_bookings` WRITE;
/*!40000 ALTER TABLE `interview_bookings` DISABLE KEYS */;
INSERT INTO `interview_bookings` VALUES (27,12,27,'2026-01-26 08:00:33','https://meet.google.com/mst-pmgc-xqh','Rajesh Sharma','igaurav002@gmail.com',NULL,NULL,'2026-01-26 08:03:41');
/*!40000 ALTER TABLE `interview_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_slots`
--

DROP TABLE IF EXISTS `interview_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_booked` tinyint(1) DEFAULT '0',
  `created_by_admin_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slot_time` (`slot_date`,`start_time`,`end_time`),
  KEY `fk_slots_admin` (`created_by_admin_id`),
  CONSTRAINT `fk_slots_admin` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_slots`
--

LOCK TABLES `interview_slots` WRITE;
/*!40000 ALTER TABLE `interview_slots` DISABLE KEYS */;
INSERT INTO `interview_slots` VALUES (11,'2026-02-01','12:00:00','13:00:00',0,1,'2026-01-23 06:28:18',1),(12,'2026-01-31','13:00:00','14:00:00',1,1,'2026-01-23 08:54:17',1),(14,'2026-01-31','17:00:00','18:00:00',0,1,'2026-01-26 07:11:02',1);
/*!40000 ALTER TABLE `interview_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whitelisted_email`
--

DROP TABLE IF EXISTS `whitelisted_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whitelisted_email` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `added_by_admin_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_whitelisted_email_admin` (`added_by_admin_id`),
  CONSTRAINT `fk_whitelisted_email_admin` FOREIGN KEY (`added_by_admin_id`) REFERENCES `admin` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whitelisted_email`
--

LOCK TABLES `whitelisted_email` WRITE;
/*!40000 ALTER TABLE `whitelisted_email` DISABLE KEYS */;
INSERT INTO `whitelisted_email` VALUES (22,'harsh@gmail.com',1,'2026-01-23 08:36:46'),(23,'ram@gmail.com',1,'2026-01-23 11:58:18'),(27,'iamgroot2663@gmail.com',1,'2026-01-25 06:46:05');
/*!40000 ALTER TABLE `whitelisted_email` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-26 20:01:15
