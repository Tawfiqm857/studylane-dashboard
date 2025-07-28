import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  subject: 'HTML' | 'CSS' | 'JavaScript';
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
}

export interface TestAttempt {
  testId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  completedAt: Date;
}

export interface TestProgress {
  testId: string;
  attempts: number;
  bestScore: number;
  lastAttemptDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface TestContextType {
  tests: Test[];
  testProgress: Record<string, TestProgress>;
  currentTest: Test | null;
  currentAnswers: Record<string, number>;
  startTest: (testId: string) => void;
  submitAnswer: (questionId: string, answer: number) => void;
  submitTest: () => TestAttempt | null;
  resetCurrentTest: () => void;
  getTestProgress: (testId: string) => TestProgress;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

// Mock test data
const mockTests: Test[] = [
  {
    id: 'html-basics',
    title: 'HTML Fundamentals',
    subject: 'HTML',
    description: 'Test your knowledge of HTML basics, elements, and structure.',
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'Which HTML element is used to define the structure of an HTML document?',
        options: ['<body>', '<html>', '<head>', '<div>'],
        correctAnswer: 1,
        explanation: 'The <html> element is the root element that contains all other HTML elements.'
      },
      {
        id: 'q2',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language.'
      },
      {
        id: 'q3',
        question: 'Which HTML element is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: 1,
        explanation: 'The <a> (anchor) element is used to create hyperlinks.'
      },
      {
        id: 'q4',
        question: 'Which attribute is used to specify the URL in a hyperlink?',
        options: ['src', 'link', 'href', 'url'],
        correctAnswer: 2,
        explanation: 'The href attribute specifies the URL that the link goes to.'
      },
      {
        id: 'q5',
        question: 'Which HTML element is used for the largest heading?',
        options: ['<h6>', '<h1>', '<header>', '<heading>'],
        correctAnswer: 1,
        explanation: 'The <h1> element represents the largest/most important heading.'
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling & Layout',
    subject: 'CSS',
    description: 'Evaluate your understanding of CSS properties, selectors, and layout techniques.',
    timeLimit: 20,
    questions: [
      {
        id: 'q1',
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2,
        explanation: 'The color property is used to set the color of text.'
      },
      {
        id: 'q2',
        question: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets.'
      },
      {
        id: 'q3',
        question: 'Which CSS property is used to make text bold?',
        options: ['font-weight', 'text-weight', 'font-style', 'text-style'],
        correctAnswer: 0,
        explanation: 'The font-weight property is used to make text bold or specify the weight of the font.'
      },
      {
        id: 'q4',
        question: 'How do you select an element with id "header" in CSS?',
        options: ['.header', '#header', '*header', 'header'],
        correctAnswer: 1,
        explanation: 'The # symbol is used to select elements by their id attribute.'
      },
      {
        id: 'q5',
        question: 'Which CSS property is used to control the spacing between elements?',
        options: ['spacing', 'margin', 'padding', 'border'],
        correctAnswer: 1,
        explanation: 'The margin property controls the space around elements (outside the border).'
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    subject: 'JavaScript',
    description: 'Test your knowledge of JavaScript syntax, functions, and basic programming concepts.',
    timeLimit: 25,
    questions: [
      {
        id: 'q1',
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All three keywords (var, let, const) can be used to declare variables, each with different scoping rules.'
      },
      {
        id: 'q2',
        question: 'What will console.log(typeof null) output?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correctAnswer: 2,
        explanation: 'This is a known quirk in JavaScript where typeof null returns "object".'
      },
      {
        id: 'q3',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'add()', 'append()', 'insert()'],
        correctAnswer: 0,
        explanation: 'The push() method adds one or more elements to the end of an array.'
      },
      {
        id: 'q4',
        question: 'How do you create a function in JavaScript?',
        options: ['function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'function = myFunction() {}'],
        correctAnswer: 0,
        explanation: 'Functions in JavaScript are declared using the function keyword followed by the function name.'
      },
      {
        id: 'q5',
        question: 'What does the === operator do?',
        options: ['Assignment', 'Equality without type conversion', 'Equality with type conversion', 'Not equal'],
        correctAnswer: 1,
        explanation: 'The === operator checks for strict equality, comparing both value and type without type conversion.'
      }
    ]
  }
];

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests] = useState<Test[]>(mockTests);
  const [testProgress, setTestProgress] = useState<Record<string, TestProgress>>({});
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load test progress from localStorage
    const savedProgress = localStorage.getItem('student-test-progress');
    if (savedProgress) {
      setTestProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all tests
      const initialProgress: Record<string, TestProgress> = {};
      mockTests.forEach(test => {
        initialProgress[test.id] = {
          testId: test.id,
          attempts: 0,
          bestScore: 0,
          status: 'not-started'
        };
      });
      setTestProgress(initialProgress);
    }
  }, []);

  const startTest = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      setCurrentTest(test);
      setCurrentAnswers({});
    }
  };

  const submitAnswer = (questionId: string, answer: number) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = (): TestAttempt | null => {
    if (!currentTest) return null;

    let correctAnswers = 0;
    currentTest.questions.forEach(question => {
      if (currentAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / currentTest.questions.length) * 100);
    
    const attempt: TestAttempt = {
      testId: currentTest.id,
      score,
      totalQuestions: currentTest.questions.length,
      answers: currentAnswers,
      completedAt: new Date()
    };

    // Update progress
    const newProgress = { ...testProgress };
    const currentProgress = newProgress[currentTest.id] || {
      testId: currentTest.id,
      attempts: 0,
      bestScore: 0,
      status: 'not-started' as const
    };

    newProgress[currentTest.id] = {
      ...currentProgress,
      attempts: currentProgress.attempts + 1,
      bestScore: Math.max(currentProgress.bestScore, score),
      lastAttemptDate: new Date(),
      status: 'completed'
    };

    setTestProgress(newProgress);
    localStorage.setItem('student-test-progress', JSON.stringify(newProgress));

    return attempt;
  };

  const resetCurrentTest = () => {
    setCurrentTest(null);
    setCurrentAnswers({});
  };

  const getTestProgress = (testId: string): TestProgress => {
    return testProgress[testId] || {
      testId,
      attempts: 0,
      bestScore: 0,
      status: 'not-started'
    };
  };

  const value = {
    tests,
    testProgress,
    currentTest,
    currentAnswers,
    startTest,
    submitAnswer,
    submitTest,
    resetCurrentTest,
    getTestProgress
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};