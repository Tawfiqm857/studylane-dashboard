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

// Mock test data - 10 questions per subject for better learning
const mockTests: Test[] = [
  {
    id: 'html-basics',
    title: 'HTML Fundamentals',
    subject: 'HTML',
    description: 'Test your knowledge of HTML basics, elements, and structure with 10 essential questions.',
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language.'
      },
      {
        id: 'q2',
        question: 'Which HTML element is used to define the structure of an HTML document?',
        options: ['<body>', '<html>', '<head>', '<div>'],
        correctAnswer: 1,
        explanation: 'The <html> element is the root element that contains all other HTML elements.'
      },
      {
        id: 'q3',
        question: 'Which HTML element is used for the largest heading?',
        options: ['<h6>', '<h1>', '<header>', '<heading>'],
        correctAnswer: 1,
        explanation: 'The <h1> element represents the largest/most important heading.'
      },
      {
        id: 'q4',
        question: 'Which HTML element is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: 1,
        explanation: 'The <a> (anchor) element is used to create hyperlinks.'
      },
      {
        id: 'q5',
        question: 'Which attribute is used to specify the URL in a hyperlink?',
        options: ['src', 'link', 'href', 'url'],
        correctAnswer: 2,
        explanation: 'The href attribute specifies the URL that the link goes to.'
      },
      {
        id: 'q6',
        question: 'Which HTML element is used to display an image?',
        options: ['<image>', '<img>', '<picture>', '<photo>'],
        correctAnswer: 1,
        explanation: 'The <img> element is used to embed images in HTML documents.'
      },
      {
        id: 'q7',
        question: 'Which HTML element creates a line break?',
        options: ['<break>', '<br>', '<lb>', '<newline>'],
        correctAnswer: 1,
        explanation: 'The <br> element creates a line break in HTML.'
      },
      {
        id: 'q8',
        question: 'Which HTML attribute specifies alternative text for an image?',
        options: ['title', 'alt', 'description', 'caption'],
        correctAnswer: 1,
        explanation: 'The alt attribute provides alternative text for images, important for accessibility.'
      },
      {
        id: 'q9',
        question: 'Which HTML element is used to create an unordered list?',
        options: ['<ol>', '<ul>', '<list>', '<items>'],
        correctAnswer: 1,
        explanation: 'The <ul> element creates an unordered (bulleted) list.'
      },
      {
        id: 'q10',
        question: 'Which HTML5 element is used for navigation links?',
        options: ['<navigation>', '<nav>', '<menu>', '<links>'],
        correctAnswer: 1,
        explanation: 'The <nav> element is used to define navigation links in HTML5.'
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling & Layout',
    subject: 'CSS',
    description: 'Evaluate your understanding of CSS properties, selectors, and layout techniques with 10 essential questions.',
    timeLimit: 15,
    questions: [
      // Easy (Questions 1-7)
      {
        id: 'q1',
        question: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets.'
      },
      {
        id: 'q2',
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2,
        explanation: 'The color property is used to set the color of text.'
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
      },
      {
        id: 'q6',
        question: 'Which CSS property sets the background color?',
        options: ['bg-color', 'background-color', 'color-background', 'background'],
        correctAnswer: 1,
        explanation: 'The background-color property sets the background color of an element.'
      },
      {
        id: 'q7',
        question: 'How do you select all elements with class "button"?',
        options: ['#button', '.button', '*button', 'button'],
        correctAnswer: 1,
        explanation: 'The . (dot) symbol is used to select elements by their class attribute.'
      },
      {
        id: 'q8',
        question: 'Which CSS property is used to create rounded corners?',
        options: ['corner-radius', 'border-radius', 'radius', 'round-corners'],
        correctAnswer: 1,
        explanation: 'The border-radius property creates rounded corners on elements.'
      },
      {
        id: 'q9',
        question: 'Which CSS property controls the transparency of an element?',
        options: ['transparency', 'opacity', 'alpha', 'visibility'],
        correctAnswer: 1,
        explanation: 'The opacity property controls the transparency level of an element.'
      },
      {
        id: 'q10',
        question: 'Which CSS property creates a grid container?',
        options: ['display: grid', 'grid-template', 'grid-container', 'layout: grid'],
        correctAnswer: 0,
        explanation: 'Setting display: grid creates a grid container.'
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    subject: 'JavaScript',
    description: 'Test your knowledge of JavaScript syntax, functions, and programming concepts with 10 essential questions.',
    timeLimit: 15,
    questions: [
      // Easy (Questions 1-7)
      {
        id: 'q1',
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All three keywords (var, let, const) can be used to declare variables, each with different scoping rules.'
      },
      {
        id: 'q2',
        question: 'How do you create a function in JavaScript?',
        options: ['function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'function = myFunction() {}'],
        correctAnswer: 0,
        explanation: 'Functions in JavaScript are declared using the function keyword followed by the function name.'
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
        question: 'What does the === operator do?',
        options: ['Assignment', 'Equality without type conversion', 'Equality with type conversion', 'Not equal'],
        correctAnswer: 1,
        explanation: 'The === operator checks for strict equality, comparing both value and type without type conversion.'
      },
      {
        id: 'q5',
        question: 'Which method is used to remove the last element from an array?',
        options: ['pop()', 'remove()', 'delete()', 'removeLast()'],
        correctAnswer: 0,
        explanation: 'The pop() method removes and returns the last element from an array.'
      },
      {
        id: 'q6',
        question: 'How do you write a comment in JavaScript?',
        options: ['# This is a comment', '// This is a comment', '<!-- This is a comment -->', '* This is a comment'],
        correctAnswer: 1,
        explanation: 'Single-line comments in JavaScript start with //.'
      },
      {
        id: 'q7',
        question: 'Which operator is used to concatenate strings in JavaScript?',
        options: ['+', '&', '*', 'concat'],
        correctAnswer: 0,
        explanation: 'The + operator is used to concatenate strings in JavaScript.'
      },
      {
        id: 'q8',
        question: 'What will console.log(typeof null) output?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correctAnswer: 2,
        explanation: 'This is a known quirk in JavaScript where typeof null returns "object".'
      },
      {
        id: 'q9',
        question: 'What is the result of 3 + "3" in JavaScript?',
        options: ['6', '33', 'Error', 'undefined'],
        correctAnswer: 1,
        explanation: 'JavaScript converts the number 3 to a string and concatenates, resulting in "33".'
      },
      {
        id: 'q10',
        question: 'What is a closure in JavaScript?',
        options: ['A way to close files', 'A function with access to its outer scope', 'A type of loop', 'A way to end programs'],
        correctAnswer: 1,
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.'
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