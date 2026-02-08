/**
 * Language code mapping for API requests
 * Maps user-friendly language names to ISO-style language codes
 */
export const LANGUAGE_CODES: Record<string, string> = {
  en: "en",      // English
  hi: "hi",      // Hindi
  ja: "ja",      // Japanese
  es: "es",      // Spanish
  fr: "fr",      // French
  de: "de",      // German
};

/**
 * Language display names for UI
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ja: "Japanese",
  es: "Spanish",
  fr: "French",
  de: "German",
};

/**
 * Get the language code for API requests
 * @param language - The language key (e.g., "en", "hi")
 * @returns The language code to send to the API
 */
export const getLanguageCode = (language: string): string => {
  return LANGUAGE_CODES[language] || "en";
};
