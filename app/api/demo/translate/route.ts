import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    // Extract the real client IP — forwarded to the backend so the
    // AnonymousTrial table tracks limits by true IP, not the proxy IP.
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const formData = await req.formData();
    const audioFile = formData.get("audio_file");
    const sourceLanguage = formData.get("source_language");
    const targetLanguage = formData.get("target_language");

    if (!audioFile || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: audio_file, source_language, target_language" },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("audio_file", audioFile as Blob, "recording.wav");
    backendFormData.append("source_language", sourceLanguage as string);
    backendFormData.append("target_language", targetLanguage as string);
    backendFormData.append("speech_service", "STS");

    // Call the dedicated /translations/speech/demo/ endpoint.
    // No Authorization header — fully unauthenticated.
    // The backend tracks trials by IP via AnonymousTrial model.
    const response = await fetch(
      `${API_BASE_URL}/translations/speech/demo/`,
      {
        method: "POST",
        headers: {
          // Pass real client IP so the backend's get_client_ip() helper
          // reads the correct address from X-Forwarded-For.
          "X-Forwarded-For": ip,
          "X-Real-IP": ip,
        },
        body: backendFormData,
      }
    );

    const data = await response.json().catch(() => ({}));

    // Pass through all backend responses — including 403 TRIAL_LIMIT_REACHED
    // and the trial_attempts_used / trial_attempts_remaining fields.
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Demo Translate] Proxy error:", error);
    return NextResponse.json(
      { error: "Could not reach the translation backend. Please try again." },
      { status: 500 }
    );
  }
}
