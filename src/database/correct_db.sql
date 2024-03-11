CREATE SCHEMA IF NOT EXISTS `dreamdb` DEFAULT CHARACTER SET utf8; 
USE `dreamdb`;

CREATE TABLE IF NOT EXISTS `dreamdb`.`account` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` INT NULL COMMENT '0: Inactivo, 1: Activo',
  `role` INT NOT NULL,
  `email` VARCHAR(64) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `location` VARCHAR(255) NULL,
  `phone` VARCHAR(45) NULL,
  `photo` TEXT NULL,
  `subcribe_at` TEXT,
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`ownership`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`ownership` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Propiedades',
  `name` VARCHAR(128) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `photo` TEXT NULL,
  `owner_id` INT NOT NULL,
  `property_id` INT COMMENT 'Id from Smoobu',
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES account(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`movement`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`movement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `concept` VARCHAR(128) NOT NULL,
  `category` INT NOT NULL,
  `description` VARCHAR(255) NULL,
  `photo` TEXT NULL,
  `author` INT NOT NULL,
  `type` INT NOT NULL,
  `amount` FLOAT NULL, 
  `current_money` FLOAT NULL,
  `ownership_id` INT NOT NULL,
  `opt_reservation_id` INT NULL,
  `create_at` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ownership_id`) REFERENCES ownership(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`advertising`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`advertising` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `photo` TEXT NOT NULL,
  `mount` BOOLEAN NOT NULL,
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`interest_advertising`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`interest_advertising` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contact_by` INT NULL COMMENT 'Id del partner',
  `account_id` INT NOT NULL COMMENT 'Id del el cliente que pidió el contacto (INTERES)',
  `advertising_id` INT NOT NULL COMMENT 'La publicidad asociada ',
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`advertising_id`) REFERENCES advertising(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`pickup`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`pickup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `account_id` INT NOT NULL,
  `arrival_at` TEXT NOT NULL,
  `status` INT NOT NULL COMMENT '-1, rechazado\n0, sin aceptar\n1, aceptado',
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_id`) REFERENCES account(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`category`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(128) NOT NULL,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`stay`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`stay` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ownership_id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `arrival_at` TEXT NOT NULL,
  `departure_at` TEXT NOT NULL,
  `status` INT DEFAULT 0,
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY (`account_id`) REFERENCES account(`id`)
);

DROP TABLE IF EXISTS `dreamdb`.`wallet`;
CREATE TABLE IF NOT EXISTS `dreamdb`.`wallet` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ownership_id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `amount` FLOAT,
  `update_at` TEXT,
  PRIMARY KEY(`id`),
  FOREIGN KEY (`ownership_id`) REFERENCES ownership(`id`)
);


