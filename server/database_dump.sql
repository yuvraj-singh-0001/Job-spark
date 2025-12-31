-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: jobspark
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'Aminer ','admin1@gmail.com','8948344277','$2a$12$T2gAeCOrNTTSwjlJ/4E34.7LvAhthDVKCI9odoFkbFk9M/iTtKck.'),(3,'Deepak Raj Singh','codekampfer@gmail.com','9810759305','$2a$12$ffyWnVC7tsTado.J7fADdunPaVTEBIpxEgz2gOsdfZcLKxtskMIHi'),(4,'DK','abc@gmail.com','8178523018','$2a$12$3ULP78S676phfr4fuFgoCuIWrZGL8dUMRUE6Ko5QZshu/q2NCUvP.');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_profiles`
--

DROP TABLE IF EXISTS `candidate_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_profiles` (
  `user_id` int unsigned NOT NULL,
  `full_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'India',
  `highest_qualification` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trade_stream` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key_skills` json DEFAULT NULL,
  `job_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_salary` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_proof_available` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_contact_method` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `willing_to_relocate` tinyint(1) DEFAULT '0',
  `experience_years` int DEFAULT NULL,
  `resume_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_profiles`
--

LOCK TABLES `candidate_profiles` WRITE;
/*!40000 ALTER TABLE `candidate_profiles` DISABLE KEYS */;
INSERT INTO `candidate_profiles` VALUES (6,'Saksham Rajput','9810759305','2007-12-03','Male','Noida','Uttar Pradesh','India','Graduate','Computer / IT',NULL,'Full-Time','Immediately','₹12,000–18,000',NULL,NULL,NULL,0,NULL,'https://www.linkedin.com/in/kunalrastogi13','https://github.com/codekampfer/codekampfer_edu','2025-12-21 10:27:45','2025-12-22 07:08:38'),(8,'Anaya','8601300910','2007-12-07','Female','Panchkula','Haryana','India','Diploma','IT Support',NULL,'Full-Time','Immediately','₹25,000+',NULL,NULL,NULL,0,NULL,'https://www.linkedin.com/company/codekampfer/','https://github.com/codekampfer/codekampfer_edu','2025-12-22 07:56:40','2025-12-22 07:56:40'),(10,'Aftab Ansari','9696110243','2007-12-24','Male','Sultanpur','Uttar Pradesh','India','Graduate','Computer / IT',NULL,'Full-Time','Immediately','â‚¹18,000â€“25,000',NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-12-24 06:20:19','2025-12-24 06:20:19');
/*!40000 ALTER TABLE `candidate_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_alerts`
--

DROP TABLE IF EXISTS `job_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_alerts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_experience` decimal(4,1) DEFAULT NULL,
  `max_experience` decimal(4,1) DEFAULT NULL,
  `frequency` enum('daily','weekly','monthly') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'daily',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_alerts_user` (`user_id`),
  CONSTRAINT `fk_job_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_alerts`
--

LOCK TABLES `job_alerts` WRITE;
/*!40000 ALTER TABLE `job_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `status` enum('applied','shortlisted','interview_called','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'applied',
  `cover_letter` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `resume_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_job_user` (`job_id`,`user_id`),
  KEY `idx_ja_job` (`job_id`),
  KEY `idx_ja_user` (`user_id`),
  KEY `idx_ja_status` (`status`),
  CONSTRAINT `fk_ja_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ja_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (7,5,6,'shortlisted',NULL,NULL,'2025-12-22 05:46:55','2025-12-22 06:29:49'),(8,5,8,'shortlisted','I am good fit for this job. I have experienced of it',NULL,'2025-12-22 07:57:47','2025-12-22 12:37:02'),(9,7,6,'shortlisted',NULL,NULL,'2025-12-24 06:12:43','2025-12-24 06:13:38'),(10,7,10,'shortlisted',NULL,NULL,'2025-12-24 06:21:46','2025-12-24 06:22:57');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_roles`
--

DROP TABLE IF EXISTS `job_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_roles`
--

LOCK TABLES `job_roles` WRITE;
/*!40000 ALTER TABLE `job_roles` DISABLE KEYS */;
INSERT INTO `job_roles` VALUES (17,'Back Office Executive'),(31,'Backend Developer'),(28,'Business Development Executive'),(19,'Computer Operator'),(26,'Customer Support Executive'),(40,'Data Analyst Intern'),(16,'Data Entry Operator'),(1,'Delivery Boy'),(2,'Driver'),(10,'Electrician'),(22,'Field Executive'),(13,'Field Technician'),(30,'Frontend Developer'),(32,'Full Stack Developer'),(15,'Helper'),(4,'Housekeeping Staff'),(42,'HR Intern'),(36,'IT Support Engineer'),(9,'Loader'),(14,'Machine Operator'),(29,'Marketing Executive'),(41,'Marketing Intern'),(20,'MIS Executive'),(37,'Network Technician'),(18,'Office Assistant'),(5,'Office Boy'),(21,'Operations Executive'),(8,'Packing Executive'),(11,'Plumber'),(35,'QA Tester'),(27,'Relationship Executive'),(24,'Sales Executive'),(3,'Security Guard'),(23,'Site Supervisor'),(34,'Software Developer'),(38,'Software Intern'),(7,'Store Helper'),(12,'Technician'),(25,'Telecaller'),(6,'Warehouse Helper'),(33,'Web Developer'),(39,'Web Development Intern');
/*!40000 ALTER TABLE `job_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_tag_map`
--

DROP TABLE IF EXISTS `job_tag_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_tag_map` (
  `job_id` int unsigned NOT NULL,
  `tag_id` int unsigned NOT NULL,
  PRIMARY KEY (`job_id`,`tag_id`),
  KEY `fk_jtm_tag` (`tag_id`),
  CONSTRAINT `fk_jtm_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jtm_tag` FOREIGN KEY (`tag_id`) REFERENCES `job_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_tag_map`
--

LOCK TABLES `job_tag_map` WRITE;
/*!40000 ALTER TABLE `job_tag_map` DISABLE KEYS */;
INSERT INTO `job_tag_map` VALUES (5,61),(7,61),(5,66),(5,67),(5,68),(5,69),(6,70),(6,71),(6,72),(6,73),(6,74),(7,76),(7,77),(7,79);
/*!40000 ALTER TABLE `job_tag_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_tags`
--

DROP TABLE IF EXISTS `job_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_tags` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_job_tags_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_tags`
--

LOCK TABLES `job_tags` WRITE;
/*!40000 ALTER TABLE `job_tags` DISABLE KEYS */;
INSERT INTO `job_tags` VALUES (14,'10th Pass'),(15,'12th Pass'),(54,'AC Technician'),(63,'Accuracy'),(11,'Apprentice'),(25,'Back Office Executive'),(36,'Backend Developer'),(55,'CNC Operator'),(67,'Communication'),(64,'Computer Basics'),(8,'Contract'),(42,'CSS'),(23,'Customer Support'),(40,'Data Analyst'),(59,'Data Entry'),(24,'Data Entry Operator'),(68,'Data Management'),(20,'Delivery Boy'),(17,'Diploma Holder'),(56,'Docker'),(32,'Driver'),(50,'Electrician'),(49,'Excel'),(10,'Experienced'),(13,'Female Only'),(3,'Field Job'),(69,'Filing'),(51,'Fitter'),(9,'Fresher'),(35,'Frontend Developer'),(37,'Full Stack Developer'),(5,'Full Time'),(18,'Graduate'),(31,'Housekeeping Staff'),(41,'HTML'),(4,'Hybrid'),(7,'Internship'),(39,'IT Support'),(16,'ITI Pass'),(47,'Java'),(43,'JavaScript'),(12,'Jobs for Women'),(79,'Local Language'),(58,'Microsoft Excel'),(61,'MS Office'),(76,'Negotiation'),(45,'Node.js'),(26,'Office Boy'),(2,'Office Job'),(66,'Organization'),(29,'Packing Executive'),(6,'Part Time'),(53,'Plumber'),(46,'Python'),(38,'QA Tester'),(44,'React'),(74,'Record Keeping'),(21,'Sales Executive'),(30,'Security Guard'),(33,'Software Intern'),(48,'SQL'),(27,'Store Helper'),(19,'Student'),(57,'Tally'),(70,'Technical Skills'),(22,'Telecaller'),(72,'Tool Usage'),(71,'Troubleshooting'),(60,'Typing'),(28,'Warehouse Executive'),(34,'Web Developer'),(52,'Welder'),(1,'Work from Home');
/*!40000 ALTER TABLE `job_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_views`
--

DROP TABLE IF EXISTS `job_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_views` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jv_job` (`job_id`),
  CONSTRAINT `fk_job_views_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_views`
--

LOCK TABLES `job_views` WRITE;
/*!40000 ALTER TABLE `job_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `company` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_mode` enum('Office','Remote','Hybrid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Office',
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `locality` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skills` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `min_experience` tinyint unsigned NOT NULL DEFAULT '0',
  `max_experience` tinyint unsigned NOT NULL DEFAULT '0',
  `min_salary` int unsigned DEFAULT NULL,
  `max_salary` int unsigned DEFAULT NULL,
  `vacancies` int DEFAULT '1',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `interview_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `contact_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recruiter_id` int unsigned DEFAULT NULL,
  `status` enum('draft','pending','approved','rejected','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `posted_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jobs_city` (`city`),
  KEY `idx_jobs_company` (`company`),
  KEY `idx_jobs_type` (`job_type`),
  KEY `idx_jobs_recruiter` (`recruiter_id`),
  KEY `fk_jobs_reviewed_by` (`reviewed_by`),
  KEY `fk_jobs_role` (`role_id`),
  KEY `idx_jobs_state` (`state`),
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_jobs_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `admins` (`admin_id`),
  CONSTRAINT `fk_jobs_role` FOREIGN KEY (`role_id`) REFERENCES `job_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (5,17,'Codekampfer consultancy','Full-time','Office','Noida',NULL,'India',NULL,NULL,0,2,12000,22000,3,'We are hiring Back Office Executives for administrative support.\r\n\r\nResponsibilities:\r\n• Handle administrative and clerical tasks\r\n• Maintain office records and documentation\r\n• Coordinate with different departments\r\n• Assist in data management and filing\r\n• Support day-to-day office operations\r\n\r\nRequirements:\r\n• Good organizational skills\r\n• Proficiency in MS Office\r\n• Attention to detail\r\n• Good communication skills\r\n• Freshers with computer skills welcome\r\n\r\nWork Details:\r\n• Full-time position\r\n• Office-based work\r\n• Standard working hours','Sector - 72, Noida, Noida, Uttar Pradesh, 201301','contact@codekampfer.com',NULL,NULL,7,'approved',NULL,NULL,NULL,'2025-12-21 12:24:15','2025-12-21 12:24:15','2025-12-21 12:24:54'),(6,12,'Apple','Full-time','Office','New Delhi',NULL,'India',NULL,NULL,0,2,15000,25000,3,'We are hiring Technicians for maintenance and repair work.\r\n\r\nResponsibilities:\r\n• Perform maintenance and repairs\r\n• Diagnose technical problems\r\n• Install and service equipment\r\n• Maintain service records\r\n• Ensure customer satisfaction\r\n\r\nRequirements:\r\n• ITI/Diploma in relevant trade\r\n• Technical knowledge\r\n• Problem-solving skills\r\n• Good with tools\r\n• Freshers with technical background welcome\r\n\r\nWork Details:\r\n• Full-time position\r\n• Field/Workshop-based work\r\n• Tool kit provided\r\n• Training available','B-30, First Floor, Block B, Sector 72, New Delhi, Delhi, 201307','krkunal133@gmail.com','9090909088',NULL,9,'approved',NULL,NULL,NULL,'2025-12-23 12:54:16','2025-12-23 12:54:16','2025-12-23 14:02:53'),(7,24,'Codekampfer consultancy','Full-time','Office','Gautam Buddha Nagar',NULL,'India','Noida',NULL,0,2,12000,25000,5,'We are hiring Sales Executives to grow our business.\r\n\r\nResponsibilities:\r\n• Meet potential customers and explain products/services\r\n• Achieve monthly and quarterly sales targets\r\n• Build and maintain customer relationships\r\n• Follow up with leads and close deals\r\n• Prepare daily sales reports\r\n\r\nRequirements:\r\n• Good communication skills in Hindi and English\r\n• Convincing and negotiation abilities\r\n• Basic computer knowledge\r\n• Willingness to travel locally\r\n• Freshers with positive attitude welcome\r\n\r\nWork Details:\r\n• Full-time field sales role\r\n• Fixed salary + incentives\r\n• Mobile and travel allowance provided','Sector - 72, Noida, Gautam Buddha Nagar, Uttar Pradesh, 201301','contact@codekampfer.com','9999988888',NULL,7,'approved',NULL,NULL,NULL,'2025-12-24 06:11:20','2025-12-24 06:11:20','2025-12-24 06:11:58');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiter_profiles`
--

DROP TABLE IF EXISTS `recruiter_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiter_profiles` (
  `user_id` int unsigned NOT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_type` enum('company','consultancy','startup') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'company',
  `hr_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hr_mobile` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hr_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'India',
  `pincode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `verified_by` int DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verification_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `fk_recruiter_verified_by` (`verified_by`),
  CONSTRAINT `fk_recruiter_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recruiter_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiter_profiles`
--

LOCK TABLES `recruiter_profiles` WRITE;
/*!40000 ALTER TABLE `recruiter_profiles` DISABLE KEYS */;
INSERT INTO `recruiter_profiles` VALUES (7,'Codekampfer Consultancy','https://codekampfer.com','consultancy','Aftab','9999988888',NULL,'Sector - 72, Noida',NULL,'Gautam Buddha Nagar','Uttar Pradesh','India','201301','approved',NULL,NULL,NULL,'2025-12-21 12:23:07','2025-12-23 12:42:31'),(9,'Apple','https://www.apple.com','consultancy','Kunal ','9090909088',NULL,'B-30, First Floor','Block B, Sector 72','Gautam Buddha Nagar','Uttar Pradesh','India','201307','approved',NULL,NULL,NULL,'2025-12-23 12:47:08','2025-12-23 16:00:18');
/*!40000 ALTER TABLE `recruiter_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_jobs`
--

DROP TABLE IF EXISTS `saved_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_jobs` (
  `user_id` int unsigned NOT NULL,
  `job_id` int unsigned NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`job_id`),
  KEY `fk_saved_jobs_job` (`job_id`),
  CONSTRAINT `fk_saved_jobs_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_jobs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_jobs`
--

LOCK TABLES `saved_jobs` WRITE;
/*!40000 ALTER TABLE `saved_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('candidate','recruiter','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'candidate',
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'codekampfer@gmail.com','115604318084813407817','google','$2a$10$oGSw2GVn9k/4QsGHgeFtSO96Oyd20H2JiMsR5VWUUg33n3FUY/34C','candidate','codekampfer','2025-12-21 04:47:36','2025-12-21 12:12:14','2025-12-21 12:12:14'),(7,'contact@codekampfer.com','104639257722301463330','google','$2a$10$GcYvkKPvALSFtlfhzm0Dz.Gwkh7OUNKzuHK12kHBPMtHk4BfmW2vm','recruiter','Deepak Singh','2025-12-21 12:22:34','2025-12-24 06:09:26','2025-12-24 06:09:26'),(8,'anaya280205@gmail.com','117420577174993240695','google','$2a$10$3DhGIMPDqTYphoqLs3P2EenJZJ9Wa.VkozyoWNWlhd0ugu7g8GD5m','candidate','Anaya','2025-12-22 07:52:12','2025-12-22 07:52:12','2025-12-22 07:52:12'),(9,'krkunal133@gmail.com','104341606147245596069','google','$2a$10$CPSyez9WHHKUKvezZmUBculAEiT5iDJASgWxO3pI4Wfa9LwfFXp.6','recruiter','Kunal Rastogi','2025-12-23 06:20:35','2025-12-23 06:20:35','2025-12-23 06:20:35'),(10,'aftabansari92751@gmail.com','111978921128022901726','google','$2a$10$w/DWMWhFOw2LD72oRWLlSOg6ZzvjcTdnJpuiKlApOsd3ruAbvlhpi','candidate','Aftab Ansari','2025-12-24 06:18:43','2025-12-24 06:18:43','2025-12-24 06:18:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-25  8:23:38
