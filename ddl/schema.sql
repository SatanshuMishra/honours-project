SET foreign_key_checks = 0;
DROP TABLE IF EXISTS studentCode;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS questionTopic;
DROP TABLE IF EXISTS taxonomyCategory;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS statistic;
DROP TABLE IF EXISTS studentKnowledge;
DROP TABLE IF EXISTS mastery_logs;
DROP TABLE IF EXISTS student_topic_category_difficulty_log;
DROP TABLE IF EXISTS student_topic_difficulty_log;
DROP TABLE IF EXISTS weighted_topic_performance_log;
DROP TABLE IF EXISTS weighted_topic_category_performance_log;
DROP TABLE IF EXISTS questionLogsDifficulty;
DROP TABLE IF EXISTS question_reports;
SET foreign_key_checks = 1;

CREATE TABLE studentCode (
    code VARCHAR(64) PRIMARY KEY NOT NULL,
    isRegistered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_registered_created (isRegistered, created_at)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE student (
    studentID BINARY(16) NOT NULL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(255) NOT NULL,
    completedBonusContent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    UNIQUE INDEX idx_username (username),
    INDEX idx_bonus_login (completedBonusContent, last_login),
    FOREIGN KEY (username) REFERENCES studentCode(code) ON DELETE CASCADE
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE questionTopic (
    topicID BINARY(16) NOT NULL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    image MEDIUMBLOB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_topic_name (name)
) ENGINE = InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE taxonomyCategory (
    categoryID BINARY(16) NOT NULL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_category_name (name)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE question (
    questionID BINARY(16) NOT NULL PRIMARY KEY,
    topicID BINARY(16) NOT NULL,
    assignedDifficulty TINYINT NOT NULL CHECK (assignedDifficulty BETWEEN 1 AND 5),
    modifiedDifficulty TINYINT NOT NULL CHECK (modifiedDifficulty BETWEEN 1 AND 5),
    categoryID BINARY(16) NOT NULL,
    question TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    code TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    isHidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_topic_difficulty_category (topicID, modifiedDifficulty, categoryID),
    INDEX idx_difficulty (modifiedDifficulty),
    INDEX idx_hidden (isHidden),
    FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
    FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE question_attempt_history (
    historyID BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    questionID BINARY(16) NOT NULL,
    lastAttempted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_question (studentID, questionID),
    INDEX idx_student_attempted (studentID, lastAttempted),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE answer (
    answerID BINARY(16) NOT NULL PRIMARY KEY,
    questionID BINARY(16) NOT NULL,
    answerDescription TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    answerExplanation TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_question_correct (questionID, isCorrect),
    FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE statistic (
    statID BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    questionID BINARY(16) NOT NULL,
    chosenAnswerID BINARY(16) NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    timeToAnswer DECIMAL(10, 3) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_time (studentID, createdAt),
    INDEX idx_question_stats (questionID, isCorrect, createdAt),
    INDEX idx_student_question (questionID, studentID),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (questionID) REFERENCES question(questionID),
    FOREIGN KEY (chosenAnswerID) REFERENCES answer(answerID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE studentKnowledge (
    knowledgeID BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    topicID BINARY(16) NOT NULL,
    categoryID BINARY(16) NOT NULL,
    mastery DECIMAL(5, 2) DEFAULT 0.5 NOT NULL,
    scaledDifficulty DECIMAL(5, 2) DEFAULT 0 NOT NULL,
    idealDifficulty TINYINT DEFAULT 3 NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_topic_category (studentID, topicID, categoryID),
    INDEX idx_mastery_difficulty (mastery, scaledDifficulty),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
    FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE mastery_logs (
    mastery_log_id BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    topicID BINARY(16) NOT NULL,
    categoryID BINARY(16) NOT NULL,
    mastery_change DECIMAL(5, 2) NOT NULL,
    mastery_value DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_topic_category_date (studentID, topicID, categoryID, createdAt),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
    FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE student_topic_category_difficulty_log (
    studentLogID BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    topicID BINARY(16) NOT NULL,
    categoryID BINARY(16) NOT NULL,
    scaledDifficulty DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_topic_category_date (studentID, topicID, categoryID, createdAt),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
    FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE student_topic_difficulty_log (
    studentLogID BINARY(16) NOT NULL PRIMARY KEY,
    studentID BINARY(16) NOT NULL,
    topicID BINARY(16) NOT NULL,
    scaledDifficulty DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_topic_date (studentID, topicID, createdAt),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topicID) REFERENCES questionTopic(topicID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE weighted_topic_performance_log (
    performance_log_id BINARY(16) NOT NULL PRIMARY KEY,
    student_id BINARY(16) NOT NULL,
    topic_id BINARY(16) NOT NULL,
    weighted_performance_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_topic_score (student_id, topic_id, weighted_performance_score),
    FOREIGN KEY (student_id) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES questionTopic(topicID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE weighted_topic_category_performance_log (
    performance_log_id BINARY(16) NOT NULL PRIMARY KEY,
    student_id BINARY(16) NOT NULL,
    topic_id BINARY(16) NOT NULL,
    category_id BINARY(16) NOT NULL,
    weighted_performance_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_topic_category_score (student_id, topic_id, category_id, weighted_performance_score),
    FOREIGN KEY (student_id) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES questionTopic(topicID),
    FOREIGN KEY (category_id) REFERENCES taxonomyCategory(categoryID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE questionLogsDifficulty (
    questionLogID BINARY(16) NOT NULL PRIMARY KEY,
    questionID BINARY(16) NOT NULL,
    difficulty DECIMAL(3, 2) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_question_difficulty_date (questionID, difficulty, createdAt),
    FOREIGN KEY (questionID) REFERENCES question(questionID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

CREATE TABLE question_reports (
    report_id BINARY(16) NOT NULL PRIMARY KEY,
    report_by BINARY(16) NOT NULL,
    question_id BINARY(16) NOT NULL,
    reason TEXT NOT NULL,
    details TEXT NOT NULL,
    status ENUM('pending', 'investigating', 'resolved', 'dismissed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    INDEX idx_status_question (status, question_id),
    INDEX idx_reporter_status (report_by, status),
    FOREIGN KEY (report_by) REFERENCES student(studentID),
    FOREIGN KEY (question_id) REFERENCES question(questionID)
) ENGINE = InnoDB ROW_FORMAT=COMPRESSED;

/*  INFORMATION:: INSERT STUDENT CODE  */
/* The following student code's are for application testers & admins */
INSERT INTO studentCode (code) VALUES ('SatanshuMishra');
INSERT INTO studentCode (code) VALUES ('TFox');

/*  INFORMATION:: INITIALIZE TAXONOMY CATEGORIES  */
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8c2b51fd-6b3a-4d7a-8fc2-b0a071055062"), "Remembering");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("9cd2d9f7-b6b7-46b6-948b-66ebb6b71486"), "Understanding");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("41778620-2cd9-4eb8-9655-c67365551278"), "Applying");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("8ee7ae7d-88b1-405d-a291-23f10e8cdcab"), "Analyzing");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("c3122318-a52b-4221-b009-42a1aecbc657"), "Evaluating");
INSERT INTO taxonomyCategory (categoryID, name) VALUES (UUID_TO_BIN("1a1bbffc-6fef-44e1-bbb9-8dc0726c2018"), "Creating");
