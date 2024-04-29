<div align="center" style="wi[Title](padding:%25204px%253B)dth:100%; display: flex; flex-direction:column; justify-content: center;">
   <div style="width:100%; display: flex; justify-content: center;">
      <img src="https://github.com/SatanshuMishra/honours-2023-adaptive-learning-tool/assets/63601536/5d9b7bb5-64e6-4efe-b2ea-234772351b8f">
   </div>
   <div>
      <img style="padding: 4px;" src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
      <img style="padding: 4px;" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
      <img style="padding: 4px;" src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white">
      <img style="padding: 4px;" src="https://img.shields.io/badge/r-%23276DC3.svg?style=for-the-badge&logo=r&logoColor=white">

   </div>
</div>

## Overview

**uLearn** is an adaptive learning tool designed to personalize the learning experience for students.

![image](https://github.com/SatanshuMishra/honours-2023-adaptive-learning-tool/assets/63601536/16a26112-6e8a-43fb-8a0d-ddd412f1b5e9)

## Features

- Dynamic Question Difficulty based on global student performance.
- Track individual student mastery for each Topic.
- Use IRT to identify relationships between individual students and the questions to accurately recommend questions.

## Pre-Requisites
Before you can install our app, you must have the following pre-requisites:

| Services       | Version  |
|----------------|----------|
| Node.js        | > 21.6.2 |
| NPM            | > 10.5.0 |
| Docker Desktop | > 4.28.0 |
| Python         | > 3.7    |
| R              | > 4.3.2  |
| Git            | > 2.39.3 |

Our app also requires come R & Python packages of a certain version. These requirements are highlighted below:

| Packages       | Version  |
|----------------|----------|
| rpy2           | > 3.5.15 |
| pandas         | > 2.2.1  |

> These are just the recommend versions for each of the above services and packages. Other verisons (older/newer) may also work. However, compatability for these has not been tested.

## Installation

The recommend way to install our app is to use the following steps:
1. Clone the repository using `https://github.com/SatanshuMishra/honours-2023-adaptive-learning-tool.git`.
2. Navigate into `honours-2023-adaptive-learning-tool`. Install system dependencies:

```bash
npm install
```

4. Initialize .env and .env.local files.

**.env**:
```yaml
DATABASE_URL = # Enter the URL to the database here.
```
**.env.local**
```yaml
JWT_SECRET= # A secure key that will be used to encrypt your JWT
PASSWORD_ENCRYPTION_KEY= # A secure key that will be used to encrypt your passwords.
```

4. Open Docker. Start the docker containers using a terminal of your choosing:

```bash
docker-compose up [-d]
```

5. The system will be live @ `localhost:3030`.
6. Built into the docker-compose is a MySQL server and phpmyadmin live @ `localhost:8080`.

## Logging In
This learning tool uses a specific way to log users into the system:

1. By default, the username `SystemAdmin` is available to you. First go to `localhost:3030` and Sign-Up using the aforementioned username.
2. Once you successfully sign-up, use the same credentials to sign-in.

You are now logged in!

## Inserting Questions

The learning tool offers a simplifed way to load questions. Lets go through the steps:
1. Ensure you are logged in as the `SystemAdmin` user. You should see Developer Tools at the bottom of your dashboard.

<img width="322" alt="image" src="https://github.com/SatanshuMishra/honours-2023-adaptive-learning-tool/assets/63601536/b7481c4a-e6d9-4be0-ab62-be8bc6b4beef">

2. Open your file explorer. Navigate into `honours-2023-adaptive-learning-tool/app/data`. Here you will notice one file called `dummyData.ts`. This is the file that will be queried when we add the questions. Here you have two options, you can create your own questions in this file. Or you can use the pre-made questions in the four other files provided.
3. If you want to use the pre-given questions, then rename the appropriate file to `dummyData.ts`.
4. Return to the app and select the first button the Developer Tools. This will add all the questions in the file. Once the process is compelete, refresh the page to see the topic on the dashboard.

**Important Considerations when Creating your own Questions**:

To generate your own questions, you will need to take some important factors into consideration. It is IMPORTANT that the questions follow the following structure (Also given in `dummyData.ts`):

```ts
  difficulty: number; // A number between 0 - 1.
  question: string; 
  code?: string; // Code is optional for each question.
  answers: string[]; // Array of 4 strings.
  correct: number;
  explanations: string[]; // Array of 4 strings, Each refering to the same index value in answers.
  bloomTaxonomy: string; // One of Remembering, Understanding, Applying, Analyzing, Evaluating or Creating.
  timeTakenSeconds: number;
  topic: string; // All questions with the same topic will be grouped together.
```

If you want to change the bloomTaxonomy (i.e., Category) of the question, you will need to either add these manually to the Database (See Database Section) or add logic to automatically add new categories to the database on question insert.

Deeper changes to the question structure will require revaluation of the question selection code.

## Database
The following is the database structure used in this learning tool and their uses:

```sql

/* STORES SIGN-UP ABLE USERNAMES: YOU CAN ONLY SIGN-UP IF YOUR USERNAME IS IN THIS TABLE. VALUES MANUALLY INSERTED.*/

studentCode (
	code VARCHAR(255) PRIMARY KEY NOT NULL,
	isRegistered BOOLEAN NOT NULL DEFAULT FALSE
)

/* STORES SIGNED-UP STUDENT INFORMATION.*/

student (
  studentID BINARY(16) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  completedBonusContent BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES studentCode(code)
)

/* STORES QUESTION TOPICS. ADDED AUTOMATICALLY AS QUESTIONS ARE ADDED.*/

questionTopic (
	topicID BINARY(16) NOT NULL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	image BLOB
)

/* STORES QUESTION CATEGORIES. MANUALLY INSERTED.*/

taxonomyCategory (
	categoryID BINARY(16) NOT NULL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL
)

/* STORES QUESTIONS ADDED TO THE SYSTEM */

question (
	questionID BINARY(16) NOT NULL PRIMARY KEY,
	topicID BINARY(16) NOT NULL,
	assignedDifficulty DECIMAL(4, 1) NOT NULL,
	modifiedDifficulty DECIMAL(4, 1) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	assignedCompletionTime DECIMAL(5, 2) NOT NULL,
	modifiedCompletionTime DECIMAL(5, 2) NOT NULL,
	question TEXT NOT NULL,
	code TEXT,
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
)

/* STORES ANSWERS ADDED FOR QUESTIONS ADDED TO THE SYSTEM*/

answer (
	answerID BINARY(16) NOT NULL PRIMARY KEY,
	questionID BINARY(16) NOT NULL,
	answerDescription TEXT NOT NULL,
	answerExplanation TEXT NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	FOREIGN KEY (questionID) REFERENCES question(questionID)
)

/* STORE STATISTIC DATA FOR ALL STUDENTS ON THE SYSTEM */

statistic (
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
)

/* [IMPORTANT FOR ML] STORES THE IRT DIFFICULTY OFFSET AND MASTERY FOR EACH STUDENT FOR EACH TOPIC - CATEGORY PAIR. */

studentKnowledge (
	knowledgeID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	mastery DECIMAL(5, 2) DEFAULT 0.5 NOT NULL,
	difficultyOffset DECIMAL(5, 2) DEFAULT 0 NOT NULL,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
)

/* STORES STUDENT MASTERY CHANGES OVER TIME. DOESN'T STORE ACTUAL VALUES BUT THE CHANGE. */

studentLogMastery (
	studentLogID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	mastery DECIMAL(5, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
)

/* STORES STUDENT DIFFICULTY OFFSET CHANGES OVER TIME. */

studentLogOffset (
	studentLogID BINARY(16) NOT NULL PRIMARY KEY,
	studentID BINARY(16) NOT NULL,
	topicID BINARY(16) NOT NULL,
	categoryID BINARY(16) NOT NULL,
	difficultyOffset DECIMAL(5, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (studentID) REFERENCES student(studentID),
	FOREIGN KEY (topicID) REFERENCES questionTopic(topicID),
	FOREIGN KEY (categoryID) REFERENCES taxonomyCategory(categoryID)
)

/* STORES CHANGES IN QUESTION DIFFICULTY OVER TIME. */

questionLogsDifficulty (
	questionLogID BINARY(16) NOT NULL PRIMARY KEY,
	questionID BINARY(16) NOT NULL,
	difficulty DECIMAL(3, 2) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (questionID) REFERENCES question(questionID)
)
