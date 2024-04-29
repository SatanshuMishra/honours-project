//  NOTE: THIS IS THE FILE THAT WILL BE QUERIED WHEN LOADING NEW QUESTIONS. THE TYPE BELOW SHOWS THE STRUCTURE IN WHICH TO GENERATE NEW QUESTIONS. REFERENCE OTHER TOPIC QUESTION SETS FOR EXAMPLE OF QUESTION. IF YOU WANT TO LOAD ANY OF THE PRE-MADE QUESTIONS, RENAME THAT FILE TO BE dummyData.ts

export const dummyData: {
  difficulty: number;
  question: string;
  code?: string;
  answers: string[];
  correct: number;
  explanations: string[];
  bloomTaxonomy: string;
  timeTakenSeconds: number;
  topic: string;
}[] = [];
