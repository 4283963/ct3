import { mockUsers } from '../data/mockData.js'
import type { User } from '../types/index.js'
import bcrypt from 'bcryptjs'

export const UserService = {
  async findByUsername(username: string): Promise<User | undefined> {
    return mockUsers.find(u => u.username === username)
  },

  async findById(id: string): Promise<User | undefined> {
    return mockUsers.find(u => u.id === id)
  },

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  },

  async getUserRoles(userId: string): Promise<string[]> {
    const user = mockUsers.find(u => u.id === userId)
    return user?.roleIds ?? []
  },

  async listUsers(): Promise<User[]> {
    return mockUsers.map(({ password, ...rest }) => ({ ...rest, password: '***' as unknown as string }))
  }
}
