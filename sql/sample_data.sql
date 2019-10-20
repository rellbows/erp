INSERT INTO `department` VALUES (1,'Computer Science', 'Kelley Engineering Center', 'Corvallis', 'OR'),
(2,'Information Service', 'Milne Computer Center', 'Corvallis', 'OR'), (3,'English', 'Bexell', 'Corvallis', 'OR'),
(4,'Physics', 'Weniger Hall', 'Corvallis', 'OR');

INSERT INTO `user` (`user_id`, `user_type`, `email`, `password`, `first_name`, `last_name`, `signature_image_path`, `department_id`) 
VALUES (1, 'USER', '1@gmail.com', '1234', 'Auston', 'Matthews', 'NULL', 4), (2, 'USER', '2@gmail.com', 'QWERTY','William', 'Nylander', 'NULL', 3), (3, 'USER', '3@gmail.com', 'pass', 'Elias', 'Pettersson', 'NULL', 1), 
(4, 'ADMIN', 'admin@gmail.com', '123', 'Brent', 'Burns', 'NULL', 2);

INSERT INTO `awards` (`award_id`, `message`, `award_type`, `awardee_id`, `awarded_id`)
VALUES (1, 'Thanks bro', 'Employee of the week', 1, 2), (2, 'Denied kid', 'Employee of the month', 4, 3);

INSERT INTO `tags` VALUES (1, '#STEM'), (2, '#Hardwork'), (3, '#OSU');

INSERT INTO `tag_join` VALUES (1, 1, 1), (2, 2, 3);
