"use client";

import { useState, useEffect } from "react";
import {
  fetchUserSettings,
  updateUserSettings,
  fetchLanguages,
  type UserSettings,
  type Language,
} from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { toast, toasts } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, languagesData] = await Promise.all([
        fetchUserSettings(),
        fetchLanguages(),
      ]);
      setSettings(settingsData);
      setLanguages(languagesData.languages);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updateData = {
        model: settings.model,
        voice: settings.voice,
        autoplay: settings.autoplay,
        auto_detect_language: settings.auto_detect_language,
        super_fast_mode: settings.super_fast_mode,
        source_language: settings.source_language,
        target_language: settings.target_language,
        theme: settings.theme,
        audio_quality: settings.audio_quality,
      };

      await updateUserSettings(updateData);
      toast("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Settings
        </h1>
        {/* <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button> */}
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Model Selection */}
        <SettingCard
          title="AI Model"
          description="Choose the AI model for translations"
        >
          <select
            value={settings.model}
            onChange={(e) => updateSetting("model", e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </SettingCard>

        {/* Voice Selection */}
        <SettingCard title="Voice" description="Select voice for audio output">
          <select
            value={settings.voice}
            onChange={(e) => updateSetting("voice", e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="Zephyr">Zephyr</option>
            <option value="Nova">Nova</option>
            <option value="Aria">Aria</option>
            <option value="Echo">Echo</option>
          </select>
        </SettingCard>

        {/* Language Settings */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SettingCard
            title="Source Language"
            description="Default input language"
          >
            <select
              value={settings.source_language}
              onChange={(e) => updateSetting("source_language", e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="auto">Auto Detect</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag_emoji} {lang.name}
                </option>
              ))}
            </select>
          </SettingCard>

          <SettingCard
            title="Target Language"
            description="Default output language"
          >
            <select
              value={settings.target_language}
              onChange={(e) => updateSetting("target_language", e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag_emoji} {lang.name}
                </option>
              ))}
            </select>
          </SettingCard>
        </div>

        {/* Theme & Quality */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SettingCard title="Theme" description="App visual theme">
            <select
              value={settings.theme}
              onChange={(e) => updateSetting("theme", e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="african">African</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </SettingCard>

          <SettingCard title="Audio Quality" description="Voice output quality">
            <select
              value={settings.audio_quality}
              onChange={(e) => updateSetting("audio_quality", e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="low">Low Quality</option>
            </select>
          </SettingCard>
        </div>

        {/* Toggle Settings */}
        <div className="grid gap-4">
          <ToggleSetting
            title="Autoplay"
            description="Automatically play translated audio"
            checked={settings.autoplay}
            onChange={(checked) => updateSetting("autoplay", checked)}
          />

          <ToggleSetting
            title="Auto Detect Language"
            description="Automatically detect input language"
            checked={settings.auto_detect_language}
            onChange={(checked) =>
              updateSetting("auto_detect_language", checked)
            }
          />

          <ToggleSetting
            title="Super Fast Mode"
            description="Enable faster processing with reduced accuracy"
            checked={settings.super_fast_mode}
            onChange={(checked) => updateSetting("super_fast_mode", checked)}
          />
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
          <p>
            <strong>Created:</strong>{" "}
            {new Date(settings.date_created).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Modified:</strong>{" "}
            {new Date(settings.last_modified).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Toast Container */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div
            key={index}
            className="bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fade-in text-sm sm:text-base"
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
      <div>
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg">
            {title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
            checked ? "bg-orange-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
              checked ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
