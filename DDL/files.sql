CREATE TABLE IF NOT EXISTS `files` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(200) not NULL,
  `size` float not NULL,
  `mime` varchar(20) not NULL,
  `payload` longblob not NULL,
  PRIMARY KEY (`uuid`)
)

-- Try to use LONGBLOB instead