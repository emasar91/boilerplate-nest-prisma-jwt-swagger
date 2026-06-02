export interface AuthenticatedUser {
  readonly userId: string;
  readonly email: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly user: AuthenticatedUser;
}
