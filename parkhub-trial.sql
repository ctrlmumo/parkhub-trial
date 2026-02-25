CREATE DATABASE  IF NOT EXISTS `parkhub_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `parkhub_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: parkhub_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_752b0e2b_fk_users_id` (`user_id`),
  CONSTRAINT `audit_logs_user_id_752b0e2b_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add system setting',12,'add_systemsetting'),(22,'Can change system setting',12,'change_systemsetting'),(23,'Can delete system setting',12,'delete_systemsetting'),(24,'Can view system setting',12,'view_systemsetting'),(25,'Can add user',13,'add_user'),(26,'Can change user',13,'change_user'),(27,'Can delete user',13,'delete_user'),(28,'Can view user',13,'view_user'),(29,'Can add audit log',6,'add_auditlog'),(30,'Can change audit log',6,'change_auditlog'),(31,'Can delete audit log',6,'delete_auditlog'),(32,'Can view audit log',6,'view_auditlog'),(33,'Can add parking lot',8,'add_parkinglot'),(34,'Can change parking lot',8,'change_parkinglot'),(35,'Can delete parking lot',8,'delete_parkinglot'),(36,'Can view parking lot',8,'view_parkinglot'),(37,'Can add parking slot',9,'add_parkingslot'),(38,'Can change parking slot',9,'change_parkingslot'),(39,'Can delete parking slot',9,'delete_parkingslot'),(40,'Can view parking slot',9,'view_parkingslot'),(41,'Can add booking',7,'add_booking'),(42,'Can change booking',7,'change_booking'),(43,'Can delete booking',7,'delete_booking'),(44,'Can view booking',7,'view_booking'),(45,'Can add payment',10,'add_payment'),(46,'Can change payment',10,'change_payment'),(47,'Can delete payment',10,'delete_payment'),(48,'Can view payment',10,'view_payment'),(49,'Can add review',11,'add_review'),(50,'Can change review',11,'change_review'),(51,'Can delete review',11,'delete_review'),(52,'Can view review',11,'view_review');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `duration_hours` int NOT NULL,
  `vehicle_number` varchar(20) NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `booking_reference` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `parking_slot_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_reference` (`booking_reference`),
  KEY `bookings_user_id_6e734b08_fk_users_id` (`user_id`),
  KEY `bookings_parking_slot_id_e7534469_fk_parking_slots_id` (`parking_slot_id`),
  CONSTRAINT `bookings_parking_slot_id_e7534469_fk_parking_slots_id` FOREIGN KEY (`parking_slot_id`) REFERENCES `parking_slots` (`id`),
  CONSTRAINT `bookings_user_id_6e734b08_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (15,'2026-02-25 16:30:01.076628','2026-02-25 18:30:01.076642',2,'KCA 123A',50.00,100.00,'BK001','active','2026-02-25 17:30:01.077184','2026-02-25 17:30:01.077207',26,130);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(6,'api','auditlog'),(7,'api','booking'),(8,'api','parkinglot'),(9,'api','parkingslot'),(10,'api','payment'),(11,'api','review'),(12,'api','systemsetting'),(13,'api','user'),(2,'auth','group'),(3,'auth','permission'),(4,'contenttypes','contenttype'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-02-25 16:29:15.248179'),(2,'contenttypes','0002_remove_content_type_name','2026-02-25 16:29:15.460316'),(3,'auth','0001_initial','2026-02-25 16:29:16.225395'),(4,'auth','0002_alter_permission_name_max_length','2026-02-25 16:29:16.408472'),(5,'auth','0003_alter_user_email_max_length','2026-02-25 16:29:16.429008'),(6,'auth','0004_alter_user_username_opts','2026-02-25 16:29:16.454179'),(7,'auth','0005_alter_user_last_login_null','2026-02-25 16:29:16.501579'),(8,'auth','0006_require_contenttypes_0002','2026-02-25 16:29:16.509322'),(9,'auth','0007_alter_validators_add_error_messages','2026-02-25 16:29:16.539937'),(10,'auth','0008_alter_user_username_max_length','2026-02-25 16:29:16.576208'),(11,'auth','0009_alter_user_last_name_max_length','2026-02-25 16:29:16.599749'),(12,'auth','0010_alter_group_name_max_length','2026-02-25 16:29:16.634180'),(13,'auth','0011_update_proxy_permissions','2026-02-25 16:29:16.650175'),(14,'auth','0012_alter_user_first_name_max_length','2026-02-25 16:29:16.666009'),(15,'api','0001_initial','2026-02-25 16:29:19.264313'),(16,'admin','0001_initial','2026-02-25 16:29:19.713576'),(17,'admin','0002_logentry_remove_auto_add','2026-02-25 16:29:19.762272'),(18,'admin','0003_logentry_add_action_flag_choices','2026-02-25 16:29:19.822976'),(19,'sessions','0001_initial','2026-02-25 16:29:19.943901');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_lots`
--

DROP TABLE IF EXISTS `parking_lots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_lots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `total_capacity` int NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `is_24_7` tinyint(1) NOT NULL,
  `open_time` time(6) DEFAULT NULL,
  `close_time` time(6) DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `manager_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parking_lots_manager_id_fd9baea6_fk_users_id` (`manager_id`),
  CONSTRAINT `parking_lots_manager_id_fd9baea6_fk_users_id` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_lots`
--

LOCK TABLES `parking_lots` WRITE;
/*!40000 ALTER TABLE `parking_lots` DISABLE KEYS */;
INSERT INTO `parking_lots` VALUES (8,'Main Campus Parking','University Way, Nairobi',80,50.00,1,NULL,NULL,'[\"24/7 Security\", \"Covered Parking\", \"CCTV\", \"Lighting\"]',1,-1.29210000,36.82190000,'2026-02-25 17:30:01.047562','2026-02-25 17:30:01.047590',24),(9,'Westlands Mall Parking','Westlands, Nairobi',120,60.00,1,NULL,NULL,'[\"Shopping Mall\", \"Covered\", \"EV Charging\", \"Car Wash\"]',1,-1.26760000,36.81080000,'2026-02-25 17:30:01.054107','2026-02-25 17:30:01.054135',24),(10,'Kimoda','Kilimani',67,70.00,1,NULL,NULL,NULL,1,NULL,NULL,'2026-02-25 18:21:43.900073','2026-02-25 18:21:43.900236',24),(11,'gloria parks','LA',21,50.00,1,NULL,NULL,NULL,1,NULL,NULL,'2026-02-25 18:52:02.949580','2026-02-25 18:52:02.949614',24);
/*!40000 ALTER TABLE `parking_lots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_slots`
--

DROP TABLE IF EXISTS `parking_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `slot_number` varchar(20) NOT NULL,
  `section` varchar(10) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `is_ev_charging` tinyint(1) NOT NULL,
  `is_disabled_friendly` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `parking_lot_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `parking_slots_parking_lot_id_slot_number_45d09073_uniq` (`parking_lot_id`,`slot_number`),
  CONSTRAINT `parking_slots_parking_lot_id_c83cb6c2_fk_parking_lots_id` FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_slots`
--

LOCK TABLES `parking_slots` WRITE;
/*!40000 ALTER TABLE `parking_slots` DISABLE KEYS */;
INSERT INTO `parking_slots` VALUES (129,'A01','A','available',0,1,'2026-02-25 17:30:01.061910','2026-02-25 17:30:01.062748',8),(130,'A02','A','occupied',0,0,'2026-02-25 17:30:01.061942','2026-02-25 17:30:01.062764',8),(131,'A03','A','available',0,0,'2026-02-25 17:30:01.061955','2026-02-25 17:30:01.062778',8),(132,'A04','A','available',0,0,'2026-02-25 17:30:01.061965','2026-02-25 17:30:01.062791',8),(133,'A05','A','reserved',0,0,'2026-02-25 17:30:01.061973','2026-02-25 17:30:01.062805',8),(134,'A06','A','available',1,0,'2026-02-25 17:30:01.061983','2026-02-25 17:30:01.062819',8),(135,'A07','A','available',0,0,'2026-02-25 17:30:01.061992','2026-02-25 17:30:01.062832',8),(136,'A08','A','available',0,0,'2026-02-25 17:30:01.062001','2026-02-25 17:30:01.062846',8),(137,'A09','A','available',0,0,'2026-02-25 17:30:01.062010','2026-02-25 17:30:01.062861',8),(138,'A10','A','available',0,0,'2026-02-25 17:30:01.062019','2026-02-25 17:30:01.062876',8),(139,'A11','A','available',0,1,'2026-02-25 17:30:01.062028','2026-02-25 17:30:01.062891',8),(140,'A12','A','available',0,0,'2026-02-25 17:30:01.062038','2026-02-25 17:30:01.062905',8),(141,'A13','A','available',0,0,'2026-02-25 17:30:01.062047','2026-02-25 17:30:01.062920',8),(142,'A14','A','available',0,0,'2026-02-25 17:30:01.062056','2026-02-25 17:30:01.062934',8),(143,'A15','A','available',0,0,'2026-02-25 17:30:01.062066','2026-02-25 17:30:01.062950',8),(144,'A16','A','available',1,0,'2026-02-25 17:30:01.062075','2026-02-25 17:30:01.062964',8),(145,'A17','A','available',0,0,'2026-02-25 17:30:01.062084','2026-02-25 17:30:01.062978',8),(146,'A18','A','available',0,0,'2026-02-25 17:30:01.062093','2026-02-25 17:30:01.062994',8),(147,'A19','A','available',0,0,'2026-02-25 17:30:01.062102','2026-02-25 17:30:01.063008',8),(148,'A20','A','available',0,0,'2026-02-25 17:30:01.062116','2026-02-25 17:30:01.063024',8),(149,'B01','B','available',0,1,'2026-02-25 17:30:01.062131','2026-02-25 17:30:01.063039',8),(150,'B02','B','occupied',0,0,'2026-02-25 17:30:01.062140','2026-02-25 17:30:01.063054',8),(151,'B03','B','available',0,0,'2026-02-25 17:30:01.062149','2026-02-25 17:30:01.063069',8),(152,'B04','B','available',0,0,'2026-02-25 17:30:01.062164','2026-02-25 17:30:01.063085',8),(153,'B05','B','reserved',0,0,'2026-02-25 17:30:01.062174','2026-02-25 17:30:01.063103',8),(154,'B06','B','available',1,0,'2026-02-25 17:30:01.062183','2026-02-25 17:30:01.063130',8),(155,'B07','B','available',0,0,'2026-02-25 17:30:01.062192','2026-02-25 17:30:01.063147',8),(156,'B08','B','available',0,0,'2026-02-25 17:30:01.062200','2026-02-25 17:30:01.063162',8),(157,'B09','B','available',0,0,'2026-02-25 17:30:01.062209','2026-02-25 17:30:01.063177',8),(158,'B10','B','available',0,0,'2026-02-25 17:30:01.062218','2026-02-25 17:30:01.063192',8),(159,'B11','B','available',0,1,'2026-02-25 17:30:01.062226','2026-02-25 17:30:01.063208',8),(160,'B12','B','available',0,0,'2026-02-25 17:30:01.062235','2026-02-25 17:30:01.063224',8),(161,'B13','B','available',0,0,'2026-02-25 17:30:01.062243','2026-02-25 17:30:01.063240',8),(162,'B14','B','available',0,0,'2026-02-25 17:30:01.062252','2026-02-25 17:30:01.063257',8),(163,'B15','B','available',0,0,'2026-02-25 17:30:01.062260','2026-02-25 17:30:01.063273',8),(164,'B16','B','available',1,0,'2026-02-25 17:30:01.062268','2026-02-25 17:30:01.063288',8),(165,'B17','B','available',0,0,'2026-02-25 17:30:01.062277','2026-02-25 17:30:01.063304',8),(166,'B18','B','available',0,0,'2026-02-25 17:30:01.062286','2026-02-25 17:30:01.063320',8),(167,'B19','B','available',0,0,'2026-02-25 17:30:01.062294','2026-02-25 17:30:01.063336',8),(168,'B20','B','available',0,0,'2026-02-25 17:30:01.062303','2026-02-25 17:30:01.063352',8),(169,'C01','C','available',0,1,'2026-02-25 17:30:01.062311','2026-02-25 17:30:01.063369',8),(170,'C02','C','occupied',0,0,'2026-02-25 17:30:01.062320','2026-02-25 17:30:01.063386',8),(171,'C03','C','available',0,0,'2026-02-25 17:30:01.062329','2026-02-25 17:30:01.063402',8),(172,'C04','C','available',0,0,'2026-02-25 17:30:01.062337','2026-02-25 17:30:01.063419',8),(173,'C05','C','reserved',0,0,'2026-02-25 17:30:01.062346','2026-02-25 17:30:01.063435',8),(174,'C06','C','available',1,0,'2026-02-25 17:30:01.062354','2026-02-25 17:30:01.063451',8),(175,'C07','C','available',0,0,'2026-02-25 17:30:01.062363','2026-02-25 17:30:01.063472',8),(176,'C08','C','available',0,0,'2026-02-25 17:30:01.062375','2026-02-25 17:30:01.063490',8),(177,'C09','C','available',0,0,'2026-02-25 17:30:01.062384','2026-02-25 17:30:01.063506',8),(178,'C10','C','available',0,0,'2026-02-25 17:30:01.062392','2026-02-25 17:30:01.063522',8),(179,'C11','C','available',0,1,'2026-02-25 17:30:01.062401','2026-02-25 17:30:01.063538',8),(180,'C12','C','available',0,0,'2026-02-25 17:30:01.062409','2026-02-25 17:30:01.063554',8),(181,'C13','C','available',0,0,'2026-02-25 17:30:01.062418','2026-02-25 17:30:01.063571',8),(182,'C14','C','available',0,0,'2026-02-25 17:30:01.062426','2026-02-25 17:30:01.063587',8),(183,'C15','C','available',0,0,'2026-02-25 17:30:01.062435','2026-02-25 17:30:01.063603',8),(184,'C16','C','available',1,0,'2026-02-25 17:30:01.062443','2026-02-25 17:30:01.063619',8),(185,'C17','C','available',0,0,'2026-02-25 17:30:01.062452','2026-02-25 17:30:01.063635',8),(186,'C18','C','available',0,0,'2026-02-25 17:30:01.062460','2026-02-25 17:30:01.063660',8),(187,'C19','C','available',0,0,'2026-02-25 17:30:01.062469','2026-02-25 17:30:01.063678',8),(188,'C20','C','available',0,0,'2026-02-25 17:30:01.062477','2026-02-25 17:30:01.063694',8),(189,'D01','D','available',0,1,'2026-02-25 17:30:01.062486','2026-02-25 17:30:01.063710',8),(190,'D02','D','occupied',0,0,'2026-02-25 17:30:01.062494','2026-02-25 17:30:01.063727',8),(191,'D03','D','available',0,0,'2026-02-25 17:30:01.062503','2026-02-25 17:30:01.063743',8),(192,'D04','D','available',0,0,'2026-02-25 17:30:01.062511','2026-02-25 17:30:01.063759',8),(193,'D05','D','reserved',0,0,'2026-02-25 17:30:01.062520','2026-02-25 17:30:01.063775',8),(194,'D06','D','available',1,0,'2026-02-25 17:30:01.062529','2026-02-25 17:30:01.063790',8),(195,'D07','D','available',0,0,'2026-02-25 17:30:01.062537','2026-02-25 17:30:01.063805',8),(196,'D08','D','available',0,0,'2026-02-25 17:30:01.062546','2026-02-25 17:30:01.063831',8),(197,'D09','D','available',0,0,'2026-02-25 17:30:01.062555','2026-02-25 17:30:01.063849',8),(198,'D10','D','available',0,0,'2026-02-25 17:30:01.062568','2026-02-25 17:30:01.063875',8),(199,'D11','D','available',0,1,'2026-02-25 17:30:01.062583','2026-02-25 17:30:01.063890',8),(200,'D12','D','available',0,0,'2026-02-25 17:30:01.062596','2026-02-25 17:30:01.063904',8),(201,'D13','D','available',0,0,'2026-02-25 17:30:01.062609','2026-02-25 17:30:01.063919',8),(202,'D14','D','available',0,0,'2026-02-25 17:30:01.062623','2026-02-25 17:30:01.063942',8),(203,'D15','D','available',0,0,'2026-02-25 17:30:01.062642','2026-02-25 17:30:01.063957',8),(204,'D16','D','available',1,0,'2026-02-25 17:30:01.062667','2026-02-25 17:30:01.063981',8),(205,'D17','D','available',0,0,'2026-02-25 17:30:01.062682','2026-02-25 17:30:01.064005',8),(206,'D18','D','available',0,0,'2026-02-25 17:30:01.062697','2026-02-25 17:30:01.064030',8),(207,'D19','D','available',0,0,'2026-02-25 17:30:01.062713','2026-02-25 17:30:01.064052',8),(208,'D20','D','available',0,0,'2026-02-25 17:30:01.062728','2026-02-25 17:30:01.064067',8);
/*!40000 ALTER TABLE `parking_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `mpesa_receipt` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_booking_id_fa2b6c3e_fk_bookings_id` (`booking_id`),
  CONSTRAINT `payments_booking_id_fa2b6c3e_fk_bookings_id` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` longtext,
  `manager_response` longtext,
  `responded_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `parking_lot_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_user_id_parking_lot_id_7bae87ba_uniq` (`user_id`,`parking_lot_id`),
  KEY `reviews_parking_lot_id_9836f584_fk_parking_lots_id` (`parking_lot_id`),
  CONSTRAINT `reviews_parking_lot_id_9836f584_fk_parking_lots_id` FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots` (`id`),
  CONSTRAINT `reviews_user_id_c23b0903_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext NOT NULL,
  `description` longtext,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES ('platform_name','ParkHub','Platform Name','2026-02-25 17:30:01.084531');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `role` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'pbkdf2_sha256$1200000$6wYPnuOa6goZXk1KxMrRW2$PbyRpz2XNOOt95+jriA+u2BJYQZNw34RSjF7K/mtX+o=',NULL,1,'Admin User','','',1,1,'2026-02-25 17:29:54.136937','admin@demo.com','254700000001','admin','active','2026-02-25 17:29:55.404984'),(23,'pbkdf2_sha256$1200000$OZrqcsMXeinGHFhrF7uOzd$mrG6DYE9P21iCRnKTmdaHI5s3TJb+NoLM0b+63/ggH8=',NULL,1,'Sarah Admin','','',1,1,'2026-02-25 17:29:55.411405','sarah.admin@parkhub.com','254700000002','admin','active','2026-02-25 17:29:56.542284'),(24,'pbkdf2_sha256$1200000$xeekZCexZYuV2dNQi5v161$oEWdUlF4S9GCtrhF2QnbxNvmZKA9imt5AUywDCnz5F4=',NULL,0,'Demo Manager','','',0,1,'2026-02-25 17:29:56.548509','manager@demo.com','254711000001','manager','active','2026-02-25 17:29:57.552304'),(25,'pbkdf2_sha256$1200000$7PoRWcgEXM6RkebFvZhWgf$tE17pCm/2LhetBviX3MqRwNGwTlD7I6ex+XLMwhlM5c=',NULL,0,'Jane Manager','','',0,1,'2026-02-25 17:29:57.558567','jane.manager@example.com','254711000002','manager','active','2026-02-25 17:29:58.539672'),(26,'pbkdf2_sha256$1200000$EVEC6t0sQsW5ViVQQkMl69$c7cATl4rTDZABzhf7yKggPJo2sE8oYe/EsnYjU7b15M=',NULL,0,'Demo Driver','','',0,1,'2026-02-25 17:29:58.545491','driver@demo.com','254712345678','driver','active','2026-02-25 17:29:59.757478'),(27,'pbkdf2_sha256$1200000$e5r4VgVXO4tU8EDT1uuAo2$4JZs6Qh752+6ktL1uAUzpeCp+iiSYAyae2yD53QR8dg=',NULL,0,'John Doe','','',0,1,'2026-02-25 17:29:59.766376','john.doe@example.com','254720000001','driver','active','2026-02-25 17:30:01.041092');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_groups`
--

DROP TABLE IF EXISTS `users_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_groups_user_id_group_id_fc7788e8_uniq` (`user_id`,`group_id`),
  KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_groups_user_id_f500bee5_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_groups`
--

LOCK TABLES `users_groups` WRITE;
/*!40000 ALTER TABLE `users_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_permissions`
--

DROP TABLE IF EXISTS `users_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_permissions_user_id_permission_id_3b86cbdf_uniq` (`user_id`,`permission_id`),
  KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_permissions_user_id_92473840_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_permissions`
--

LOCK TABLES `users_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25 22:12:25
