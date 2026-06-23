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
