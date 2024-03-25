SET foreign_key_checks = 0;
DROP TABLE IF EXISTS studentCode;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS topic;
DROP TABLE IF EXISTS taxonomyCategory;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS statistic;
DROP TABLE IF EXISTS uuidMapping;
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
	assignedDifficulty INTEGER NOT NULL,
	modifiedDifficulty DECIMAL(3, 2) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	assignedCompletionTime INTEGER NOT NULL,
	modifiedCompletionTime DECIMAL(5, 2) NOT NULL,
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


/*  INFORMATION:: INSERT STUDENT CODE  */
INSERT INTO studentCode (code) VALUES ('SatanshuMishra');
INSERT INTO studentCode (code) VALUES ('Shaheer');
INSERT INTO studentCode (code) VALUES ('Trevor');
INSERT INTO studentCode (code) VALUES ('Ana');
INSERT INTO studentCode (code) VALUES ('cUGnTw');
INSERT INTO studentCode (code) VALUES ('yq+rT0');
INSERT INTO studentCode (code) VALUES ('aMqYr8');
INSERT INTO studentCode (code) VALUES ('E6HK3b');
INSERT INTO studentCode (code) VALUES ('NB+LeI');
INSERT INTO studentCode (code) VALUES ('CgLnOW');
INSERT INTO studentCode (code) VALUES ('WXUdCu');
INSERT INTO studentCode (code) VALUES ('r1envi');
INSERT INTO studentCode (code) VALUES ('s+8R35');
INSERT INTO studentCode (code) VALUES ('eLeLEP');
INSERT INTO studentCode (code) VALUES ('K1WLV1');
INSERT INTO studentCode (code) VALUES ('NaeOQ+');
INSERT INTO studentCode (code) VALUES ('fQ5HIS');
INSERT INTO studentCode (code) VALUES ('9DZEqv');
INSERT INTO studentCode (code) VALUES ('zekF5v');
INSERT INTO studentCode (code) VALUES ('7b00zq');
INSERT INTO studentCode (code) VALUES ('/cVDJG');
INSERT INTO studentCode (code) VALUES ('cbxzK7');
INSERT INTO studentCode (code) VALUES ('4ZWFq4');
INSERT INTO studentCode (code) VALUES ('SOfRGB');
INSERT INTO studentCode (code) VALUES ('N0sRbT');
INSERT INTO studentCode (code) VALUES ('iD62aI');
INSERT INTO studentCode (code) VALUES ('3DwkEm');
INSERT INTO studentCode (code) VALUES ('6X/a6U');
INSERT INTO studentCode (code) VALUES ('uzr8Qu');
INSERT INTO studentCode (code) VALUES ('m/E1e9');
INSERT INTO studentCode (code) VALUES ('x4cAaG');
INSERT INTO studentCode (code) VALUES ('TOOpT0');
INSERT INTO studentCode (code) VALUES ('g9A73P');
INSERT INTO studentCode (code) VALUES ('5OpCZZ');
INSERT INTO studentCode (code) VALUES ('92lLPP');
INSERT INTO studentCode (code) VALUES ('jljsN5');
INSERT INTO studentCode (code) VALUES ('jPxA09');
INSERT INTO studentCode (code) VALUES ('LyOvyo');
INSERT INTO studentCode (code) VALUES ('4MiF9Z');
INSERT INTO studentCode (code) VALUES ('J1mso8');
INSERT INTO studentCode (code) VALUES ('kh0np2');
INSERT INTO studentCode (code) VALUES ('/McI0u');
INSERT INTO studentCode (code) VALUES ('VPGsCu');
INSERT INTO studentCode (code) VALUES ('pa5QvM');
INSERT INTO studentCode (code) VALUES ('An3r4A');
INSERT INTO studentCode (code) VALUES ('SHnpYK');
INSERT INTO studentCode (code) VALUES ('XllsYQ');
INSERT INTO studentCode (code) VALUES ('DCkg2u');
INSERT INTO studentCode (code) VALUES ('LUVBNs');
INSERT INTO studentCode (code) VALUES ('Z6eK8e');
INSERT INTO studentCode (code) VALUES ('uZrIsA');
INSERT INTO studentCode (code) VALUES ('5ohasa');
INSERT INTO studentCode (code) VALUES ('lmP5v8');
INSERT INTO studentCode (code) VALUES ('XrLQGH');
INSERT INTO studentCode (code) VALUES ('ZcMdab');
INSERT INTO studentCode (code) VALUES ('tzH3yS');
INSERT INTO studentCode (code) VALUES ('ApSaQL');
INSERT INTO studentCode (code) VALUES ('HKUeRG');
INSERT INTO studentCode (code) VALUES ('pBqSH7');
INSERT INTO studentCode (code) VALUES ('/SXWRd');
INSERT INTO studentCode (code) VALUES ('M3ZdY0');
INSERT INTO studentCode (code) VALUES ('S6hB+E');
INSERT INTO studentCode (code) VALUES ('apWDck');
INSERT INTO studentCode (code) VALUES ('l2E5Fz');
INSERT INTO studentCode (code) VALUES ('3zaY3L');
INSERT INTO studentCode (code) VALUES ('mS+vVi');
INSERT INTO studentCode (code) VALUES ('L0E0CU');
INSERT INTO studentCode (code) VALUES ('auPKM6');
INSERT INTO studentCode (code) VALUES ('Yvqx6v');
INSERT INTO studentCode (code) VALUES ('vpfibc');
INSERT INTO studentCode (code) VALUES ('d/c8Ew');
INSERT INTO studentCode (code) VALUES ('ji7ulP');
INSERT INTO studentCode (code) VALUES ('kRPmzq');
INSERT INTO studentCode (code) VALUES ('lLIcnu');
INSERT INTO studentCode (code) VALUES ('buxR/f');
INSERT INTO studentCode (code) VALUES ('az6/Jt');
INSERT INTO studentCode (code) VALUES ('XbVAQy');
INSERT INTO studentCode (code) VALUES ('Wohx6b');
INSERT INTO studentCode (code) VALUES ('fDxClL');
INSERT INTO studentCode (code) VALUES ('aljSNy');
INSERT INTO studentCode (code) VALUES ('m70sOE');
INSERT INTO studentCode (code) VALUES ('RpGa/U');
INSERT INTO studentCode (code) VALUES ('2ldyG2');
INSERT INTO studentCode (code) VALUES ('YRmzpH');
INSERT INTO studentCode (code) VALUES ('6Z3O4r');
INSERT INTO studentCode (code) VALUES ('buvhUb');
INSERT INTO studentCode (code) VALUES ('iqCquL');
INSERT INTO studentCode (code) VALUES ('2BlJuD');
INSERT INTO studentCode (code) VALUES ('oINKGH');
INSERT INTO studentCode (code) VALUES ('nakzbz');
INSERT INTO studentCode (code) VALUES ('M1vHnI');
INSERT INTO studentCode (code) VALUES ('gFOxcW');
INSERT INTO studentCode (code) VALUES ('2mDVh+');
INSERT INTO studentCode (code) VALUES ('Cpo1ns');
INSERT INTO studentCode (code) VALUES ('YmSGSc');
INSERT INTO studentCode (code) VALUES ('0WNg1Q');
INSERT INTO studentCode (code) VALUES ('bAGPRg');
INSERT INTO studentCode (code) VALUES ('0kK9U9');
INSERT INTO studentCode (code) VALUES ('L+A4Vj');
INSERT INTO studentCode (code) VALUES ('Bxy2C/');
INSERT INTO studentCode (code) VALUES ('jRd/5g');
INSERT INTO studentCode (code) VALUES ('5rHzWI');
INSERT INTO studentCode (code) VALUES ('YinWc0');
INSERT INTO studentCode (code) VALUES ('trBcsV');
INSERT INTO studentCode (code) VALUES ('PhL78z');
INSERT INTO studentCode (code) VALUES ('LkEUwj');
INSERT INTO studentCode (code) VALUES ('8ReAZB');
INSERT INTO studentCode (code) VALUES ('powrdI');
INSERT INTO studentCode (code) VALUES ('8XEOjP');
INSERT INTO studentCode (code) VALUES ('Z57qqd');
INSERT INTO studentCode (code) VALUES ('kDHAzR');
INSERT INTO studentCode (code) VALUES ('lxs3sy');
INSERT INTO studentCode (code) VALUES ('H+z3WQ');
INSERT INTO studentCode (code) VALUES ('bwYt4M');
INSERT INTO studentCode (code) VALUES ('NpkWrb');
INSERT INTO studentCode (code) VALUES ('wT4AWC');
INSERT INTO studentCode (code) VALUES ('zl8YLI');
INSERT INTO studentCode (code) VALUES ('+8BPSu');
INSERT INTO studentCode (code) VALUES ('1IZI9b');
INSERT INTO studentCode (code) VALUES ('9ZPV7u');
INSERT INTO studentCode (code) VALUES ('mclOn4');
INSERT INTO studentCode (code) VALUES ('UN7UQa');
INSERT INTO studentCode (code) VALUES ('73ADXu');
INSERT INTO studentCode (code) VALUES ('+UjNRB');
INSERT INTO studentCode (code) VALUES ('xWFlmB');
INSERT INTO studentCode (code) VALUES ('qWmkl+');
INSERT INTO studentCode (code) VALUES ('0KTclX');
INSERT INTO studentCode (code) VALUES ('rkRyLk');
INSERT INTO studentCode (code) VALUES ('9Bo/MA');
INSERT INTO studentCode (code) VALUES ('HBSJY/');
INSERT INTO studentCode (code) VALUES ('hfM6YB');
INSERT INTO studentCode (code) VALUES ('mywRgA');
INSERT INTO studentCode (code) VALUES ('m29VpJ');
INSERT INTO studentCode (code) VALUES ('jk/YmG');
INSERT INTO studentCode (code) VALUES ('CxlDuJ');
INSERT INTO studentCode (code) VALUES ('Hz35/F');
INSERT INTO studentCode (code) VALUES ('B3SGGy');
INSERT INTO studentCode (code) VALUES ('xEvd2C');
INSERT INTO studentCode (code) VALUES ('UtrDqQ');
INSERT INTO studentCode (code) VALUES ('gcPG8B');
INSERT INTO studentCode (code) VALUES ('kc8dKl');
INSERT INTO studentCode (code) VALUES ('m8Od+t');
INSERT INTO studentCode (code) VALUES ('KbrOqJ');
INSERT INTO studentCode (code) VALUES ('HLno+A');
INSERT INTO studentCode (code) VALUES ('i3c2Hi');
INSERT INTO studentCode (code) VALUES ('VaCZmk');
INSERT INTO studentCode (code) VALUES ('5VVOH1');
INSERT INTO studentCode (code) VALUES ('o1RicA');
INSERT INTO studentCode (code) VALUES ('2nG2a1');
INSERT INTO studentCode (code) VALUES ('GCLqCR');
INSERT INTO studentCode (code) VALUES ('k7wdHZ');
INSERT INTO studentCode (code) VALUES ('Hc9HBO');
INSERT INTO studentCode (code) VALUES ('PH1CMh');
INSERT INTO studentCode (code) VALUES ('n6Dg3D');
INSERT INTO studentCode (code) VALUES ('tjuzqn');
INSERT INTO studentCode (code) VALUES ('thQZo1');
INSERT INTO studentCode (code) VALUES ('Fy718P');
INSERT INTO studentCode (code) VALUES ('Iu9Idg');
INSERT INTO studentCode (code) VALUES ('GMR57e');
INSERT INTO studentCode (code) VALUES ('JpOgQU');
INSERT INTO studentCode (code) VALUES ('sEwy9y');
INSERT INTO studentCode (code) VALUES ('Y1iima');
INSERT INTO studentCode (code) VALUES ('zNoMKO');
INSERT INTO studentCode (code) VALUES ('hTTmkF');
INSERT INTO studentCode (code) VALUES ('YsN/Kt');
INSERT INTO studentCode (code) VALUES ('yLY20b');
INSERT INTO studentCode (code) VALUES ('HrMOHT');
INSERT INTO studentCode (code) VALUES ('M8zc3z');
INSERT INTO studentCode (code) VALUES ('wdrTSo');
INSERT INTO studentCode (code) VALUES ('Jws5tf');
INSERT INTO studentCode (code) VALUES ('tKA8m0');
INSERT INTO studentCode (code) VALUES ('Y7AJs5');
INSERT INTO studentCode (code) VALUES ('B+OHFH');
INSERT INTO studentCode (code) VALUES ('vo1teI');
INSERT INTO studentCode (code) VALUES ('7+X16j');
INSERT INTO studentCode (code) VALUES ('fTwKQj');
INSERT INTO studentCode (code) VALUES ('OQKyjk');
INSERT INTO studentCode (code) VALUES ('Bpw2ec');
INSERT INTO studentCode (code) VALUES ('95sQCr');
INSERT INTO studentCode (code) VALUES ('1H3EJa');
INSERT INTO studentCode (code) VALUES ('bqpTy1');
INSERT INTO studentCode (code) VALUES ('U3I1k0');
INSERT INTO studentCode (code) VALUES ('M4Uaeu');
INSERT INTO studentCode (code) VALUES ('UUATKl');
INSERT INTO studentCode (code) VALUES ('nWFLLH');
INSERT INTO studentCode (code) VALUES ('u8JLwN');
INSERT INTO studentCode (code) VALUES ('vYol8v');
INSERT INTO studentCode (code) VALUES ('ivgd6n');
INSERT INTO studentCode (code) VALUES ('iS242V');
INSERT INTO studentCode (code) VALUES ('gpSE46');
INSERT INTO studentCode (code) VALUES ('+DZFkB');
INSERT INTO studentCode (code) VALUES ('drcmWn');
INSERT INTO studentCode (code) VALUES ('lMcPTC');
INSERT INTO studentCode (code) VALUES ('DDsDmV');
INSERT INTO studentCode (code) VALUES ('A0OeK4');
INSERT INTO studentCode (code) VALUES ('Hk9ds5');
INSERT INTO studentCode (code) VALUES ('xyrq/m');
INSERT INTO studentCode (code) VALUES ('j/8lwR');
INSERT INTO studentCode (code) VALUES ('QB5a5B');
INSERT INTO studentCode (code) VALUES ('M1gc2+');
INSERT INTO studentCode (code) VALUES ('hlljsl');
INSERT INTO studentCode (code) VALUES ('fKe029');
INSERT INTO studentCode (code) VALUES ('j/8zTD');
INSERT INTO studentCode (code) VALUES ('gcY++K');
INSERT INTO studentCode (code) VALUES ('94xhN3');
INSERT INTO studentCode (code) VALUES ('6T2pz9');
INSERT INTO studentCode (code) VALUES ('FH/qHZ');
INSERT INTO studentCode (code) VALUES ('I0a9ki');
INSERT INTO studentCode (code) VALUES ('tHKm8b');
INSERT INTO studentCode (code) VALUES ('zhfOCm');
INSERT INTO studentCode (code) VALUES ('yhCpst');
INSERT INTO studentCode (code) VALUES ('MQqe4u');
INSERT INTO studentCode (code) VALUES ('sY4SX3');
INSERT INTO studentCode (code) VALUES ('PGw/UM');
INSERT INTO studentCode (code) VALUES ('dRIRGc');
INSERT INTO studentCode (code) VALUES ('5cjv71');
INSERT INTO studentCode (code) VALUES ('aqv2NX');
INSERT INTO studentCode (code) VALUES ('Xp/3QL');
INSERT INTO studentCode (code) VALUES ('YRjVVl');
INSERT INTO studentCode (code) VALUES ('u+hRTG');
INSERT INTO studentCode (code) VALUES ('8jru1Q');
INSERT INTO studentCode (code) VALUES ('11H/Nx');
INSERT INTO studentCode (code) VALUES ('l0ieid');
INSERT INTO studentCode (code) VALUES ('nJUWnG');
INSERT INTO studentCode (code) VALUES ('amWkZy');
INSERT INTO studentCode (code) VALUES ('sRNvQf');
INSERT INTO studentCode (code) VALUES ('PkGD4X');
INSERT INTO studentCode (code) VALUES ('pqVEYr');
INSERT INTO studentCode (code) VALUES ('+5/WtD');
INSERT INTO studentCode (code) VALUES ('qEu3qV');
INSERT INTO studentCode (code) VALUES ('22edE3');
INSERT INTO studentCode (code) VALUES ('rYnO7M');
INSERT INTO studentCode (code) VALUES ('43tNyE');
INSERT INTO studentCode (code) VALUES ('4IyXXD');
INSERT INTO studentCode (code) VALUES ('H+lnu8');
INSERT INTO studentCode (code) VALUES ('FYQepa');
INSERT INTO studentCode (code) VALUES ('cd84sH');
INSERT INTO studentCode (code) VALUES ('gA0Yzq');
INSERT INTO studentCode (code) VALUES ('RhAeEM');
INSERT INTO studentCode (code) VALUES ('k9Qozb');
INSERT INTO studentCode (code) VALUES ('tSAeFY');
INSERT INTO studentCode (code) VALUES ('6VW8G3');
INSERT INTO studentCode (code) VALUES ('RktG2w');
INSERT INTO studentCode (code) VALUES ('YudHJV');
INSERT INTO studentCode (code) VALUES ('dNWbqU');
INSERT INTO studentCode (code) VALUES ('n3Rnya');
INSERT INTO studentCode (code) VALUES ('7WXYqG');
INSERT INTO studentCode (code) VALUES ('l6FdT8');
INSERT INTO studentCode (code) VALUES ('afVxsD');
INSERT INTO studentCode (code) VALUES ('eeElZS');
INSERT INTO studentCode (code) VALUES ('0t0PDV');
INSERT INTO studentCode (code) VALUES ('72+n7L');
INSERT INTO studentCode (code) VALUES ('cBsxac');
INSERT INTO studentCode (code) VALUES ('Rg6C+S');
INSERT INTO studentCode (code) VALUES ('zykAEu');
INSERT INTO studentCode (code) VALUES ('rVECzX');
INSERT INTO studentCode (code) VALUES ('hwzZRV');
INSERT INTO studentCode (code) VALUES ('zsr9gw');
INSERT INTO studentCode (code) VALUES ('g0khbi');
INSERT INTO studentCode (code) VALUES ('ISHr1H');
INSERT INTO studentCode (code) VALUES ('22M9On');
INSERT INTO studentCode (code) VALUES ('cSp3TU');
INSERT INTO studentCode (code) VALUES ('CSsHYM');
INSERT INTO studentCode (code) VALUES ('Kc7LqY');
INSERT INTO studentCode (code) VALUES ('EkDgQT');
INSERT INTO studentCode (code) VALUES ('rXuPqD');
INSERT INTO studentCode (code) VALUES ('jqxOuI');
INSERT INTO studentCode (code) VALUES ('Hk/1CP');
INSERT INTO studentCode (code) VALUES ('yo58Fj');
INSERT INTO studentCode (code) VALUES ('2HYmhg');
INSERT INTO studentCode (code) VALUES ('d2JXLG');
INSERT INTO studentCode (code) VALUES ('3dJBYZ');
INSERT INTO studentCode (code) VALUES ('KzY8HN');
INSERT INTO studentCode (code) VALUES ('JOGRWq');
INSERT INTO studentCode (code) VALUES ('JI6IM5');
INSERT INTO studentCode (code) VALUES ('ZoNpHW');
INSERT INTO studentCode (code) VALUES ('1QOoZE');
INSERT INTO studentCode (code) VALUES ('av9vBO');
INSERT INTO studentCode (code) VALUES ('ViUVf4');
INSERT INTO studentCode (code) VALUES ('w1lQhu');
INSERT INTO studentCode (code) VALUES ('wYANYu');
INSERT INTO studentCode (code) VALUES ('uBNtxn');
INSERT INTO studentCode (code) VALUES ('xL1Axx');
INSERT INTO studentCode (code) VALUES ('fHVpTR');
INSERT INTO studentCode (code) VALUES ('txBqdJ');
INSERT INTO studentCode (code) VALUES ('8fT/9Z');
INSERT INTO studentCode (code) VALUES ('I2Cj2A');
INSERT INTO studentCode (code) VALUES ('Dc2gbv');
INSERT INTO studentCode (code) VALUES ('NiP9Td');
INSERT INTO studentCode (code) VALUES ('3x94nn');
INSERT INTO studentCode (code) VALUES ('9GCPqk');
INSERT INTO studentCode (code) VALUES ('UR2l0u');
INSERT INTO studentCode (code) VALUES ('w8BjFh');
INSERT INTO studentCode (code) VALUES ('16ZY2i');
INSERT INTO studentCode (code) VALUES ('+Jy3qP');
INSERT INTO studentCode (code) VALUES ('vK5R9L');
INSERT INTO studentCode (code) VALUES ('sMH3G3');
INSERT INTO studentCode (code) VALUES ('5p3I5s');
INSERT INTO studentCode (code) VALUES ('H5jWj1');
INSERT INTO studentCode (code) VALUES ('VCMgsk');
INSERT INTO studentCode (code) VALUES ('nnH8lU');
INSERT INTO studentCode (code) VALUES ('9RgOOs');
INSERT INTO studentCode (code) VALUES ('VjrIg0');
INSERT INTO studentCode (code) VALUES ('nMK2s0');
INSERT INTO studentCode (code) VALUES ('JGKyq5');
INSERT INTO studentCode (code) VALUES ('v4HvV/');
INSERT INTO studentCode (code) VALUES ('QSjklG');
INSERT INTO studentCode (code) VALUES ('qs8n5e');
INSERT INTO studentCode (code) VALUES ('XfpVke');
INSERT INTO studentCode (code) VALUES ('LCLXyQ');
INSERT INTO studentCode (code) VALUES ('NY7hje');
INSERT INTO studentCode (code) VALUES ('39luxq');
INSERT INTO studentCode (code) VALUES ('oIoHBo');
INSERT INTO studentCode (code) VALUES ('zXN25r');
INSERT INTO studentCode (code) VALUES ('lB4jLL');
INSERT INTO studentCode (code) VALUES ('RrHJ+s');
INSERT INTO studentCode (code) VALUES ('niInbj');
INSERT INTO studentCode (code) VALUES ('Myg4+q');
INSERT INTO studentCode (code) VALUES ('hw1F91');
INSERT INTO studentCode (code) VALUES ('dKd8z9');
INSERT INTO studentCode (code) VALUES ('Gi32x8');
INSERT INTO studentCode (code) VALUES ('sXGd3m');
INSERT INTO studentCode (code) VALUES ('05CMd+');
INSERT INTO studentCode (code) VALUES ('v9NH0z');
INSERT INTO studentCode (code) VALUES ('Pmxcod');
INSERT INTO studentCode (code) VALUES ('JCFMZt');
INSERT INTO studentCode (code) VALUES ('VrMjjV');
INSERT INTO studentCode (code) VALUES ('j+lkFZ');
INSERT INTO studentCode (code) VALUES ('xrJCoz');
INSERT INTO studentCode (code) VALUES ('9Naq15');
INSERT INTO studentCode (code) VALUES ('QSBXyZ');
INSERT INTO studentCode (code) VALUES ('lj3NnI');
INSERT INTO studentCode (code) VALUES ('6GyVqk');
INSERT INTO studentCode (code) VALUES ('yHGeqm');
INSERT INTO studentCode (code) VALUES ('5t0fdS');
INSERT INTO studentCode (code) VALUES ('31EZPF');
INSERT INTO studentCode (code) VALUES ('iQ3ox7');
INSERT INTO studentCode (code) VALUES ('fzTYf/');
INSERT INTO studentCode (code) VALUES ('MNYrTM');
INSERT INTO studentCode (code) VALUES ('XyT8V3');
INSERT INTO studentCode (code) VALUES ('AloJpV');
INSERT INTO studentCode (code) VALUES ('p5NEZq');

/*  INFORMATION:: INITIALIZE TAXONOMY CATEGORIES  */
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8c2b51fd-6b3a-4d7a-8fc2-b0a071055062"), "Remembering");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("9cd2d9f7-b6b7-46b6-948b-66ebb6b71486"), "Understanding");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("41778620-2cd9-4eb8-9655-c67365551278"), "Applying");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8ee7ae7d-88b1-405d-a291-23f10e8cdcab"), "Analyzing");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("c3122318-a52b-4221-b009-42a1aecbc657"), "Evaluating");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("1a1bbffc-6fef-44e1-bbb9-8dc0726c2018"), "Creating");
