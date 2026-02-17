import {
  NextQuestionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  MetricsResponse,
  LeaderboardResponse,
  AuthResponse,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getNextQuestion(): Promise<NextQuestionResponse> {
    return this.request<NextQuestionResponse>('/api/v1/quiz/next');
  }

  async submitAnswer(data: Omit<SubmitAnswerRequest, 'userId'>): Promise<SubmitAnswerResponse> {
    return this.request<SubmitAnswerResponse>('/api/v1/quiz/answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMetrics(): Promise<MetricsResponse> {
    return this.request<MetricsResponse>('/api/v1/quiz/metrics');
  }

  async getScoreLeaderboard(limit = 50, offset = 0): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(
      `/api/v1/leaderboard/score?limit=${limit}&offset=${offset}`
    );
  }

  async getStreakLeaderboard(limit = 50, offset = 0): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(
      `/api/v1/leaderboard/streak?limit=${limit}&offset=${offset}`
    );
  }
}

export const apiClient = new ApiClient();
