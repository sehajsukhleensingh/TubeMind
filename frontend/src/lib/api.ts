const getApiBaseUrl = () =>
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface ApiRequest {
  url: string;
  lang?: string;
}

export interface NotesResponse {
  notes: string;
}

export interface TranscriptResponse {
  transcript: string;
}

export interface ImportantTopicsResponse {
  important_topics: string;
}

export interface AskRequest extends ApiRequest {
  query: string;
}

export interface AskResponse {
  response: string;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const payload = { ...body, lang: (body.lang as string) ?? "en" };
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { detail?: string }).detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  notes: (data: ApiRequest) =>
    post<NotesResponse>("/notes", data),

  transcript: (data: ApiRequest) =>
    post<TranscriptResponse>("/transcript", data),

  importantTopics: (data: ApiRequest) =>
    post<ImportantTopicsResponse>("/imptopics", data),

  ask: (data: AskRequest) =>
    post<AskResponse>("/ask", data),
};
