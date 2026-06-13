export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  authProvider: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
}
