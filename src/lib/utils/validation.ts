import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const submitAnswerSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string().min(1, 'Answer cannot be empty'),
  stateVersion: z.number().int().positive(),
  answerIdempotencyKey: z.string().min(1),
});

export const nextQuestionSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
});
