SET foreign_key_checks = 0;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS subTopics;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS studentQuestionInteractions;
DROP TABLE IF EXISTS ncfScores;
SET foreign_key_checks = 1;

CREATE TABLE student (
  studentID BINARY(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  completedBonusContent BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE = InnoDB;