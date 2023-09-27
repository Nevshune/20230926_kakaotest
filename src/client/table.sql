CREATE TABLE `users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`user_email` VARCHAR(100) NOT NULL DEFAULT '',
	`user_password` VARCHAR(1000) NULL DEFAULT '',
	`user_name` VARCHAR(50) NULL DEFAULT '',
	`user_image` VARCHAR(1000) NULL DEFAULT '',
	`user_provider` VARCHAR(50) NULL DEFAULT '',
	PRIMARY KEY (`user_id`),
	UNIQUE INDEX `user_email` (`user_email`)
)
COLLATE='utf8mb4_general_ci';

CREATE TABLE `course` (
	`course_id` INT NOT NULL AUTO_INCREMENT COMMENT '코스 고유 넘버',
	`course_qr` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '코스 QR정보',
	`course_name` VARCHAR(100) NULL DEFAULT '' COMMENT '코스 이름',
	`course_latitude` VARCHAR(1000) NOT NULL DEFAULT '' COMMENT '코스 위도',
	`course_longitude` VARCHAR(1000) NOT NULL DEFAULT '' COMMENT '코스 경도',
	PRIMARY KEY (`course_id`)
)
COLLATE='utf8mb4_general_ci';

CREATE TABLE `users_course` (
	`users_course_id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL DEFAULT '0',
	`course_id` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`users_course_id`),
	CONSTRAINT `FK__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK__course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci';
