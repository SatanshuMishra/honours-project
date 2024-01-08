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

CREATE TABLE profile (
	profileID BINARY(36) NOT NULL PRIMARY KEY,
	studentID BINARY(36) NOT NULL,
	previousProgrammingExperience INTEGER NOT NULL,
	CONSTRAINT PrevExp_Consrt CHECK (previousProgrammingExperience IN (1, 2, 3, 4, 5)),
	FOREIGN KEY (studentID) REFERENCES student(studentID)
) ENGINE = InnoDB;

CREATE TABLE question (
	questionID BINARY(36) NOT NULL PRIMARY KEY,
	difficulty INTEGER NOT NULL,
	CONSTRAINT Diff_Consrt CHECK (difficulty IN (1, 2, 3)),
	question TEXT NOT NULL,
	code TEXT
) ENGINE = InnoDB;

CREATE TABLE answer (
	answerID BINARY(36) NOT NULL PRIMARY KEY,
	questionID BINARY(36) NOT NULL,
	answerDescription TEXT NOT NULL,
	answerExplanation TEXT NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB;

CREATE TABLE statistic (
	statID BINARY(36) NOT NULL PRIMARY KEY,
	studentID BINARY(36) NOT NULL,
	questionID BINARY(36) NOT NULL,
	chosenAnswerID BINARY(36) NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	timeToAnswer DECIMAL NOT NULL,
	recordedDifficulty INTEGER,
	CONSTRAINT RecDiff_Consrt CHECK (recordedDifficulty IN (1, 2, 3)),
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (questionID) REFERENCES question(questionID),
	FOREIGN KEY (chosenAnswerID) REFERENCES answer(answerID)
) ENGINE = InnoDB;
