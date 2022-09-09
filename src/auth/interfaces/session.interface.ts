export interface Session {
  id: number;

  accessToken: string;

  refreshToken: string;

  userAgent: string;

  userId: number;

  ip: string;

  createdAt: Date;

  updatedAt: Date;
}
