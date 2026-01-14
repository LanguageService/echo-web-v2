const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  is_verified: boolean;
  token: {
    refresh: string;
    access: string;
  };
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  first_name: string;
  last_name: string;
  email: string;
}

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function signinUser(
  credentials: SignUpRequest
): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/customer/user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("signup failed");
  }

  return response.json();
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  speech_to_text_supported: boolean;
  text_to_speech_supported: boolean;
  translation_supported: boolean;
  is_african_language: boolean;
}

export interface LanguagesResponse {
  count: number;
  languages: Language[];
}

export const fetchLanguages = async (): Promise<LanguagesResponse> => {
  const response = await fetch(`${API_BASE_URL}/voice/languages/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }
  return response.json();
};

// Add to app/lib/api.ts

export interface UserProfile {
  id: number;
  last_login: string;
  is_staff: boolean;
  date_joined: string;
  archived: string | null;
  last_modified: string;
  date_created: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  user_type: string;
  phone: string | null;
  origin_country: string | null;
  resident_country: string | null;
  occupation: string | null;
  visit_type: string | null;
  city: string | null;
  state: string | null;
  profile_picture: string | null;
  date_of_birth: string | null;
  address: string;
  is_active: boolean;
  is_verified: boolean;
  deleted_by: string | null;
  login_attempts: number;
  last_failed_login: string | null;
  account_locked_until: string | null;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  const response = await fetch(`${API_BASE_URL}/user/users/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Profile fetch error:", response.status, errorData);
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }
  return response.json();
};

export const updateUserProfile = async (
  id: number,
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/user/users/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return response.json();
};
