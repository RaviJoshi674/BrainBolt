import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

function hasStatusCode(error: unknown): error is { statusCode: number; message?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof (error as { statusCode: unknown }).statusCode === 'number'
  );
}

export function handleRouteError(context: string, error: unknown) {
  console.error(`${context}:`, error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.issues },
      { status: 400 }
    );
  }

  if (hasStatusCode(error)) {
    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: error.statusCode }
    );
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
