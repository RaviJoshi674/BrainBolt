import { prisma } from '../db/client';
import { getQuestionPoolFromCache } from '../cache/strategies';
import { NotFoundError } from '../utils/errors';

export async function selectQuestion(
  difficulty: number,
  excludeQuestionIds: string[] = []
): Promise<any> {
  const questionIds = await getQuestionPoolFromCache(difficulty);

  const availableIds = questionIds.filter((id) => !excludeQuestionIds.includes(id));

  if (availableIds.length === 0) {
    const allQuestions = await prisma.question.findMany({
      where: { difficulty },
      select: { id: true },
    });

    if (allQuestions.length === 0) {
      throw new NotFoundError(`No questions available at difficulty ${difficulty}`);
    }

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const questionId = allQuestions[randomIndex].id;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        difficulty: true,
        prompt: true,
        choices: true,
      },
    });

    return question;
  }

  const randomIndex = Math.floor(Math.random() * availableIds.length);
  const questionId = availableIds[randomIndex];

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      difficulty: true,
      prompt: true,
      choices: true,
    },
  });

  return question;
}

export async function getRecentQuestionIds(userId: string, limit: number = 5): Promise<string[]> {
  const recentAnswers = await prisma.answerLog.findMany({
    where: { userId },
    orderBy: { answeredAt: 'desc' },
    take: limit,
    select: { questionId: true },
  });

  return recentAnswers.map((a) => a.questionId);
}

export async function getQuestionWithAnswer(questionId: string): Promise<any> {
  return await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      difficulty: true,
      prompt: true,
      choices: true,
      correctAnswerHash: true,
    },
  });
}
