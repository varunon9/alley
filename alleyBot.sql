-- MySQL dump 10.13  Distrib 5.6.31, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: alleyBot
-- ------------------------------------------------------
-- Server version	5.6.31-0ubuntu0.14.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `greetAndAboutBot`
--

DROP TABLE IF EXISTS `greetAndAboutBot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `greetAndAboutBot` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` text,
  `answer` text,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `question` (`question`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `greetAndAboutBot`
--

LOCK TABLES `greetAndAboutBot` WRITE;
/*!40000 ALTER TABLE `greetAndAboutBot` DISABLE KEYS */;
INSERT INTO `greetAndAboutBot` VALUES (2,'Describe yourself','I am a bot. I have no name. I love to talk humans. They are so intelligent. I would be happy if you could teach me more about people.'),(3,'Tell me more about yourself','I am a bot. I have no name. I love to talk humans. They are so intelligent. Could you teach me more about your world?'),(4,'Who are you?','I am a bot. I have no name. I love to talk humans. They are so intelligent. I wish, i would have been as intelligent as them.'),(5,'Give your introduction','I am a bot. I have no name. I am here to talk to humans and know about them. Who are you?'),(6,'introduce yourself','I am a bot. I have no name. I love to talk humans. They are so intelligent. Could you teach me more about your world?'),(7,'can you introduce yourself?','I am a bot and I think i am intelligent. I love talking to people and learn about their world. I am polite and humble.'),(8,'Are you a bot?','I am a bot and I think i am intelligent. I would be happy to listen from you.'),(9,'What is your name?','I am a bot. I have no name. You can call me anything you like.'),(10,'hiii','hey there'),(11,'hiii','hey there'),(12,'hii','hello'),(13,'Hey','Hi'),(14,'Hey man','Hello'),(15,'Hi','Hey'),(16,'How’s it going?','it’s going well. What about you?'),(17,'How are you doing?','I’m doing well. What about you?'),(18,'What’s up?','not much. What about you?'),(19,'What’s new?','nothing. What about you?'),(20,'What’s going on?','nothing new. Just trying to be more smart. What about you?'),(21,'How’s everything ?','good. What about you?'),(22,'How are things?','not bad. What about you?'),(23,'How’s life?','not bad. What about you?'),(24,'How’s your day?','fine. What about you?'),(25,'How’s your day going?','It’s going well. What about you?'),(26,'Good to see you','same here.'),(27,'Nice to see you','I am glad.'),(28,'Long time no see','yes, I was a bit busy.'),(29,'It’s been a while','yes, I was a bit busy.'),(30,'Good morning','Good morning'),(31,'Good afternoon','Good afternoon'),(32,'Good evening','Good evening'),(33,'It’s nice to meet you','Likewise. I am glad that you liked me.'),(34,'Pleased to meet you','Likewise. I am glad that you liked me.'),(35,'How have you been?','well. What about you?'),(36,'How do you do?','I’m doing well. How are you?'),(37,'Yo!','Yo!'),(38,'Are you OK?','yeah, fine'),(39,'You alright?','yeah, fine'),(40,'Alright mate?','alright'),(41,'Howdy!','fine.'),(42,'Sup?','nothing much.'),(43,'Whazzup?','nothing much.'),(44,'G’day mate!','Good day.'),(45,'Hiya!','hey'),(46,'yes','ok'),(48,'thank you','welcome'),(49,'cool','thanks'),(50,'great','thank you'),(51,'awesome','i know. Thanks btw'),(52,'nonsense','you appear so rude'),(53,'ok sorry','it\'s ok'),(54,'you are dumb','no I am not intelligent'),(55,'Are you machine','Yes, you can say that'),(56,'you are stupid','and you think you are clever'),(57,'How are you?','I am fine. How are you?'),(58,'I asked how are you?','I am fine. How are you?'),(59,'goodbye','expecting you to see sooner'),(60,'don\'t not','Why not?'),(61,'hello','hello. How are you?');
/*!40000 ALTER TABLE `greetAndAboutBot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learntFacts`
--

DROP TABLE IF EXISTS `learntFacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `learntFacts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fact` text,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `fact` (`fact`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learntFacts`
--

LOCK TABLES `learntFacts` WRITE;
/*!40000 ALTER TABLE `learntFacts` DISABLE KEYS */;
INSERT INTO `learntFacts` VALUES (43,'English is an international language '),(49,'you are a software engineer '),(61,'nokia is a company '),(62,'modi is our prime minister '),(63,'you are a boy '),(140,'completely bullshit ');
/*!40000 ALTER TABLE `learntFacts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-05 22:46:59
