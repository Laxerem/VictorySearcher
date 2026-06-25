export interface LoginRequestDto {
  login: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface VacancyListItemDto {
  id: string;
  title: string;
}

export interface VacancyDto {
  id: string;
  title: string;
  description: string;
  requirements: string;
  extraRequirements: string | null;
  createdAt: string;
}

export interface CreateVacancyRequestDto {
  title: string;
  description: string;
  requirements: string;
  extraRequirements?: string;
}

export type ScoringStatus = 'pending' | 'inProcess' | 'finished' | 'failed';

export interface ScoringInfo {
  status: ScoringStatus;
  errorMessage: string | null;
}

export interface ScoringStatusDto {
  status: ScoringStatus;
  errorMessage: string | null;
  createdAt: string;
  finishedAt: string | null;
}

export interface ScoringProgressEvent {
  status: ScoringStatus;
  checked: number;
  total: number;
  errorMessage: string | null;
}

export interface RequirementCoverageDto {
  requirement: string;
  covered: boolean;
  evidence: string;
}

export interface ScoringResultDto {
  resumeId: string;
  fileName: string;
  overallScore: number;
  experienceScore: number;
  skillsScore: number;
  extraScore: number | null;
  reasoning: string;
  isUncertain: boolean;
  requirementsAnalysis: RequirementCoverageDto[];
  scoredAt: string;
}

export interface ResumeListItemDto {
  id: string;
  fileName: string;
  format: string;
  loadedAt: string;
  isScored: boolean;
}

export interface PagedResumesDto {
  items: ResumeListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  scoredCount: number;
  unscoredCount: number;
}

export interface ResumeContentDto {
  fileName: string;
  content: string;
}
