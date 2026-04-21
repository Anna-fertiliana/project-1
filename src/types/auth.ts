export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}


export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}