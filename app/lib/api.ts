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

export interface GoogleLoginResponse {
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

export async function googleLoginUser(id_token: string): Promise<GoogleLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token }),
  });

  const data = await response.json();
  if (data.code !== 200 || !response.ok) {
    throw new Error(data.message || "Google Login failed");
  }

  return data;
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

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native_name: 'English', flag_emoji: '🇬🇧', speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: 'sw', name: 'Swahili', native_name: 'Kiswahili', flag_emoji: '🇰🇪', speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
  { code: 'rw', name: 'Kinyarwanda', native_name: 'Kinyarwanda', flag_emoji: '🇷🇼', speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true }
];

export const fetchLanguages = async (): Promise<LanguagesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/base/languages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Failed to fetch languages, using default cache");
      return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching languages, using default cache", error);
    return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES };
  }
};
export const fetchTextLanguages = async (): Promise<LanguagesResponse> => {
  try {
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
      console.warn("Failed to fetch text languages, using default cache");
      return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES.filter(l => l.text_to_text_supported) };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching text languages, using default cache", error);
    return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES.filter(l => l.text_to_text_supported) };
  }
};
export const fetchVoiceLanguages = async (): Promise<LanguagesResponse> => {
  try {
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
      console.warn("Failed to fetch voice languages, using default cache");
      return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES.filter(l => l.speech_to_speech_translation_supported) };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching voice languages, using default cache", error);
    return { count: DEFAULT_LANGUAGES.length, languages: DEFAULT_LANGUAGES.filter(l => l.speech_to_speech_translation_supported) };
  }
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
  has_password?: boolean;
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

// export async function updateUserProfile(
//   id: number,
//   data: FormData,
// ): Promise<UserProfile> {
//   const token = localStorage.getItem("token");
//   const response = await fetch(`${API_BASE_URL}/user/users/${id}/`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: data,
//   });

//   if (!response.ok) {
//     throw new Error("Failed to update profile");
//   }

//   return response.json();
// }

export interface UpdateUserProfileRequest {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone: string | null;
  origin_country: string | null;
  resident_country: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  address: string;
  date_of_birth: string | null;
  profile_picture?: string | null;
}

export async function updateUserProfile(
  id: number,
  data: UpdateUserProfileRequest,
): Promise<UserProfile> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/user/users/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
    // const response = await fetch(`${API_BASE_URL}/translations/base/settings/`, {
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
  const response = await fetch(`${API_BASE_URL}/translations/base/settings/`, {
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

export interface AudioFileRecord {
  id: string;
  audio_type: "original" | "translated" | "tts";
  language: string;
  duration: number;
  file_size: number;
  format: string;
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
  audio_files: AudioFileRecord[];
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
  audio_files: AudioFileRecord[];
  type: string;
  is_favorite?: boolean;
  is_sms?: boolean;
}

export async function fetchRecentTranslations(isFavorite: boolean = false): Promise<RecentTranslationsResponse> {
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
    const url = isFavorite 
      ? `${API_BASE_URL}/translations/history/?is_favorite=true`
      : `${API_BASE_URL}/translations/history/`;
      
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        return { count: 0, offset: 0, limit: 0, results: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching translations history:", error);
    return { count: 0, offset: 0, limit: 0, results: [] };
  }
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  const response = await fetch(`${API_BASE_URL}/translations/history/${id}/favorite/`, {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  
  if (response.ok) {
      const data = await response.json();
      return data.is_favorite;
  }
  return false;
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

// ----------------------------------------------------------------------
// NEW: Wallet & Billing Integration
// ----------------------------------------------------------------------

export interface WalletTransaction {
  id: number;
  amount: string;
  type: "TOPUP" | "WITHDRAWAL";
  flow: "CREDIT" | "DEBIT";
  notes: string;
  initiated_by_admin: boolean;
  created_by_email: string | null;
  created: string | null;
}

export interface WalletBalanceResponse {
  balance: string;
  currency: string;
  transactions: WalletTransaction[];
}

export async function fetchWalletBalance(): Promise<WalletBalanceResponse> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/wallet/balance/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    return { balance: "0.00", currency: "CREDITS", transactions: [] };
  }
  return response.json();
}

export interface UsageSummaryResponse {
  total_translations: number;
  voice_translations: number;
  text_translations: number;
  this_month: number;
  this_week: number;
  today: number;
  total_credits_used: number;
}

export async function fetchUsageSummary(): Promise<UsageSummaryResponse> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/wallet/usage-summary/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    return { total_translations: 0, voice_translations: 0, text_translations: 0, this_month: 0, this_week: 0, today: 0, total_credits_used: 0 };
  }
  return response.json();
}

export function resolveMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  const backendHost = (API_BASE_URL ?? "").replace("/api/v1", "");
  return `${backendHost}${url}`;
}

export async function hasSufficientBalance(): Promise<boolean> {
  try {
    const { balance } = await fetchWalletBalance();
    return parseFloat(balance) > 0;
  } catch {
    return true; // don't block if the check itself fails
  }
}

export interface PricingConfigResponse {
  id: string;
  channel: string;
  translation_type: string;
  cost_per_unit: string;
  unit_type: string;
}

const DEFAULT_PRICING: PricingConfigResponse[] = [
  { id: 'default_ui_sts', channel: 'UI', translation_type: 'STS', cost_per_unit: '0.05', unit_type: 'Minute' },
  { id: 'default_ui_stt', channel: 'UI', translation_type: 'STT', cost_per_unit: '0.03', unit_type: 'Minute' },
  { id: 'default_ui_ttt', channel: 'UI', translation_type: 'TTT', cost_per_unit: '2.00', unit_type: 'Million Characters' },
  { id: 'default_ui_tts', channel: 'UI', translation_type: 'TTS', cost_per_unit: '0.04', unit_type: 'Minute' },
  { id: 'default_api_sts', channel: 'API', translation_type: 'STS', cost_per_unit: '0.08', unit_type: 'Minute' },
  { id: 'default_api_stt', channel: 'API', translation_type: 'STT', cost_per_unit: '0.05', unit_type: 'Minute' },
  { id: 'default_api_ttt', channel: 'API', translation_type: 'TTT', cost_per_unit: '5.00', unit_type: 'Million Characters' },
  { id: 'default_api_tts', channel: 'API', translation_type: 'TTS', cost_per_unit: '0.06', unit_type: 'Minute' }
];

export async function fetchPricing(): Promise<PricingConfigResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/billing/pricing/`);
    if (!response.ok) {
      console.warn(`Failed to fetch pricing: ${response.status} ${response.statusText}, using defaults`);
      return DEFAULT_PRICING;
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.warn("Error in fetchPricing, using default pricing cache:", error);
    return DEFAULT_PRICING;
  }
}

export interface TopUpRequest {
  amount: number;
}

export interface TopUpResponse {
  authorization_url: string;
  reference: string;
}

export async function initiateTopUp(data: TopUpRequest): Promise<TopUpResponse> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/payment/topup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to initiate top up");
  }
  return response.json();
}

// ----------------------------------------------------------------------
// NEW: Developer API Keys
// ----------------------------------------------------------------------

export interface ApiKey {
  id: string;
  name: string;
  client_id: string;
  client_secret?: string; // Only returned on creation
  is_active: boolean;
  created_at: string;
  last_used?: string | null;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || data;
}

export interface CreateApiKeyRequest {
  name: string;
}

export async function createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create API key");
  }
  return response.json();
}

export async function revokeApiKey(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to revoke API key");
  }
}

// ----------------------------------------------------------------------
// Webhooks
// ----------------------------------------------------------------------

export interface Webhook {
  id: string;
  app_id: string;
  app_name: string;
  url: string;
  secret?: string;
  is_active: boolean;
  created_at: string;
}

export async function fetchWebhooks(): Promise<Webhook[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/webhooks/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return [];
  return response.json();
}

export async function createWebhook(app_id: string, url: string): Promise<Webhook> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/webhooks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ app_id, url }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create webhook");
  }
  return response.json();
}

export async function deleteWebhook(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api-keys/webhooks/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to delete webhook");
  }
}
