// const API_BASE_URL = "https://echo-v1-backend.vercel.app/api/v1";
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
  credentials: LoginRequest,
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
  credentials: SignUpRequest,
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
  text_to_text_supported: boolean;
  speech_to_speech_translation_supported: boolean;
  image_translation_supported: boolean;
  document_translation_supported: boolean;
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
export const fetchTextLanguages = async (): Promise<LanguagesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/translations/base/languages/?text_to_text_supported=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }
  return response.json();
};
export const fetchVoiceLanguages = async (): Promise<LanguagesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/translations/base/languages/?speech_to_speech_translation_supported=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }
  return response.json();
};

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

export async function updateUserProfile(
  id: number,
  data: FormData,
): Promise<UserProfile> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/user/users/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}

export interface TextTranslationRequest {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TextTranslationResponse {
  id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_language_name: string;
  target_language_name: string;
  confidence_score: number;
  total_processing_time: number;
}

export async function translateText(
  data: TextTranslationRequest,
): Promise<TextTranslationResponse> {
  const token = localStorage.getItem("token");

  console.log("Sending translation request:", data);

  const response = await fetch(`${API_BASE_URL}/translations/text/base/`, {
    // const response = await fetch(`${API_BASE_URL}/text/text/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(
      `Translation failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

// text translation history
export interface TranslationHistory {
  id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_language_name: string;
  target_language_name: string;
  confidence_score: number;
  total_processing_time: number;
  date_created: string;
  last_modified: string;
}

export async function fetchTranslationHistory(): Promise<TranslationHistory[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/translations/text`, {
    // const response = await fetch(`${API_BASE_URL}/text/text`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch translation history");
  }

  return response.json();
}

// settings api
export interface UserSettings {
  model: string;
  voice: string;
  autoplay: boolean;
  auto_detect_language: boolean;
  super_fast_mode: boolean;
  source_language: string;
  target_language: string;
  theme: string;
  audio_quality: string;
  date_created: string;
  last_modified: string;
}

export interface UpdateSettingsRequest {
  model: string;
  voice: string;
  autoplay: boolean;
  auto_detect_language: boolean;
  super_fast_mode: boolean;
  source_language: string;
  target_language: string;
  theme: string;
  audio_quality: string;
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/translations/base/settings/`, {
  // const response = await fetch(`${API_BASE_URL}/voice/settings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  return response.json();
}

export async function updateUserSettings(
  settings: UpdateSettingsRequest,
): Promise<UserSettings> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/voice/settings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error("Failed to update settings");
  }

  return response.json();
}

// voice translation history
export interface VoiceTranslationHistory {
  id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_language_name: string;
  target_language_name: string;
  original_audio_url: string;
  translated_audio_url: string;
  confidence_score: number;
  total_processing_time: number;
  session_id: string;
  date_created: string;
  last_modified: string;
  audio_files: any[];
}

export async function fetchVoiceTranslationHistory(): Promise<
  VoiceTranslationHistory[]
> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/translations/speech`, {
  // const response = await fetch(`${API_BASE_URL}/voice/translations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch voice translation history");
  }

  const data = await response.json();

  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  } else if (data.results && Array.isArray(data.results)) {
    return data.results;
  } else if (data.translations && Array.isArray(data.translations)) {
    return data.translations;
  } else {
    console.log("API Response:", data);
    return [];
  }
}

// change password

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }
}

// all history

export interface RecentTranslationsResponse {
  count: number;
  offset: number;
  limit: number;
  results: GeneralVoiceTranslationHistory[];
}

export interface GeneralVoiceTranslationHistory {
  id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_language_name: string;
  target_language_name: string;
  original_audio_url: string | null;
  translated_audio_url: string | null;
  confidence_score: number;
  total_processing_time: number;
  session_id: string | null;
  date_created: string;
  last_modified: string;
  audio_files: any[];
  feature_type: string;
}

export async function fetchRecentTranslations(): Promise<RecentTranslationsResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      count: 0,
      offset: 0,
      limit: 0,
      results: [],
    };
  }

  try {
    // Try to get voice translations first (we know this endpoint works)
    const voiceResponse = await fetch(`${API_BASE_URL}/translations/history`, {
      // const voiceResponse = await fetch(`${API_BASE_URL}/voice/translations/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Try to get text translations
    const textResponse = await fetch(`${API_BASE_URL}/text/text/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const voiceData = voiceResponse.ok ? await voiceResponse.json() : [];
    const textData = textResponse.ok ? await textResponse.json() : [];

    // Combine and format the data
    const voiceTranslations = (
      Array.isArray(voiceData) ? voiceData : voiceData.results || []
    ).map((item: any) => ({
      ...item,
      feature_type: "SPEECH_TRANSLATION",
    }));

    const textTranslations = (
      Array.isArray(textData) ? textData : textData.results || []
    ).map((item: any) => ({
      ...item,
      feature_type: "TEXT_TRANSLATION",
      original_audio_url: null,
      translated_audio_url: null,
      session_id: null,
      audio_files: [],
    }));

    // Combine and sort by date
    const allTranslations = [...voiceTranslations, ...textTranslations].sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
    );

    return {
      count: allTranslations.length,
      offset: 0,
      limit: allTranslations.length,
      results: allTranslations,
    };
  } catch (error) {
    console.error("Error fetching recent translations:", error);
    return {
      count: 0,
      offset: 0,
      limit: 0,
      results: [],
    };
  }
}

// sign up flow

export interface SignUpResponse {
  code: number;
  status: string;
  message: string;
  data: {
    token: {
      refresh: string;
      access: string;
    };
    user: UserProfile;
  };
}

export interface VerifyOTPRequest {
  email: string;
  otp_code: string;
}

export interface VerifyOTPResponse {
  code: number;
  status: string;
  token: {
    refresh: string;
    access: string;
  };
}

export async function signUpUser(
  credentials: SignUpRequest,
): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/customer/user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
}

export async function verifyOTP(
  data: VerifyOTPRequest,
): Promise<VerifyOTPResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("OTP verification failed");
  }

  return response.json();
}

// reset password flow
// Forgot Password interfaces and functions
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  code: number;
  status: string;
  token: number;
}

export interface ResetPasswordRequest {
  confirm_password: string;
  otp_code: string;
  password: string;
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
}

export async function initiateForgotPassword(
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password/initiate/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to initiate password reset");
  }

  return response.json();
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return response.json();
}
