import { get, post } from '@/utils/request'
import type { LoginResult, UserInfo } from '@/types'

export const authApi = {
  login: (username: string, password: string) =>
    post<LoginResult>('/api/auth/login', { username, password }),
  me: () => get<UserInfo>('/api/auth/me')
}
