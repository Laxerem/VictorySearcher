import { get, post, postForm } from './client';
import type { VacancyDto, VacancyListItemDto, CreateVacancyRequestDto } from '@/types/api';

export const getVacancies = () => get<VacancyListItemDto[]>('/vacancies');

export const getVacancy = (id: string) => get<VacancyDto>(`/vacancies/${id}`);

export const createVacancy = (data: CreateVacancyRequestDto) =>
  post<VacancyDto>('/vacancies', data);

export const uploadResume = (vacancyId: string, file: File): Promise<void> => {
  const form = new FormData();
  form.append('file', file);
  return postForm<void>(`/vacancies/${vacancyId}/resumes`, form);
};
