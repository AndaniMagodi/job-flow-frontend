import { api } from "../lib/api";

export type CurrentUser = {
  id: number;
  email: string;
  is_verified: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return api.get<CurrentUser>("/auth/me");
}

export async function verifyEmail(token: string): Promise<CurrentUser> {
  return api.post<CurrentUser>("/auth/verify-email", { token });
}

export async function resendVerification(email: string): Promise<{ detail: string }> {
  return api.post<{ detail: string }>("/auth/resend-verification", { email });
}

export async function forgotPassword(email: string): Promise<{ detail: string }> {
  return api.post<{ detail: string }>("/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ access_token: string }> {
  return api.post<{ access_token: string }>("/auth/reset-password", {
    token,
    password,
  });
}
