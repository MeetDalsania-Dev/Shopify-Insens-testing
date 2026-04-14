import http from "@/src/shared/lib/http";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  StrapiUser,
  UpdateRolePayload,
} from "../types/auth.types";

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const { data } = await http.post<AuthResponse>("/auth/local", payload);
  console.log(data);

  return data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await http.post<AuthResponse>(
    "/auth/local/register",
    payload,
  );
  return data;
};
export const sendOtp = async (email: string): Promise<void> => {
  await http.post("/otp/send", { email });
};
export const forgotPassword = async (email: string): Promise<void> => {
  await http.post("/otp/send", { email });
};

export const verifyOtp = async (
  email: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> => {
  const { data } = await http.post("/otp/verify", { email, code });
  return data;
};

export const resendOtp = async (email: string): Promise<void> => {
  await http.post("/auth/forgot-password", { email });
};

export const resetPassword = async (
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> => {
  await http.post("/otp/reset-password", {
    email,
    password,
    passwordConfirmation,
  });
};

// Update roleType on the user profile after role selection
export const updateUserRole = async (
  id: number,
  payload: UpdateRolePayload,
): Promise<StrapiUser> => {
  const { data } = await http.put<{ data: StrapiUser }>(
    `/users/${id}`,
    payload,
  );
  return data.data;
};

// Fetch current user — used on app boot
export const getMe = async (): Promise<StrapiUser> => {
  const { data } = await http.get<StrapiUser>("/users/me");
  return data;
};
