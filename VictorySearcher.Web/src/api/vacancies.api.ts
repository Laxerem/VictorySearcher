import { get, post, postForm, getToken, clearToken, notifyUnauthorized } from './client';
import type { VacancyDto, VacancyListResponseDto, CreateVacancyRequestDto, PagedResumesDto, ResumeContentDto } from '@/types/api';

export const getVacancies = () => get<VacancyListResponseDto>('/vacancies');

export const getVacancy = (id: string) => get<VacancyDto>(`/vacancies/${id}`);

export const createVacancy = (data: CreateVacancyRequestDto) =>
  post<VacancyDto>('/vacancies', data);

export const uploadResume = (vacancyId: string, file: File): Promise<void> => {
  const form = new FormData();
  form.append('file', file);
  return postForm<void>(`/vacancies/${vacancyId}/resumes`, form);
};

export const getResumes = (vacancyId: string, page: number, pageSize: number) =>
  get<PagedResumesDto>(`/vacancies/${vacancyId}/resumes?page=${page}&pageSize=${pageSize}`);

export const getResumeContent = (vacancyId: string, resumeId: string) =>
  get<ResumeContentDto>(`/vacancies/${vacancyId}/resumes/${resumeId}/content`);

export async function downloadResume(vacancyId: string, resumeId: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`/api/vacancies/${vacancyId}/resumes/${resumeId}/download`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    clearToken();
    notifyUnauthorized();
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.blob();
}
