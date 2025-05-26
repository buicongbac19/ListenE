-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: spb
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `court`
--

DROP TABLE IF EXISTS `court`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `court` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `owner_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9rilnc3fghtyps0p38e5dppxi` (`owner_id`),
  CONSTRAINT `FK9rilnc3fghtyps0p38e5dppxi` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `court`
--

LOCK TABLES `court` WRITE;
/*!40000 ALTER TABLE `court` DISABLE KEYS */;
INSERT INTO `court` VALUES (5,'Quận 8','Sân Cao Lỗ',5),(6,'26 Xa La Hà Đông Hà Nội','Sân cầu lông Hiếu Nguyễn',2),(7,'Hoàn Kiếm Hà Nội','Sân cầu lông Hồng Nghị',4),(8,'Gò Vấp','Sân Châu Dương Gò Vấp',4),(9,'Ba Đình Hà Nội','Sân Đan Nguyên 88',2),(10,'Giao Thuỷ , Hai Bà Trưng','Sân ĐH Kinh Tế Luật',2),(11,'20 Trần Phú Hà Đông','Sân Đức Chiến',2),(12,'98 Mỗ Lao','Sân Ngọc Bích',2),(13,'Tân Phú Bình Dương','Sân Nhà thi đấu đa năng Bình Dương',4),(14,'Hải Hậu, Hải Dương','Sân nhà thi đấu tỉnh Hải Dương',2),(15,'Hai Bà Trưng, Hà Nội','Sân Panda Badminton',3),(16,'Yên Nghĩa, Hà Đông','Sân Phúc Quân',3),(17,'Số 10 Trần Phú, Hà Đông, Hà Nội','Sân Quốc Việt',2),(18,'Tao Đàn, Hoàng Quốc Việt','Sân Tao Đàn',3),(19,'Số 10 Đại Cồ Việt','Sân Tô Ngọc Vân',4),(20,'Mễ Trì, Hà Nội','Sân Thanh Việt',3),(21,'Nam Từ Liêm, Hà Nội','Sân Thiên Sơn',2),(22,'26 Lai Xá, Bắc Từ Liêm','Sân V Badminton',2),(23,'67 Phùng Khoang','Sân Victory Arena',4),(26,'68 Kim Giang, Hoàng Mai, Thanh Trì, Hà Đông, Hà Nội','Sân Xã Lộ 25',2),(30,'26 Xa La, Phường Phúc La, Hà Đông, Hà Nội','Sân Cầu Lông Xa La',5);
/*!40000 ALTER TABLE `court` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `court_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8y2tne4nmjkgky07f7he1jik4` (`court_id`),
  CONSTRAINT `FK8y2tne4nmjkgky07f7he1jik4` FOREIGN KEY (`court_id`) REFERENCES `court` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (57,'san-cau-long-hieu-nguyen-1_thumb_720.webp',6),(58,'san-cau-long-hieu-nguyen-2_thumb_720.webp',6),(59,'san-cau-long-hieu-nguyen-4_thumb_720.webp',6),(60,'san-cau-long-hieu-nguyen-5_thumb_720.webp',6),(61,'san-cau-long-hieu-nguyen-6_thumb_720.webp',6),(62,'hong-nghi-2_thumb_720.webp',7),(63,'hong-nghi-3_thumb_720.webp',7),(64,'hong-nghi-4_thumb_720.webp',7),(65,'san-cau-long-hong-nghi-1_thumb_720.webp',7),(66,'san-cau-long-hong-nghi-2_thumb_720.webp',7),(67,'san-cau-long-chau-duong-1_thumb_720.webp',8),(68,'san-cau-long-chau-duong-2_thumb_720.webp',8),(69,'san-cau-long-chau-duong-3_thumb_720.webp',8),(70,'san-cau-long-chau-duong-4_thumb_720.webp',8),(71,'san-cau-long-chau-duong-5_thumb_720.webp',8),(72,'san-cau-long-Dan-nguyen-88-1_thumb_720.webp',9),(73,'san-cau-long-Dan-nguyen-88-4_thumb_720.webp',9),(74,'san-cau-long-Dan-nguyen-88-222_thumb_720.webp',9),(75,'san-cau-long-Dan-nguyen-88-333_thumb_720.webp',9),(76,'san-cau-long-Dh-kinh-te-luat-1_thumb_720.webp',10),(77,'san-cau-long-Dh-kinh-te-luat-2_thumb_720.webp',10),(78,'san-cau-long-Dh-kinh-te-luat-3_thumb_720.webp',10),(79,'san-cau-long-Dh-kinh-te-luat-4_thumb_720.webp',10),(80,'san-cau-long-Duc-chien-1_thumb_720.webp',11),(81,'san-cau-long-Duc-chien-2_thumb_720.webp',11),(82,'san-cau-long-Duc-chien-3_thumb_720.webp',11),(83,'san-cau-long-Duc-chien-4_thumb_720.webp',11),(84,'ngoc-bich-1_1_thumb_720.webp',12),(85,'ngoc-bich-2_thumb_720.webp',12),(86,'ngoc-bich-4_thumb_720.webp',12),(87,'san-cau-long-ngoc-bich-1_thumb_720.webp',12),(88,'san-cau-long-ngoc-bich-2_thumb_720.webp',12),(89,'san-cau-long-nha-thi-dau-da-nang-binh-duong_1_thumb_720.webp',13),(90,'san-cau-long-nha-thi-dau-da-nang-binh-duong-2_1_thumb_720.webp',13),(91,'san-cau-long-nha-thi-dau-da-nang-binh-duong-2_thumb_720.webp',13),(92,'san-cau-long-nha-thi-dau-da-nang-binh-duong-3_1_thumb_720.webp',13),(93,'san-cau-long-nha-thi-dau-da-nang-binh-duong-4_1_thumb_720.webp',13),(94,'san-cau-long-nha-thi-dau-tinh-hai-duong_thumb_720.webp',14),(95,'san-cau-long-nha-thi-dau-tinh-hai-duong-1_thumb_720.webp',14),(96,'san-cau-long-nha-thi-dau-tinh-hai-duong-3_thumb_720.webp',14),(97,'san-cau-long-nha-thi-dau-tinh-hai-duong-4_thumb_720.webp',14),(98,'san-cau-long-nha-thi-dau-tinh-hai-duong-5_thumb_720.webp',14),(99,'san-pan-da_thumb_720.webp',15),(100,'san-pan-da-2_thumb_720.webp',15),(101,'san-pan-da-3_thumb_720.webp',15),(102,'san-pan-da-4_thumb_720.webp',15),(103,'sAn-clb-cAu-lOng-phUc-quAn-1_thumb_720.webp',16),(104,'sAn-clb-cAu-lOng-phUc-quAn-2_thumb_720.webp',16),(105,'sAn-clb-cAu-lOng-phUc-quAn-3_thumb_720.webp',16),(106,'sAn-clb-cAu-lOng-phUc-quAn-4_thumb_720.webp',16),(107,'quoc-viet-1_1_thumb_720.webp',17),(108,'quoc-viet-2_1_thumb_720.webp',17),(109,'quoc-viet-3_thumb_720.webp',17),(110,'san-cau-long-quOc-viEt-2_thumb_720.webp',17),(111,'san-cau-long-tao-Dan-1_thumb_720.webp',18),(112,'san-cau-long-tao-Dan-2_thumb_720.webp',18),(113,'san-cau-long-tao-Dan-3_thumb_720.webp',18),(114,'san-cau-long-tao-Dan-4_thumb_720.webp',18),(115,'san-cau-long-tao-Dan-5_thumb_720.webp',18),(116,'san-cau-long-to-ngoc-van-1_thumb_720.webp',19),(117,'san-cau-long-to-ngoc-van-2_thumb_720.webp',19),(118,'san-cau-long-to-ngoc-van-3_thumb_720.webp',19),(119,'san-cau-long-to-ngoc-van-4_thumb_720.webp',19),(120,'san-cau-long-to-ngoc-van-5_thumb_720.webp',19),(121,'cau-lac-bo-cau-long-thanh-viet-1_thumb_720.webp',20),(122,'cau-lac-bo-cau-long-thanh-viet-2_thumb_720.webp',20),(123,'cau-lac-bo-cau-long-thanh-viet-4_thumb_720.webp',20),(124,'cau-lac-bo-cau-long-thanh-viet-5_thumb_720.webp',20),(125,'san-cau-long-thien-son_thumb_720.webp',21),(126,'thien-son-1_thumb_720.webp',21),(127,'thien-son-2_thumb_720.webp',21),(128,'thien-son-3_thumb_720.webp',21),(129,'san-cau-long-v-badminton-1_thumb_720.webp',22),(130,'san-cau-long-v-badminton-2_thumb_720.webp',22),(131,'san-cau-long-v-badminton-3_thumb_720.webp',22),(132,'san-cau-long-v-badminton-4_thumb_720.webp',22),(133,'san-cau-long-victory-arena-1_thumb_720.webp',23),(134,'san-cau-long-victory-arena-2_1_thumb_720.webp',23),(135,'san-cau-long-victory-arena-2_thumb_720.webp',23),(136,'san-cau-long-victory-arena-3_thumb_720.webp',23),(137,'san-cau-long-xa-lo-25_1_thumb_720.webp',26),(138,'san-cau-long-xa-lo-25-2_1_thumb_720.webp',26),(139,'san-cau-long-xa-lo-25-3_1_thumb_720.webp',26),(140,'san-cau-long-xa-lo-25-4_1_thumb_720.webp',26),(146,'san-cao-lo-2_thumb_720.jpg',5),(147,'san-cao-lo-4_thumb_720.jpg',5),(148,'san-cao-lo-5_thumb_720.jpg',5),(160,'kich-thuoc-san-cau-long-4.jpg',30),(161,'kichthuocsancaulong.jpg',30);
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_rented` bit(1) NOT NULL,
  `price` double NOT NULL,
  `time` varchar(255) DEFAULT NULL,
  `court_id` bigint NOT NULL,
  `renter_id` bigint DEFAULT NULL,
  `isRented` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKouxv2f8odhsshr1vmf8d9mmku` (`court_id`),
  KEY `FKi4dvwjecrxp5yobwhcv0goe8h` (`renter_id`),
  CONSTRAINT `FKi4dvwjecrxp5yobwhcv0goe8h` FOREIGN KEY (`renter_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKouxv2f8odhsshr1vmf8d9mmku` FOREIGN KEY (`court_id`) REFERENCES `court` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (30,_binary '',250,'afternoon',6,5,_binary '\0'),(31,_binary '',200,'morning',7,11,_binary '\0'),(32,_binary '',190,'afternoon',8,5,_binary '\0'),(33,_binary '',210,'morning',9,13,_binary '\0'),(34,_binary '',230,'afternoon',10,14,_binary '\0'),(35,_binary '',160,'morning',11,5,_binary '\0'),(36,_binary '',180,'afternoon',12,16,_binary '\0'),(37,_binary '',140,'morning',13,18,_binary '\0'),(38,_binary '',200,'afternoon',14,5,_binary '\0'),(40,_binary '',210,'afternoon',16,3,_binary '\0'),(41,_binary '\0',170,'morning',17,NULL,_binary '\0'),(42,_binary '',260,'afternoon',18,5,_binary '\0'),(43,_binary '\0',220,'morning',19,NULL,_binary '\0'),(44,_binary '',240,'afternoon',20,7,_binary '\0'),(45,_binary '',180,'morning',21,2,_binary '\0'),(46,_binary '',200,'afternoon',22,5,_binary '\0'),(47,_binary '',150,'morning',23,4,_binary '\0'),(48,_binary '',250,'afternoon',26,8,_binary '\0'),(57,_binary '',222,'morning',5,5,_binary '\0'),(58,_binary '\0',444,'afternoon',5,NULL,_binary '\0'),(59,_binary '\0',444,'afternoon',30,NULL,_binary '\0'),(60,_binary '\0',440,'afternoon',5,NULL,_binary '\0');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `createdAt` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'2024-11-11 10:00:00','buicongbac192004@gmail.com','buicongbac','0816119402','admin','buicongbac',NULL,NULL),(2,'2024-11-11 10:05:00','phamthanhlong725@gmail.com','phamothanhlong','0344033697','owner','Phạm Thành Long',NULL,NULL),(3,'2024-11-11 10:10:00','user3@example.com','trancanhhung','0337720537','owner','Trần Cảnh Hưng',NULL,NULL),(4,'2024-11-11 10:15:00','hkim2k4@gmail.com','kimduyhung','0332097480','owner','Kim Duy Hưng',NULL,NULL),(5,'2024-11-11 10:20:00','buicongbac182004@gmail.com','buicongbac123','0376212942','user','buicongbac18',NULL,NULL),(6,'2024-11-11 10:25:00','buicongbac202004@gmail.com','password6','0873923574','owner','Nguyễn Văn An',NULL,NULL),(7,'2024-11-11 10:30:00','buicongbac212004@gmail.com','password7','0923476228','owner','Trần Thị Nga',NULL,NULL),(8,'2024-11-11 10:35:00','buicongbac222004@gmail.com','password8','0844329983','owner','Bùi Văn Tấn',NULL,NULL),(9,'2024-11-11 10:40:00','buicongbac232004@gmail.com','password9','0982343110','owner','Bùi Đức Dương',NULL,NULL),(10,'2024-11-11 10:45:00','user10@example.com','password10','1234567899','user','user10',NULL,NULL),(11,'2024-11-11 10:50:00','user11@example.com','password11','1234567800','user','user11',NULL,NULL),(12,'2024-11-11 10:55:00','user12@example.com','password12','1234567801','user','user12',NULL,NULL),(13,'2024-11-11 11:00:00','user13@example.com','password13','1234567802','user','user13',NULL,NULL),(14,'2024-11-11 11:05:00','user14@example.com','password14','1234567803','user','user14',NULL,NULL),(15,'2024-11-11 11:10:00','user15@example.com','password15','1234567804','user','user15',NULL,NULL),(16,'2024-11-11 11:15:00','user16@example.com','password16','1234567805','user','user16',NULL,NULL),(17,'2024-11-11 11:20:00','user17@example.com','password17','1234567806','user','user17',NULL,NULL),(18,'2024-11-11 11:25:00','user18@example.com','password18','1234567807','user','user18',NULL,NULL),(19,'2024-11-11 11:30:00','user19@example.com','password19','1234567808','user','user19',NULL,NULL),(53,'2025-04-08T10:50:07.043102100','buicongbac242004@gmail.com','123456','0877865221','user','buicongbac25',NULL,NULL),(54,'2025-05-17T11:01:18.902764200','bacbu212004@gmail.com','bacbu212004','09473632464','user','bacbu212004',NULL,NULL),(55,NULL,'admin@gmail.com','admin','0901234567','admin','admin',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pin` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
INSERT INTO `verification` VALUES (1,'phamthanhlong303@gmail.com','286069'),(2,'phamthanhlong725@gmail.com','373963'),(3,'p303@gmail.com','703981'),(4,'pthanhlong303@gmail.com','554434'),(5,'darkdearwing@gmail.com','343700'),(6,'buicongbac182004@gmail.com','873082'),(7,'bac@gmail.com','617720'),(8,'buicongbac192004@gmail.com','530055'),(9,'buicongbac232004@gmail.com','125511');
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-24 10:15:50
