"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import "remixicon/fonts/remixicon.css";

import Question from "../../types/question";
import Answer from "../../types/answer";
import Student from "../../types/student";
import ProgressBar from "../../components/progressBar/progressBar";
import QuizOption from "../../components/quizComponents/QuizOption";
import Loading from "../../components/loading/loading";
import Results from "../../components/results/results";
import ULearnLogo from "../../components/uLearnLogo/ULearnLogo";
import TipAccordion from "../../components/accordion/TipAccordion";
import fetchQuestions from "../../scripts/fetchQuestions";
import fetchAnswers from "../../scripts/fetchAnswers";
import verifyJWT from "../../scripts/verifyJWT";

const QUESTIONS_PER_QUIZ = 5;
const API_ENDPOINTS = {
  ADD_STATISTICS: '/questionnaire/api/addperformancestatistics',
  PROCESS_RESULTS: '/questionnaire/api/processResults'
} as const;

interface StudentInfo {
  studentID: string | null;
  name: string | null;
  username: string | null;
}

interface QuizState {
  loading: boolean;
  error: string | null;
  score: number;
  startTime: number | null;
  duration: number | null;
  quizDurationStart: number | null;
  quizDurationEnd: number | null;
  studentInfo: StudentInfo;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  selectedOptionIdx: 0 | 1 | 2 | 3 | null;
  submitted: boolean;
}

interface APIResponse<T> {
  data: T | null;
  status: number;
}

type QuizAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STUDENT_INFO"; payload: Student }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_QUESTIONS"; payload: Question[] }
  | { type: "SET_ANSWERS"; payload: Answer[] }
  | { type: "SET_CURRENT_QUESTION_INDEX"; payload: number }
  | { type: "SELECT_OPTION"; payload: 0 | 1 | 2 | 3 | null }
  | { type: "SUBMIT_ANSWER"; payload: null }
  | { type: "NEXT_QUESTION"; payload: null }
  | { type: "START_QUIZ_DURATION"; payload: null }
  | { type: "FINISH_QUIZ"; payload: null };

interface StatisticsPayload {
  studentID: string | null;
  questionID: string;
  chosenAnswerID: string;
  isCorrect: boolean;
  timeToAnswer: number | null;
}

interface ResultsPayload {
  studentID: string | null;
  topicID: string;
}

// Counts the amount of seconds elasped. Used on each Quiz Question.
const useQuizTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return seconds;
};

const useQuizState = (initialState: QuizState) => {
  const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      
      case "SET_ERROR":
        return { ...state, error: action.payload };
      
      case "SET_STUDENT_INFO":
        return {
          ...state,
          studentInfo: {
            studentID: action.payload.studentID,
            name: action.payload.name,
            username: action.payload.username,
          },
        };
      
      case "SET_QUESTIONS":
        return { ...state, questions: action.payload };
      
      case "SET_ANSWERS":
        return {
          ...state,
          answers: action.payload,
          loading: false,
          startTime: Date.now(),
        };
      
      case "SET_CURRENT_QUESTION_INDEX":
        return { ...state, currentQuestionIndex: action.payload };
      
      case "SELECT_OPTION":
        return { ...state, selectedOptionIdx: action.payload };
      
      case "SUBMIT_ANSWER":
        if (state.selectedOptionIdx === null || state.startTime === null) {
          return state;
        }
        return {
          ...state,
          duration: Date.now() - state.startTime,
          score: state.answers[state.selectedOptionIdx].isCorrect
            ? state.score + 1
            : state.score,
          submitted: true,
        };
      
      case "NEXT_QUESTION":
        return {
          ...state,
          loading: true,
          answers: [],
          error: null,
          startTime: null,
          duration: null,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          selectedOptionIdx: null,
          submitted: false,
        };
      
      case "START_QUIZ_DURATION":
        return { ...state, quizDurationStart: Date.now() };
      
      case "FINISH_QUIZ":
        return { ...state, quizDurationEnd: Date.now() };
      
      default:
        return state;
    }
  };

  return useReducer(quizReducer, initialState);
};


const quizService = {
  async addStatistics(payload: StatisticsPayload): Promise<any> {
    try {
      const res = await fetch(API_ENDPOINTS.ADD_STATISTICS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-cache',
        credentials: 'include',
      });
      
      const resBody: APIResponse<any> = await res.json();
      return resBody.status === 400 ? false : resBody.data;
    } catch (error) {
      console.error('Error in addStatistics:', error);
      throw error;
    }
  },

  async processResults(payload: ResultsPayload): Promise<any> {
    try {
      const res = await fetch(API_ENDPOINTS.PROCESS_RESULTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-cache',
        credentials: 'include',
      });
      
      const resBody: APIResponse<any> = await res.json();
      return resBody.status === 400 ? false : resBody.data;
    } catch (error) {
      console.error('Error in processResults:', error);
      throw error;
    }
  }
};

interface CodeBlockProps {
  code: string | null;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <pre className="bg-black p-4 px-8 rounded-lg flex-1 flex flex-col justify-center items-start overflow-y-scroll overflow-x-auto w-full">
      <code className="block javascript text-lg !bg-black !text-white w-full break-words whitespace-pre-wrap select-none !font-jetbrains-mono">
        {code}
      </code>
    </pre>
  );
};

const CodeBlockSection = ({ code }: { code: string }) => (
  <section className="h-full flex flex-col w-full gap-4 p-4">
    <TipAccordion />
    <CodeBlock code={code} />
  </section>
);

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  seconds: number;
}

const QuizHeader = ({ currentIndex, totalQuestions, seconds }: QuizHeaderProps) => (
  <div className="w-full flex flex-row flex-between">
    <div className="flex-1">
      <h4 className="text-slate-700 text-xl font-bold font-jetbrains-mono">
        Recursion
      </h4>
      <h1 className="text-3xl text-black font-bold font-jetbrains-mono">
        QUESTION{" "}
        <span className="text-[40px]">
          {(currentIndex + 1).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </span>
        <span className="text-slate-700">/{totalQuestions}</span>
      </h1>
    </div>
    <div
      id="secondsCounter"
      className="text-xl text-black font-normal border-2 w-fit h-fit border-black p-2 rounded-full"
    >
      {seconds}
    </div>
  </div>
);

interface QuizContentProps {
  quizState: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

interface QuizButtonStyles {
  backgroundColor: string;
  hoverColor: string;
}

const getQuizButtonStyles = (
  isSubmitted: boolean,
  selectedAnswer: Answer | null
): QuizButtonStyles => {
  const defaultStyles = {
    backgroundColor: '#0185FF',
    hoverColor: '#1a91ff'
  };

  if (!isSubmitted || !selectedAnswer) {
    return defaultStyles;
  }

  return selectedAnswer.isCorrect
    ? {
        backgroundColor: '#70c678',
        hoverColor: '#5ebf67'
      }
    : defaultStyles;
};

interface QuizContentProps {
  quizState: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContent = ({ quizState, dispatch }: QuizContentProps) => {
  const seconds = useQuizTimer();
  
  const handleSelectOption = (idx: 0 | 1 | 2 | 3 | null) => {
    dispatch({ type: "SELECT_OPTION", payload: idx });
  };

  const handleSubmit = () => {
    dispatch({ type: "SUBMIT_ANSWER", payload: null });
  };

  const onContinue = () => {
    if (quizState.submitted && quizState.currentQuestionIndex < QUESTIONS_PER_QUIZ) {
      dispatch({ type: "NEXT_QUESTION", payload: null });
    }
  };

  const selectedAnswer = quizState.selectedOptionIdx !== null 
    ? quizState.answers[quizState.selectedOptionIdx] 
    : null;

  const buttonStyles = getQuizButtonStyles(quizState.submitted, selectedAnswer);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return (
    <section className="p-2 flex-1 flex flex-col">
      <section className="flex flex-row justify-evenly flex-1">
        {currentQuestion.code && <CodeBlockSection code={currentQuestion.code} />}
        <section className="w-full h-full flex flex-col p-6 rounded-lg bg-[#f1f1f7]">
          <QuizHeader
            currentIndex={quizState.currentQuestionIndex}
            totalQuestions={quizState.questions.length}
            seconds={seconds}
          />
          <ProgressBar
            size={quizState.questions.length}
            currentIdx={quizState.currentQuestionIndex}
          />
          <h2 className="text-black text-3xl font-bold font-jetbrains-mono py-4">
            {currentQuestion.question}
          </h2>
          <section 
            className="w-full h-full flex flex-col justify-between overflow-y-scroll"
            style={{
              '--bg-color': buttonStyles.backgroundColor,
              '--hover-color': buttonStyles.hoverColor,
              '--gap': '0.5rem'
            } as React.CSSProperties}
          >
            <div className="w-full overflow-y-scroll flex flex-col gap-4">
              {quizState.answers.map((answer, answerIdx) => (
                <QuizOption
                  key={answerIdx}
                  answerIdx={answerIdx as 0 | 1 | 2 | 3}
                  answerText={answer.answerDescription}
                  handleSelectOption={handleSelectOption}
                  isSelectedAnswer={quizState.selectedOptionIdx === answerIdx}
                  answerExplanation={answer.answerExplanation}
                  blockChange={quizState.submitted}
                  isCorrectChoice={answer.isCorrect}
                />
              ))}
            </div>
            <div className="flex flex-row w-full gap-4">
              {!quizState.submitted ? (
                <button
                  className="font-jetbrains-mono w-full bg-[#0185FF] hover:bg-[#1c90fc] p-4 rounded-[10px] shadow border-black font-semibold text-white text-xl flex-1"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              ) : (
                <>
                  <button
                    className="font-jetbrains-mono bg-[#0185FF] hover:bg-[#1c90fc] p-4 rounded-[10px] shadow border-black font-semibold text-white text-xl flex-1"
                    onClick={onContinue}
                  >
                    Continue
                  </button>
                  <button
                    className="font-jetbrains-mono p-4 rounded-[10px] shadow border-black font-semibold text-white text-xl cursor-not-allowed bg-[#dc2626]"
                  >
                    <i className="ri-flag-fill"></i>
                  </button>
                </>
              )}
            </div>
          </section>
        </section>
      </section>
    </section>
  );
};

function Questionnaire({ params }: { params: { slug: string } }) {
  const router = useRouter();
  
  hljs.registerLanguage("javascript", javascript);
  
  const initialState: QuizState = {
    loading: true,
    error: null,
    score: 0,
    startTime: null,
    duration: null,
    quizDurationStart: null,
    quizDurationEnd: null,
    studentInfo: {
      studentID: null,
      name: null,
      username: null,
    },
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    selectedOptionIdx: null,
    submitted: false,
  };

  const [quizState, dispatch] = useQuizState(initialState);

  const handleAuthFailure = () => {
    Cookies.remove("token");
    router.push("/user-auth");
  };

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const studentInfo = await verifyJWT(true);
        if (!studentInfo || typeof studentInfo !== 'string') {
          handleAuthFailure();
          return;
        }

        const student: Student = JSON.parse(studentInfo);
        dispatch({ type: "SET_STUDENT_INFO", payload: student });
        
        const questions = await fetchQuestions(student.studentID, params.slug);
        dispatch({ type: "SET_QUESTIONS", payload: questions });
        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error as string });
      }
    };

    initializeQuiz();
  }, []);

useEffect(() => {
  const fetchQuestionAnswers = async () => {
    if (quizState.questions.length !== QUESTIONS_PER_QUIZ) {
      dispatch({
        type: "SET_ERROR",
        payload: "Questions array has not been initialized yet.",
      });
      return;
    }

    if (quizState.currentQuestionIndex >= QUESTIONS_PER_QUIZ) {
      dispatch({ type: "FINISH_QUIZ", payload: null });
      return;
    }

    try {
      const answers = await fetchAnswers(
        quizState.questions[quizState.currentQuestionIndex].questionID
      );
      dispatch({ type: "SET_ANSWERS", payload: answers });
      
      if (quizState.currentQuestionIndex === 0) {
        dispatch({ type: "START_QUIZ_DURATION", payload: null });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: `Error fetching answers: ${error}`,
      });
    }
  };

  fetchQuestionAnswers();
}, [quizState.questions, quizState.currentQuestionIndex]);

useEffect(() => {
  const submitStatistics = async () => {
    if (!quizState.submitted) return;
    
    try {
      if (
        !quizState.questions ||
        !quizState.answers ||
        quizState.selectedOptionIdx === null
      ) {
        throw new Error("Missing required values for statistics submission");
      }

      const statisticsPayload: StatisticsPayload = {
        studentID: quizState.studentInfo.studentID,
        questionID: quizState.questions[quizState.currentQuestionIndex].questionID,
        chosenAnswerID: quizState.answers[quizState.selectedOptionIdx].answerID,
        isCorrect: quizState.answers[quizState.selectedOptionIdx].isCorrect,
        timeToAnswer: quizState.duration,
      };

      await quizService.addStatistics(statisticsPayload);
    } catch (error) {
      console.error("Failed to submit statistics:", error);
    }
  };

  submitStatistics();
}, [quizState.submitted]);

useEffect(() => {
  const processQuizResults = async () => {
    if (!quizState.quizDurationEnd) return;

    try {
      const resultsPayload: ResultsPayload = {
        studentID: quizState.studentInfo.studentID,
        topicID: params.slug,
      };

      await quizService.processResults(resultsPayload);
    } catch (error) {
      console.error("Failed to process quiz results:", error);
    }
  };

  processQuizResults();
}, [quizState.quizDurationEnd]);

useEffect(() => {
  const verifyToken = async () => {
    const isValid = await verifyJWT();
    if (!isValid) {
      handleAuthFailure();
    }
  };

  if (quizState.submitted) {
    verifyToken();
  }
}, [quizState.submitted]);

if (quizState.loading && !quizState.quizDurationEnd) {
  return <Loading />;
}

if (quizState.quizDurationEnd) {
  return (
    <Results
      topicID={params.slug}
      score={quizState.score}
      duration={quizState.quizDurationEnd - quizState.quizDurationStart!}
    />
  );
}

return (
  <main className="bg-white h-screen w-screen p-6 overflow-y-scroll flex flex-col">
    <section className="flex-1 flex flex-col">
      <ULearnLogo />
      <QuizContent 
        quizState={quizState} 
        dispatch={dispatch}
      />
    </section>
  </main>
);
}

export default Questionnaire;
