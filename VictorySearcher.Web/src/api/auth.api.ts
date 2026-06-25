import { post } from '@/api/client';
import type { LoginRequestDto, LoginResponseDto } from '@/types/api';

export function loginUser(dto: LoginRequestDto): Promise<LoginResponseDto> {
  return post<LoginResponseDto>('/auth/login', dto);
}
