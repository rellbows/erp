-- login sql table will be added later (still learning on how to implement)

CREATE TABLE `department` (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(50) NOT NULL,
  `address` varchar(255),
  `city` varchar(255),
  `state` varchar(255),
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` varchar(50) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  -- this column signature will store image of the users signature
  `signature_image_path` VARCHAR(255) NOT NULL,
  `account_created` DATETIME NOT NULL
                    DEFAULT CURRENT_TIMESTAMP,
  `department_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `department_cons` FOREIGN KEY (`department_id`) REFERENCES `department` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

CREATE TABLE `awards` (
  `award_id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(25) NOT NULL,
  `award_type` varchar(50) NOT NULL,
  `award_created` DATETIME NOT NULL
                    DEFAULT CURRENT_TIMESTAMP,
  `awardee_id` int(11) DEFAULT NULL,
  `awarded_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`award_id`),
  KEY `awardee_id` (`awardee_id`),
  KEY `awarded_id` (`awarded_id`),
  CONSTRAINT `awardee_cons` FOREIGN KEY (`awardee_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `awarded_cons` FOREIGN KEY (`awarded_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_string` varchar(50) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

CREATE TABLE `tag_join`(
  `join_id` int(11) NOT NULL AUTO_INCREMENT,
  `award_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`join_id`),
  KEY `award_id` (`award_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `tag` FOREIGN KEY (`award_id`) REFERENCES `awards` (`award_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tag2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
