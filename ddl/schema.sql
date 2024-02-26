SET foreign_key_checks = 0;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS topic;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS statistic;
DROP TABLE IF EXISTS uuidMapping;
SET foreign_key_checks = 1;

CREATE TABLE student (
  studentID BINARY(16) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  completedBonusContent BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE = InnoDB;

CREATE TABLE profile (
	profileID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	previousProgrammingExperience INTEGER NOT NULL,
	CONSTRAINT PrevExp_Consrt CHECK (previousProgrammingExperience IN (1, 2, 3, 4, 5)),
	FOREIGN KEY (studentID) REFERENCES student(studentID)
) ENGINE = InnoDB;

CREATE TABLE questionTopic (
	topicID BINARY(16) NOT NULL PRIMARY KEY,
	name TEXT NOT NULL
) ENGINE = InnoDB;

CREATE TABLE question (
	questionID BINARY(16) NOT NULL PRIMARY KEY,
	topicID BINARY(16) NOT NULL,
	difficulty INTEGER NOT NULL,
	CONSTRAINT Diff_Consrt CHECK (difficulty IN (1, 2, 3)),
	modDifficulty DECIMAL(3, 2) NOT NULL,
	questionTaxonomy INTEGER NOT NULL,
	CONSTRAINT Taxo_Consrt CHECK (questionTaxonomy IN (1, 2, 3)),
	timeTakenSeconds INTEGER NOT NULL,
	modTimeTakenSeconds DECIMAL(5, 2) NOT NULL,
	question TEXT NOT NULL,
	code TEXT,
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID)
) ENGINE = InnoDB;

CREATE TABLE answer (
	answerID BINARY(16) NOT NULL PRIMARY KEY,
	questionID BINARY(16) NOT NULL,
	answerDescription TEXT NOT NULL,
	answerExplanation TEXT NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB;

CREATE TABLE statistic (
	statID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	questionID BINARY(16) NOT NULL,
	chosenAnswerID BINARY(16) NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	timeToAnswer DECIMAL NOT NULL,
	recordedDifficulty INTEGER,
	CONSTRAINT RecDiff_Consrt CHECK (recordedDifficulty IN (1, 2, 3)),
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (questionID) REFERENCES question(questionID),
	FOREIGN KEY (chosenAnswerID) REFERENCES answer(answerID)
) ENGINE = InnoDB;

CREATE TABLE uuidMapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid BINARY(16) UNIQUE NOT NULL
);

