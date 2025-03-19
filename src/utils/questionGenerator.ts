
import { Question } from '@/contexts/TestContext';

export const generateDefaultQuestions = (): Question[] => {
  const categories = ['coding', 'math', 'aptitude', 'communication'] as const;
  
  const questions: Question[] = [];
  
  // Coding Questions
  questions.push(
    {
      id: 'coding-1',
      text: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Multi Language',
        'Hyper Transfer Markup Language',
        'Home Tool Markup Language'
      ],
      answer: 'Hyper Text Markup Language',
      category: 'coding',
    },
    {
      id: 'coding-2',
      text: 'Which of the following is not a programming language?',
      options: [
        'Java',
        'Python',
        'HTML',
        'C++'
      ],
      answer: 'HTML',
      category: 'coding',
    },
    {
      id: 'coding-3',
      text: 'What symbol is used for single-line comments in JavaScript?',
      options: [
        '//',
        '/* */',
        '#',
        '--'
      ],
      answer: '//',
      category: 'coding',
    },
    {
      id: 'coding-4',
      text: 'Which method is used to add an element at the end of an array in JavaScript?',
      options: [
        'push()',
        'append()',
        'add()',
        'insert()'
      ],
      answer: 'push()',
      category: 'coding',
    },
    {
      id: 'coding-5',
      text: 'What is the correct way to write a function in JavaScript?',
      options: [
        'function myFunction() {}',
        'def myFunction() {}',
        'function = myFunction() {}',
        'function:myFunction() {}'
      ],
      answer: 'function myFunction() {}',
      category: 'coding',
    }
  );
  
  // Math Questions
  questions.push(
    {
      id: 'math-1',
      text: 'What is the value of π (pi) to two decimal places?',
      options: [
        '3.14',
        '3.16',
        '3.12',
        '3.18'
      ],
      answer: '3.14',
      category: 'math',
    },
    {
      id: 'math-2',
      text: 'Solve for x: 2x + 5 = 15',
      options: [
        'x = 5',
        'x = 10',
        'x = 7.5',
        'x = 3'
      ],
      answer: 'x = 5',
      category: 'math',
    },
    {
      id: 'math-3',
      text: 'What is the derivative of x²?',
      options: [
        '2x',
        'x',
        '2',
        'x²'
      ],
      answer: '2x',
      category: 'math',
    },
    {
      id: 'math-4',
      text: 'If a triangle has angles measuring 30°, 60°, and 90°, what type of triangle is it?',
      options: [
        'Right-angled triangle',
        'Equilateral triangle',
        'Isosceles triangle',
        'Obtuse triangle'
      ],
      answer: 'Right-angled triangle',
      category: 'math',
    },
    {
      id: 'math-5',
      text: 'What is the area of a circle with radius 4cm?',
      options: [
        '16π cm²',
        '8π cm²',
        '4π cm²',
        '12π cm²'
      ],
      answer: '16π cm²',
      category: 'math',
    }
  );
  
  // Aptitude Questions
  questions.push(
    {
      id: 'aptitude-1',
      text: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
      options: [
        '5 minutes',
        '100 minutes',
        '20 minutes',
        '1 minute'
      ],
      answer: '5 minutes',
      category: 'aptitude',
    },
    {
      id: 'aptitude-2',
      text: 'A train travels at a speed of 60 km/hr. How long will it take to cover a distance of 300 km?',
      options: [
        '5 hours',
        '4 hours',
        '6 hours',
        '3 hours'
      ],
      answer: '5 hours',
      category: 'aptitude',
    },
    {
      id: 'aptitude-3',
      text: 'If 8 people can complete a work in 6 days, how many people are required to complete the same work in 4 days?',
      options: [
        '12 people',
        '10 people',
        '16 people',
        '6 people'
      ],
      answer: '12 people',
      category: 'aptitude',
    },
    {
      id: 'aptitude-4',
      text: 'The average of 5 consecutive numbers is 15. What is the largest number?',
      options: [
        '17',
        '16',
        '15',
        '19'
      ],
      answer: '17',
      category: 'aptitude',
    },
    {
      id: 'aptitude-5',
      text: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest?',
      options: [
        '12.5%',
        '10%',
        '8%',
        '15%'
      ],
      answer: '12.5%',
      category: 'aptitude',
    }
  );
  
  // Communication Questions
  questions.push(
    {
      id: 'communication-1',
      text: 'Which of the following is not a form of non-verbal communication?',
      options: [
        'Email',
        'Facial expressions',
        'Posture',
        'Gestures'
      ],
      answer: 'Email',
      category: 'communication',
    },
    {
      id: 'communication-2',
      text: 'What is active listening?',
      options: [
        'Fully concentrating on the speaker and responding appropriately',
        'Listening while doing other activities',
        'Responding with your opinion immediately',
        'Taking notes on everything said'
      ],
      answer: 'Fully concentrating on the speaker and responding appropriately',
      category: 'communication',
    },
    {
      id: 'communication-3',
      text: 'What does the abbreviation "CC" mean in email communication?',
      options: [
        'Carbon Copy',
        'Courtesy Copy',
        'Confidential Communication',
        'Content Copy'
      ],
      answer: 'Carbon Copy',
      category: 'communication',
    },
    {
      id: 'communication-4',
      text: 'Which of the following is not a characteristic of effective communication?',
      options: [
        'Using complex vocabulary to impress the audience',
        'Being clear and concise',
        'Active listening',
        'Providing feedback'
      ],
      answer: 'Using complex vocabulary to impress the audience',
      category: 'communication',
    },
    {
      id: 'communication-5',
      text: 'Which communication channel is most appropriate for delivering sensitive feedback?',
      options: [
        'In-person meeting',
        'Group email',
        'Text message',
        'Public announcement'
      ],
      answer: 'In-person meeting',
      category: 'communication',
    }
  );
  
  return questions;
};
