export interface UserInfo {
  displayName: string;
  email: string;
  providerId: string;
  photoURL: string;
  creationTime: string;
  lastSignInTime: string;
  timesLoggedIn: number;
  accessLogs: string[];
}

export interface ChartData {
  date: string;
  activeUsers: number;
}

export interface RegisterFormData {
  name: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordUpdateFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ReauthenticateFormData {
  password: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}
