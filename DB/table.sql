CREATE TABLE `users` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`user_email` VARCHAR(100) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`user_password` VARCHAR(1000) NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`user_name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`user_image` VARCHAR(1000) NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`user_provider` VARCHAR(50) NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`user_id`) USING BTREE,
	UNIQUE INDEX `user_email` (`user_email`) USING BTREE
)
COLLATE='utf8mb4_general_ci'

CREATE TABLE `cource` (
	`cource_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '코스 고유 번호',
	`cource_name` VARCHAR(100) NULL DEFAULT '' COMMENT '코스이름',
	`cource_latitude` VARCHAR(1000) NOT NULL DEFAULT '' COMMENT '코스위도',
	`cource_longitude` VARCHAR(1000) NOT NULL DEFAULT '' COMMENT '코스경도',
	`cource_qr` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '코스QR정보',
	PRIMARY KEY (`cource_id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'

CREATE TABLE `users_course` (
	`users_course_id` INT(11) NOT NULL AUTO_INCREMENT,
	`user_id` INT(11) NOT NULL DEFAULT '0',
	`cource_id` INT(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`users_course_id`) USING BTREE,
	INDEX `FK__users` (`user_id`) USING BTREE,
	INDEX `FK__cource` (`cource_id`) USING BTREE,
	CONSTRAINT `FK__cource` FOREIGN KEY (`cource_id`) REFERENCES `cource` (`cource_id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'