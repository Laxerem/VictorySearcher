import { get, post, getToken, clearToken } from './client';
import type { ScoringStatusDto, ScoringResultDto, ScoringProgressEvent } from '@/types/api';

export const startScoring = (vacancyId: string): Promise<void> =>
  post<void>(`/vacancies/${vacancyId}/scoring`, {});

export const getScoringStatus = (vacancyId: string) =>
  get<ScoringStatusDto>(`/vacancies/${vacancyId}/scoring/status`);

export const getScoringResults = (vacancyId: string) =>
  get<ScoringResultDto[]>(`/vacancies/${vacancyId}/scoring/results`);

export async function streamScoringProgress(
  vacancyId: string,
  onEvent: (event: ScoringProgressEvent) => void,
  onError?: (error: Error) => void
): Promise<() => void> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let aborted = false;

  try {
    const res = await fetch(`/api/vacancies/${vacancyId}/scoring/stream`, {
      method: 'GET',
      headers,
    });

    if (res.status === 401) {
      clearToken();
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (reader && !aborted) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6);
            const event = JSON.parse(jsonStr) as ScoringProgressEvent;
            onEvent(event);
          } catch (e) {
            onError?.(new Error(`Failed to parse event: ${e}`));
          }
        }
      }
    }
  } catch (e) {
    onError?.(e instanceof Error ? e : new Error(String(e)));
  }

  return () => {
    aborted = true;
  };
}
