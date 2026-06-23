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
