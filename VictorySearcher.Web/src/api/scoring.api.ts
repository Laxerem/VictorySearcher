import { get, post } from './client';
import type { ScoringStatusDto, ScoringResultDto } from '@/types/api';

export const startScoring = (vacancyId: string): Promise<void> =>
  post<void>(`/vacancies/${vacancyId}/scoring`, {});

export const getScoringStatus = (vacancyId: string) =>
  get<ScoringStatusDto>(`/vacancies/${vacancyId}/scoring/status`);

export const getScoringResults = (vacancyId: string) =>
  get<ScoringResultDto[]>(`/vacancies/${vacancyId}/scoring/results`);
