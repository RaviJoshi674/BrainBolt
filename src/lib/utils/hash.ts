import * as crypto from 'crypto';

export function hashAnswer(answer: string): string {
  return crypto
    .createHash('sha256')
    .update(answer.toLowerCase().trim())
    .digest('hex');
}

export function verifyAnswer(correctHash: string, providedAnswer: string): boolean {
  return hashAnswer(providedAnswer) === correctHash;
}
