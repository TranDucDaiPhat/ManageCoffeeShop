-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.39 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for my_coffeeshop
DROP DATABASE IF EXISTS `my_coffeeshop`;
CREATE DATABASE IF NOT EXISTS `my_coffeeshop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `my_coffeeshop`;

-- Dumping structure for table my_coffeeshop.bill
DROP TABLE IF EXISTS `bill`;
CREATE TABLE IF NOT EXISTS `bill` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `bill_creation_date` date DEFAULT NULL,
  `bill_total` double NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `FKcdveik90g4pvk7m249scu73pg` (`customer_id`),
  KEY `FKle28mnhpamru2e2o22d5u78bu` (`employee_id`),
  CONSTRAINT `FKcdveik90g4pvk7m249scu73pg` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `FKle28mnhpamru2e2o22d5u78bu` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.bill: ~4 rows (approximately)
INSERT INTO `bill` (`bill_id`, `bill_creation_date`, `bill_total`, `payment_method`, `customer_id`, `employee_id`) VALUES
	(1, '2025-04-21', 450000, 'Tiền mặt', 1, 1),
	(2, '2025-04-21', 225000, 'Tiền mặt', 1, 1),
	(3, '2025-04-21', 135000, 'Tiền mặt', NULL, 1),
	(4, '2025-04-22', 529990, 'Tiền mặt', NULL, 1);

-- Dumping structure for table my_coffeeshop.bill_detail
DROP TABLE IF EXISTS `bill_detail`;
CREATE TABLE IF NOT EXISTS `bill_detail` (
  `product_quantity` int NOT NULL,
  `sub_total` double NOT NULL,
  `bill_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`bill_id`,`product_id`),
  KEY `FKe7fmo7042u349ftue4g4oeiuy` (`product_id`),
  CONSTRAINT `FKe7fmo7042u349ftue4g4oeiuy` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKeolgwyayei3o80bb7rj7t207q` FOREIGN KEY (`bill_id`) REFERENCES `bill` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.bill_detail: ~21 rows (approximately)
INSERT INTO `bill_detail` (`product_quantity`, `sub_total`, `bill_id`, `product_id`) VALUES
	(1, 0, 1, 1),
	(1, 0, 1, 2),
	(1, 0, 1, 3),
	(1, 0, 1, 4),
	(2, 0, 1, 5),
	(1, 0, 1, 6),
	(1, 0, 1, 7),
	(1, 0, 1, 8),
	(1, 0, 1, 9),
	(1, 0, 2, 1),
	(1, 0, 2, 2),
	(1, 0, 2, 3),
	(2, 0, 2, 5),
	(1, 45000, 3, 1),
	(1, 45000, 3, 2),
	(1, 45000, 3, 3),
	(1, 333330, 4, 2),
	(1, 45000, 4, 3),
	(2, 66660, 4, 4),
	(1, 40000, 4, 5),
	(1, 45000, 4, 6);

-- Dumping structure for table my_coffeeshop.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.category: ~4 rows (approximately)
INSERT INTO `category` (`category_id`, `category_description`, `category_name`) VALUES
	(1, 'Classic Cocktails', 'Classic Cocktails'),
	(2, 'Cà Phê', 'Cà Phê'),
	(3, 'Trà', 'Trà'),
	(4, 'Bánh Ngọt', 'Bánh Ngọt');

-- Dumping structure for table my_coffeeshop.customer
DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.customer: ~1 rows (approximately)
INSERT INTO `customer` (`customer_id`, `customer_name`, `customer_phone`) VALUES
	(1, 'Tran Phat', '1231231234');

-- Dumping structure for table my_coffeeshop.employee
DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `emp_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_role` enum('ADMIN','CUSTOMER','USER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emp_year_of_birth` int NOT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.employee: ~1 rows (approximately)
INSERT INTO `employee` (`emp_id`, `emp_account`, `emp_name`, `emp_password`, `emp_phone`, `emp_role`, `emp_year_of_birth`) VALUES
	(1, 'admin', 'admin', '$2a$10$3fgEMnkf5n7yFh1OFq.RHuQjMHA52xB92leeaOKSswac4QgccMzCi', '0123456789', 'ADMIN', 2000);

-- Dumping structure for table my_coffeeshop.product
DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_inventory_quantity` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_price` double NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table my_coffeeshop.product: ~51 rows (approximately)
INSERT INTO `product` (`product_id`, `product_description`, `product_img`, `product_inventory_quantity`, `product_name`, `product_price`, `category_id`) VALUES
	(1, 'sfsdf', 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174349/img1_kvxdhd.jpg', 50, 'Mojito231231', 45000, 1),
	(2, 'đáasdsad', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328020/r1rbxhhp6vgcdqglnckr.png', 33, 'Nước Trà Lài 32423423', 333330, 3),
	(3, 'fsdfs', 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img3_e40io0.jpg', 4440, 'Pina Coladabanhngot33 ', 45000, 2),
	(4, 'món ăn ngon mỗi ngày', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745324349/umr6ivxnz0dtkvmb12nf.jpg', 3, 'Nước Trà Lài không', 33330, 2),
	(5, 'Trà ngon lắm, đến thưởng thức liền nào!!', 'https://png.pngtree.com/background/20230412/original/pngtree-coffee-refreshing-drink-background-picture-image_2393812.jpg', 40, 'Nước Trà Lài', 40000, 3),
	(6, 'sản phẩm lõ chè', 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img4_uqwqxd.jpg', 50, 'Espresso2222', 45000, 2),
	(7, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img5_wuyse9.jpg', 0, 'Americano', 45000, 2),
	(8, NULL, NULL, 0, 'Cappuccino', 45000, 2),
	(9, NULL, NULL, 0, 'Latte', 45000, 2),
	(11, NULL, NULL, 0, 'Cold Brew', 45000, 2),
	(12, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174356/img6_fl9cio.jpg', 0, 'Trà đào cam sả', 45000, 3),
	(13, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img7_nirz24.jpg', 0, 'Trà xanh matcha latte', 45000, 3),
	(14, NULL, NULL, 0, 'Trà hoa cúc mật ong', 45000, 3),
	(15, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img8_qkurc8.jpg', 0, 'Tiramisu', 45000, 4),
	(16, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img9_ga8dik.jpg', 0, 'Cheesecake', 45000, 4),
	(18, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174349/img1_kvxdhd.jpg', 0, 'Mojito', 45000, 1),
	(19, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img2_m43puz.jpg', 0, 'Margarita', 45000, 1),
	(20, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img3_e40io0.jpg', 0, 'Pina Colada', 45000, 1),
	(21, NULL, NULL, 0, 'Tequila Sunrise', 45000, 1),
	(22, NULL, NULL, 0, 'Blue Lagoon', 45000, 1),
	(23, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img4_uqwqxd.jpg', 0, 'Espresso', 45000, 2),
	(24, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img5_wuyse9.jpg', 0, 'Americano', 45000, 2),
	(25, NULL, NULL, 0, 'Cappuccino', 45000, 2),
	(26, NULL, NULL, 0, 'Latte', 45000, 2),
	(27, NULL, NULL, 0, 'Cà phê sữa đá', 45000, 2),
	(28, NULL, NULL, 0, 'Cold Brew', 45000, 2),
	(29, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174356/img6_fl9cio.jpg', 0, 'Trà đào cam sả', 45000, 3),
	(30, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img7_nirz24.jpg', 0, 'Trà xanh matcha latte', 45000, 3),
	(31, NULL, NULL, 0, 'Trà hoa cúc mật ong', 45000, 3),
	(32, NULL, 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img8_qkurc8.jpg', 0, 'Tiramisu', 45000, 4),
	(33, 'sdfsd', 'https://res.cloudinary.com/dvpbtas1x/image/upload/v1744174350/img9_ga8dik.jpg', 30, 'Cheesecake55555', 45000, 4),
	(35, 'Trà ngon lắm nha, mau đến thưởng thức liền nào!!', 'https://png.pngtree.com/background/20230412/original/pngtree-coffee-refreshing-drink-background-picture-image_2393812.jpg', 20, 'Trà Sữa Matcha', 35000, 2),
	(36, 'Trà ngon lắm nha, mau đến thưởng thức liền nào!!', 'https://png.pngtree.com/background/20230412/original/pngtree-coffee-refreshing-drink-background-picture-image_2393812.jpg', 20, 'Trà Sữa Matcha33333', 35000, 2),
	(37, NULL, 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 0, 'Nước Trà Lài khôngsfdsd', 0, 3),
	(38, NULL, 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 0, 'Nước Trà Lài khôngsfdsd', 0, 3),
	(39, NULL, 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 0, 'Nước Trà Lài khôngsfdsd', 0, 3),
	(40, 'kl;kl;', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Nước Trà Lài không', 333330, 3),
	(41, 'kl;kl;', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Nước Trà Lài không', 333330, 3),
	(42, 'kl;kl;', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Nước Trà Lài không', 333330, 3),
	(43, 'fsdfs', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Nước Trà Lài không', 333330, 3),
	(44, '123123', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Nước Trà Lài không333', 333330, 2),
	(45, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(46, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(47, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(48, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(49, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(50, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(51, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(52, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(53, 'sdfsdf', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745328894/q8gpbar5aoltldh64hmy.jpg', 33, 'Espresso2222', 333330, 1),
	(55, 'khong co gi la kho chi so tien khong nhieu', 'https://res.cloudinary.com/ddfzgrs87/image/upload/v1745330392/hiyl813ipycrfzi5isic.png', 432, 'mon an ngon moi ngay', 4000, 4);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
