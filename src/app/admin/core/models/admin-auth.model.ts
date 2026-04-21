export interface AdminUser {
  id?: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  role?: string;
}

export interface AdminSession {
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
}

export interface AuthMessageResponse {
  success?: boolean;
  message: string;
}

export interface CreateAdminUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

