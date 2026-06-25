import type { ApiError } from '@/types/api';

const TOKEN_KEY = 'auth_token';

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

export function notifyUnauthorized(): void {
  onUnauthorized?.();
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    onUnauthorized?.();
  }

  if (!response.ok) {
    const error: ApiError = {
      message: `HTTP error ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function postForm<T>(path: string, body: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });
  if (res.status === 401) {
    clearToken();
    onUnauthorized?.();
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}
