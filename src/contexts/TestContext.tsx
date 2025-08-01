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

// Mock test data with comprehensive questions
const mockTests: Test[] = [
  {
    id: 'html-basics',
    title: 'HTML Fundamentals',
    subject: 'HTML',
    description: 'Test your knowledge of HTML basics, elements, and structure with 20 comprehensive questions.',
    timeLimit: 30,
    questions: [
      // Easy (Questions 1-7)
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
      // Intermediate (Questions 8-14)
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
        question: 'Which HTML element is used to group table rows?',
        options: ['<tbody>', '<tgroup>', '<rows>', '<tablegroup>'],
        correctAnswer: 0,
        explanation: 'The <tbody> element groups table body content together.'
      },
      {
        id: 'q11',
        question: 'Which HTML5 element is used for navigation links?',
        options: ['<navigation>', '<nav>', '<menu>', '<links>'],
        correctAnswer: 1,
        explanation: 'The <nav> element is used to define navigation links in HTML5.'
      },
      {
        id: 'q12',
        question: 'Which attribute makes an input field required?',
        options: ['mandatory', 'required', 'needed', 'must'],
        correctAnswer: 1,
        explanation: 'The required attribute makes an input field mandatory to fill out.'
      },
      {
        id: 'q13',
        question: 'Which HTML element represents self-contained content?',
        options: ['<section>', '<article>', '<div>', '<content>'],
        correctAnswer: 1,
        explanation: 'The <article> element represents self-contained, independently distributable content.'
      },
      {
        id: 'q14',
        question: 'Which input type is used for email addresses?',
        options: ['text', 'email', 'mail', 'address'],
        correctAnswer: 1,
        explanation: 'The email input type provides validation for email addresses.'
      },
      // Advanced (Questions 15-20)
      {
        id: 'q15',
        question: 'Which attribute is used to specify the character encoding of an HTML document?',
        options: ['encoding', 'charset', 'character-set', 'encode'],
        correctAnswer: 1,
        explanation: 'The charset attribute in the <meta> tag specifies the character encoding.'
      },
      {
        id: 'q16',
        question: 'Which HTML5 element is used for drawing graphics via scripting?',
        options: ['<svg>', '<canvas>', '<graphics>', '<draw>'],
        correctAnswer: 1,
        explanation: 'The <canvas> element is used for drawing graphics via JavaScript.'
      },
      {
        id: 'q17',
        question: 'Which attribute controls the tab order of elements?',
        options: ['tab', 'tabindex', 'order', 'focus'],
        correctAnswer: 1,
        explanation: 'The tabindex attribute specifies the tab order of elements.'
      },
      {
        id: 'q18',
        question: 'Which HTML element is used to define client-side scripts?',
        options: ['<javascript>', '<script>', '<code>', '<js>'],
        correctAnswer: 1,
        explanation: 'The <script> element is used to define client-side scripts.'
      },
      {
        id: 'q19',
        question: 'Which attribute specifies the relationship between the current document and the linked document?',
        options: ['relationship', 'rel', 'link-type', 'connection'],
        correctAnswer: 1,
        explanation: 'The rel attribute specifies the relationship between documents.'
      },
      {
        id: 'q20',
        question: 'Which HTML5 feature allows offline web applications?',
        options: ['Local Storage', 'Application Cache', 'Service Workers', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Local Storage, Application Cache, and Service Workers all enable offline functionality.'
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling & Layout',
    subject: 'CSS',
    description: 'Evaluate your understanding of CSS properties, selectors, and layout techniques with 20 comprehensive questions.',
    timeLimit: 35,
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
      // Intermediate (Questions 8-14)
      {
        id: 'q8',
        question: 'Which CSS property is used to create rounded corners?',
        options: ['corner-radius', 'border-radius', 'radius', 'round-corners'],
        correctAnswer: 1,
        explanation: 'The border-radius property creates rounded corners on elements.'
      },
      {
        id: 'q9',
        question: 'Which CSS display value makes an element behave like a table?',
        options: ['table', 'table-cell', 'table-row', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All these values make elements behave like different table components.'
      },
      {
        id: 'q10',
        question: 'Which CSS property controls the transparency of an element?',
        options: ['transparency', 'opacity', 'alpha', 'visibility'],
        correctAnswer: 1,
        explanation: 'The opacity property controls the transparency level of an element.'
      },
      {
        id: 'q11',
        question: 'Which CSS property is used to create CSS animations?',
        options: ['animate', 'animation', 'keyframes', 'motion'],
        correctAnswer: 1,
        explanation: 'The animation property is used to apply CSS animations to elements.'
      },
      {
        id: 'q12',
        question: 'What is the default position value for HTML elements?',
        options: ['relative', 'absolute', 'static', 'fixed'],
        correctAnswer: 2,
        explanation: 'The default position value is static, which means normal document flow.'
      },
      {
        id: 'q13',
        question: 'Which CSS property is used to control the order of flexible items?',
        options: ['flex-order', 'order', 'flex-sequence', 'arrangement'],
        correctAnswer: 1,
        explanation: 'The order property controls the order of flex items.'
      },
      {
        id: 'q14',
        question: 'Which CSS unit is relative to the font-size of the root element?',
        options: ['em', 'rem', 'px', 'vh'],
        correctAnswer: 1,
        explanation: 'rem (root em) is relative to the font-size of the root element.'
      },
      // Advanced (Questions 15-20)
      {
        id: 'q15',
        question: 'Which CSS property creates a grid container?',
        options: ['display: grid', 'grid-template', 'grid-container', 'layout: grid'],
        correctAnswer: 0,
        explanation: 'Setting display: grid creates a grid container.'
      },
      {
        id: 'q16',
        question: 'What does the CSS calc() function do?',
        options: ['Calculates element size', 'Performs mathematical calculations', 'Calculates color values', 'Calculates animation timing'],
        correctAnswer: 1,
        explanation: 'The calc() function performs mathematical calculations for CSS values.'
      },
      {
        id: 'q17',
        question: 'Which CSS selector targets the first child element?',
        options: [':first', ':first-child', ':child-first', ':nth-child(1)'],
        correctAnswer: 1,
        explanation: 'The :first-child selector targets the first child element.'
      },
      {
        id: 'q18',
        question: 'What is the difference between display: none and visibility: hidden?',
        options: ['No difference', 'display: none removes from layout, visibility: hidden preserves space', 'visibility: hidden removes from layout', 'Both preserve layout space'],
        correctAnswer: 1,
        explanation: 'display: none removes the element from the layout, while visibility: hidden hides it but preserves its space.'
      },
      {
        id: 'q19',
        question: 'Which CSS property controls the stacking order of elements?',
        options: ['layer', 'z-index', 'stack-order', 'depth'],
        correctAnswer: 1,
        explanation: 'The z-index property controls the stacking order of positioned elements.'
      },
      {
        id: 'q20',
        question: 'What does the CSS property "box-sizing: border-box" do?',
        options: ['Includes padding and border in element width/height', 'Excludes padding and border', 'Only includes border', 'Only includes padding'],
        correctAnswer: 0,
        explanation: 'border-box includes padding and border in the element\'s total width and height.'
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    subject: 'JavaScript',
    description: 'Test your knowledge of JavaScript syntax, functions, and programming concepts with 20 comprehensive questions.',
    timeLimit: 40,
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
      // Intermediate (Questions 8-14)
      {
        id: 'q8',
        question: 'What will console.log(typeof null) output?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correctAnswer: 2,
        explanation: 'This is a known quirk in JavaScript where typeof null returns "object".'
      },
      {
        id: 'q9',
        question: 'Which method converts a string to an integer?',
        options: ['parseInt()', 'toInteger()', 'convertInt()', 'stringToInt()'],
        correctAnswer: 0,
        explanation: 'The parseInt() method parses a string and returns an integer.'
      },
      {
        id: 'q10',
        question: 'What is the result of 3 + "3" in JavaScript?',
        options: ['6', '33', 'Error', 'undefined'],
        correctAnswer: 1,
        explanation: 'JavaScript converts the number 3 to a string and concatenates, resulting in "33".'
      },
      {
        id: 'q11',
        question: 'Which method is used to find an element in an array?',
        options: ['search()', 'find()', 'locate()', 'get()'],
        correctAnswer: 1,
        explanation: 'The find() method returns the first element that satisfies the provided testing function.'
      },
      {
        id: 'q12',
        question: 'What is the scope of a variable declared with let?',
        options: ['Global', 'Function', 'Block', 'Module'],
        correctAnswer: 2,
        explanation: 'Variables declared with let have block scope.'
      },
      {
        id: 'q13',
        question: 'Which method is used to execute a function after a specified delay?',
        options: ['delay()', 'setTimeout()', 'wait()', 'pause()'],
        correctAnswer: 1,
        explanation: 'setTimeout() executes a function after a specified delay in milliseconds.'
      },
      {
        id: 'q14',
        question: 'What does the isNaN() function do?',
        options: ['Checks if a value is null', 'Checks if a value is not a number', 'Checks if a value is undefined', 'Checks if a value is negative'],
        correctAnswer: 1,
        explanation: 'The isNaN() function determines whether a value is NaN (Not a Number).'
      },
      // Advanced (Questions 15-20)
      {
        id: 'q15',
        question: 'What is a closure in JavaScript?',
        options: ['A way to close files', 'A function with access to its outer scope', 'A type of loop', 'A way to end programs'],
        correctAnswer: 1,
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.'
      },
      {
        id: 'q16',
        question: 'What does the spread operator (...) do?',
        options: ['Spreads elements of an iterable', 'Creates multiple variables', 'Loops through arrays', 'Defines multiple functions'],
        correctAnswer: 0,
        explanation: 'The spread operator expands elements of an iterable (like an array) into individual elements.'
      },
      {
        id: 'q17',
        question: 'What is the difference between == and === in JavaScript?',
        options: ['No difference', '== compares values, === compares values and types', '=== is faster', '== is deprecated'],
        correctAnswer: 1,
        explanation: '== performs type coercion while === checks for strict equality without type conversion.'
      },
      {
        id: 'q18',
        question: 'What is event bubbling in JavaScript?',
        options: ['Creating bubble animations', 'Events propagating up the DOM tree', 'Sorting events by priority', 'Delaying event execution'],
        correctAnswer: 1,
        explanation: 'Event bubbling is when an event propagates from the target element up through its ancestors in the DOM tree.'
      },
      {
        id: 'q19',
        question: 'What does the Promise.all() method do?',
        options: ['Executes all promises sequentially', 'Waits for all promises to resolve', 'Cancels all promises', 'Creates multiple promises'],
        correctAnswer: 1,
        explanation: 'Promise.all() waits for all promises to resolve and returns an array of their results.'
      },
      {
        id: 'q20',
        question: 'What is the purpose of the "use strict" directive?',
        options: ['Makes code run faster', 'Enables strict mode with stricter error checking', 'Minifies code', 'Enables new JavaScript features'],
        correctAnswer: 1,
        explanation: '"use strict" enables strict mode, which catches common coding mistakes and prevents certain actions.'
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