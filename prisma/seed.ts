import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashAnswer(answer: string): string {
  return crypto.createHash('sha256').update(answer.toLowerCase().trim()).digest('hex');
}

const questions = [
  {
    difficulty: 0,
    prompt: 'Which number comes after 1?',
    choices: ['0', '1', '2', '3'],
    correctAnswer: '2',
    tags: ['math', 'starter'],
  },
  {
    difficulty: 0,
    prompt: 'What color are bananas when ripe?',
    choices: ['Blue', 'Yellow', 'Black', 'Purple'],
    correctAnswer: 'Yellow',
    tags: ['general', 'starter'],
  },
  {
    difficulty: 0,
    prompt: 'How many letters are in the word "cat"?',
    choices: ['2', '3', '4', '5'],
    correctAnswer: '3',
    tags: ['language', 'starter'],
  },
  {
    difficulty: 1,
    prompt: 'What is 2 + 2?',
    choices: ['3', '4', '5', '6'],
    correctAnswer: '4',
    tags: ['math', 'basic'],
  },
  {
    difficulty: 1,
    prompt: 'What color is the sky on a clear day?',
    choices: ['Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 'Blue',
    tags: ['general', 'easy'],
  },
  {
    difficulty: 1,
    prompt: 'How many days are in a week?',
    choices: ['5', '6', '7', '8'],
    correctAnswer: '7',
    tags: ['general', 'basic'],
  },
  {
    difficulty: 2,
    prompt: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
    tags: ['geography', 'europe'],
  },
  {
    difficulty: 2,
    prompt: 'What is 15 × 3?',
    choices: ['35', '45', '55', '65'],
    correctAnswer: '45',
    tags: ['math', 'multiplication'],
  },
  {
    difficulty: 2,
    prompt: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    tags: ['science', 'astronomy'],
  },
  {
    difficulty: 3,
    prompt: 'Who wrote "Romeo and Juliet"?',
    choices: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 'William Shakespeare',
    tags: ['literature', 'classics'],
  },
  {
    difficulty: 3,
    prompt: 'What is the square root of 144?',
    choices: ['10', '11', '12', '13'],
    correctAnswer: '12',
    tags: ['math', 'algebra'],
  },
  {
    difficulty: 3,
    prompt: 'In which year did World War II end?',
    choices: ['1943', '1944', '1945', '1946'],
    correctAnswer: '1945',
    tags: ['history', 'world-war'],
  },
  {
    difficulty: 4,
    prompt: 'What is the chemical symbol for gold?',
    choices: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 'Au',
    tags: ['science', 'chemistry'],
  },
  {
    difficulty: 4,
    prompt: 'Which programming language is known for its use in data science?',
    choices: ['Java', 'Python', 'C++', 'Ruby'],
    correctAnswer: 'Python',
    tags: ['technology', 'programming'],
  },
  {
    difficulty: 4,
    prompt: 'What is the largest ocean on Earth?',
    choices: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 'Pacific',
    tags: ['geography', 'oceans'],
  },
  {
    difficulty: 5,
    prompt: 'What is the speed of light in vacuum (approximately)?',
    choices: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
    correctAnswer: '300,000 km/s',
    tags: ['science', 'physics'],
  },
  {
    difficulty: 5,
    prompt: 'Who painted the Mona Lisa?',
    choices: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correctAnswer: 'Leonardo da Vinci',
    tags: ['art', 'renaissance'],
  },
  {
    difficulty: 5,
    prompt: 'What is the time complexity of binary search?',
    choices: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    tags: ['computer-science', 'algorithms'],
  },
  {
    difficulty: 6,
    prompt: 'What is the Heisenberg Uncertainty Principle related to?',
    choices: ['Thermodynamics', 'Quantum Mechanics', 'Relativity', 'Electromagnetism'],
    correctAnswer: 'Quantum Mechanics',
    tags: ['science', 'physics', 'quantum'],
  },
  {
    difficulty: 6,
    prompt: 'In which year was the first iPhone released?',
    choices: ['2005', '2006', '2007', '2008'],
    correctAnswer: '2007',
    tags: ['technology', 'history'],
  },
  {
    difficulty: 6,
    prompt: 'What is the derivative of x² with respect to x?',
    choices: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
    tags: ['math', 'calculus'],
  },
  {
    difficulty: 7,
    prompt: 'Which element has the atomic number 79?',
    choices: ['Silver', 'Gold', 'Platinum', 'Mercury'],
    correctAnswer: 'Gold',
    tags: ['science', 'chemistry'],
  },
  {
    difficulty: 7,
    prompt: 'What is the capital of Kazakhstan?',
    choices: ['Almaty', 'Astana', 'Bishkek', 'Tashkent'],
    correctAnswer: 'Astana',
    tags: ['geography', 'asia'],
  },
  {
    difficulty: 7,
    prompt: 'In computer science, what does CAP theorem stand for?',
    choices: [
      'Consistency, Availability, Partition tolerance',
      'Cache, API, Protocol',
      'Compute, Allocate, Process',
      'Code, Algorithm, Performance',
    ],
    correctAnswer: 'Consistency, Availability, Partition tolerance',
    tags: ['computer-science', 'distributed-systems'],
  },
  {
    difficulty: 8,
    prompt: 'What is the half-life of Carbon-14?',
    choices: ['5,730 years', '10,000 years', '2,500 years', '15,000 years'],
    correctAnswer: '5,730 years',
    tags: ['science', 'chemistry', 'radioactivity'],
  },
  {
    difficulty: 8,
    prompt: 'Who proved Fermat\'s Last Theorem?',
    choices: ['Andrew Wiles', 'Pierre de Fermat', 'Leonhard Euler', 'Carl Gauss'],
    correctAnswer: 'Andrew Wiles',
    tags: ['math', 'number-theory'],
  },
  {
    difficulty: 8,
    prompt: 'What is the Rydberg constant used to calculate?',
    choices: [
      'Atomic spectra wavelengths',
      'Nuclear decay rates',
      'Chemical bond energies',
      'Gravitational forces',
    ],
    correctAnswer: 'Atomic spectra wavelengths',
    tags: ['science', 'physics', 'quantum'],
  },
  {
    difficulty: 9,
    prompt: 'In which layer of the OSI model does TCP operate?',
    choices: ['Network Layer', 'Transport Layer', 'Session Layer', 'Application Layer'],
    correctAnswer: 'Transport Layer',
    tags: ['computer-science', 'networking'],
  },
  {
    difficulty: 9,
    prompt: 'What is the Schwarzschild radius of a black hole with 1 solar mass?',
    choices: ['3 km', '30 km', '300 km', '3000 km'],
    correctAnswer: '3 km',
    tags: ['science', 'physics', 'astrophysics'],
  },
  {
    difficulty: 9,
    prompt: 'Which cryptographic algorithm is used in Bitcoin mining?',
    choices: ['SHA-256', 'MD5', 'AES-256', 'RSA-2048'],
    correctAnswer: 'SHA-256',
    tags: ['computer-science', 'cryptography'],
  },
  {
    difficulty: 10,
    prompt: 'What is the value of the fine-structure constant (approximately)?',
    choices: ['1/137', '1/273', '1/365', '1/100'],
    correctAnswer: '1/137',
    tags: ['science', 'physics', 'quantum'],
  },
  {
    difficulty: 10,
    prompt: 'In computational complexity theory, what does P vs NP question ask?',
    choices: [
      'Whether problems with quick verification also have quick solutions',
      'Whether parallel computing is faster than sequential',
      'Whether probabilistic algorithms are better than deterministic',
      'Whether polynomial time is better than exponential time',
    ],
    correctAnswer: 'Whether problems with quick verification also have quick solutions',
    tags: ['computer-science', 'complexity-theory'],
  },
  {
    difficulty: 10,
    prompt: 'What is the Riemann Hypothesis concerned with?',
    choices: [
      'Distribution of prime numbers',
      'Topology of manifolds',
      'Quantum field theory',
      'String theory dimensions',
    ],
    correctAnswer: 'Distribution of prime numbers',
    tags: ['math', 'number-theory', 'unsolved'],
  },
  {
    difficulty: 1,
    prompt: 'What is the opposite of hot?',
    choices: ['Warm', 'Cold', 'Cool', 'Freezing'],
    correctAnswer: 'Cold',
    tags: ['general', 'vocabulary'],
  },
  {
    difficulty: 2,
    prompt: 'How many continents are there?',
    choices: ['5', '6', '7', '8'],
    correctAnswer: '7',
    tags: ['geography', 'general'],
  },
  {
    difficulty: 3,
    prompt: 'What is the largest mammal in the world?',
    choices: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 'Blue Whale',
    tags: ['science', 'biology'],
  },
  {
    difficulty: 4,
    prompt: 'What does HTTP stand for?',
    choices: [
      'HyperText Transfer Protocol',
      'High Transfer Text Protocol',
      'HyperText Transmission Process',
      'High Tech Transfer Protocol',
    ],
    correctAnswer: 'HyperText Transfer Protocol',
    tags: ['technology', 'web'],
  },
  {
    difficulty: 5,
    prompt: 'What is the boiling point of water at sea level in Celsius?',
    choices: ['90°C', '95°C', '100°C', '105°C'],
    correctAnswer: '100°C',
    tags: ['science', 'chemistry'],
  },
  {
    difficulty: 6,
    prompt: 'Which country has the most time zones?',
    choices: ['Russia', 'USA', 'France', 'China'],
    correctAnswer: 'France',
    tags: ['geography', 'trivia'],
  },
  {
    difficulty: 7,
    prompt: 'What is the smallest prime number?',
    choices: ['0', '1', '2', '3'],
    correctAnswer: '2',
    tags: ['math', 'number-theory'],
  },
  {
    difficulty: 8,
    prompt: 'In which year was the World Wide Web invented?',
    choices: ['1989', '1991', '1993', '1995'],
    correctAnswer: '1989',
    tags: ['technology', 'history'],
  },
  {
    difficulty: 9,
    prompt: 'What is the name of the first artificial satellite launched into space?',
    choices: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Telstar 1'],
    correctAnswer: 'Sputnik 1',
    tags: ['science', 'space', 'history'],
  },
  {
    difficulty: 10,
    prompt: 'What is the Planck length (approximately)?',
    choices: ['1.6 × 10⁻³⁵ m', '1.6 × 10⁻²⁵ m', '1.6 × 10⁻¹⁵ m', '1.6 × 10⁻⁵ m'],
    correctAnswer: '1.6 × 10⁻³⁵ m',
    tags: ['science', 'physics', 'quantum'],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('❓ Seeding missing questions (non-destructive)...');
  let createdCount = 0;
  let skippedCount = 0;

  for (const q of questions) {
    const existing = await prisma.question.findFirst({
      where: {
        difficulty: q.difficulty,
        prompt: q.prompt,
      },
    });

    if (existing) {
      skippedCount += 1;
      continue;
    }

    await prisma.question.create({
      data: {
        difficulty: q.difficulty,
        prompt: q.prompt,
        choices: q.choices,
        correctAnswerHash: hashAnswer(q.correctAnswer),
        tags: q.tags,
      },
    });

    createdCount += 1;
  }

  console.log(`✅ Created ${createdCount} new questions`);
  console.log(`⏭️ Skipped ${skippedCount} existing questions`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
