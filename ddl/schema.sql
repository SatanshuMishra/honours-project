SET foreign_key_checks = 0;
DROP TABLE IF EXISTS studentCode;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS questionTopic;
DROP TABLE IF EXISTS taxonomyCategory;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS statistic;
DROP TABLE IF EXISTS studentKnowledge;
SET foreign_key_checks = 1;

CREATE TABLE studentCode (
	code VARCHAR(255) PRIMARY KEY NOT NULL,
	isRegistered BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE = InnoDB;

CREATE TABLE student (
  studentID BINARY(16) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  completedBonusContent BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES studentCode(code)
) ENGINE = InnoDB;

CREATE TABLE questionTopic (
	topicID BINARY(16) NOT NULL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	image BLOB
) ENGINE = InnoDB;

CREATE TABLE taxonomyCategory (
	categoryID BINARY(16) NOT NULL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL
) ENGINE = InnoDB;

CREATE TABLE question (
	questionID BINARY(16) NOT NULL PRIMARY KEY,
	topicID BINARY(16) NOT NULL,
	assignedDifficulty SMALLINT NOT NULL CHECK (assignedDifficulty BETWEEN 1 AND 5),
	modifiedDifficulty SMALLINT NOT NULL CHECK (modifiedDifficulty BETWEEN 1 AND 5),
	categoryID BINARY(16) NOT NULL,
	-- assignedCompletionTime DECIMAL(5, 2) NOT NULL,
	-- modifiedCompletionTime DECIMAL(5, 2) NOT NULL,
	question TEXT NOT NULL,
	code TEXT,
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
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
	timeToAnswer DECIMAL(10, 3) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (questionID) REFERENCES question(questionID),
	FOREIGN KEY (chosenAnswerID) REFERENCES answer(answerID)
) ENGINE = InnoDB;

CREATE TABLE studentKnowledge (
	knowledgeID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	mastery DECIMAL(5, 2) DEFAULT 0.5 NOT NULL,
	difficultyOffset DECIMAL(5, 2) DEFAULT 0 NOT NULL,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB;

CREATE TABLE studentLogMastery (
	studentLogID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	mastery DECIMAL(5, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB;

CREATE TABLE studentLogOffset (
	studentLogID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	difficultyOffset DECIMAL(5, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)

) ENGINE = InnoDB;

CREATE TABLE questionLogsDifficulty (
	questionLogID BINARY(16) NOT NULL PRIMARY KEY,
	questionID BINARY(16) NOT NULL,
	difficulty DECIMAL(3, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB;

/*  INFORMATION:: INSERT STUDENT CODE  */
INSERT INTO studentCode (code) VALUES ('SystemAdmin');

/*  INFORMATION:: INITIALIZE TAXONOMY CATEGORIES  */
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8c2b51fd-6b3a-4d7a-8fc2-b0a071055062"), "Remembering");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("9cd2d9f7-b6b7-46b6-948b-66ebb6b71486"), "Understanding");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("41778620-2cd9-4eb8-9655-c67365551278"), "Applying");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8ee7ae7d-88b1-405d-a291-23f10e8cdcab"), "Analyzing");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("c3122318-a52b-4221-b009-42a1aecbc657"), "Evaluating");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("1a1bbffc-6fef-44e1-bbb9-8dc0726c2018"), "Creating");
