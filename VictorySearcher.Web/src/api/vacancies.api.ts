import { get, post, postForm } from './client';
import type { VacancyDto, CreateVacancyRequestDto } from '@/types/api';

export const getVacancies = () => get<VacancyDto[]>('/vacancies');

export const createVacancy = (data: CreateVacancyRequestDto) =>
  post<VacancyDto>('/vacancies', data);

export const uploadResume = (vacancyId: string, file: File): Promise<void> => {
  const form = new FormData();
  form.append('file', file);
  return postForm<void>(`/vacancies/${vacancyId}/resumes`, form);
};
