import { useState, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface VideoData {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  notes: string[] | null;
  transcript: string | null;
  messages: Message[];
}

/** Parse API notes string (newlines/bullets) into array of lines. */
function parseNotesString(notes: string): string[] {
  return notes
    .split(/\n+/)
    .map((s) => s.replace(/^[\s\-*•]+\s*/, "").trim())
    .filter(Boolean);
}

export function useVideoInsights() {
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>([]);
  
  const [loadingStates, setLoadingStates] = useState({
    summary: false,
    notes: false,
    transcript: false,
    chat: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    summary: false,
    notes: false,
    transcript: false,
    chat: false,
  });

  const extractVideoTitle = (url: string): string => {
    const titles = [
      "Understanding Machine Learning Fundamentals",
      "Building Scalable Web Applications",
      "The Future of Artificial Intelligence",
      "Data Science for Beginners",
      "TubeMind",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const ensureVideoExists = useCallback(() => {
    if (!currentVideo && url.trim()) {
      const newVideo: VideoData = {
        id: Date.now().toString(),
        title: extractVideoTitle(url),
        url,
        summary: null,
        notes: null,
        transcript: null,
        messages: [],
      };
      setCurrentVideo(newVideo);
      setHistory((prev) => [newVideo, ...prev.slice(0, 9)]);
      return newVideo;
    }
    return currentVideo;
  }, [currentVideo, url]);

  const generateSummary = useCallback(async () => {
    const video = ensureVideoExists();
    if (!video) return;

    setVisibleSections({ summary: true, notes: false, transcript: false, chat: false });
    setLoadingStates((prev) => ({ ...prev, summary: true }));
    setCurrentVideo((prev) =>
      prev && prev.id === video.id
        ? { ...prev, notes: null, transcript: null }
        : prev
    );
    setHistory((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, notes: null, transcript: null } : v
      )
    );

    try {
      const { important_topics } = await api.importantTopics({ url: video.url, lang });
      const updatedVideo = { ...video, summary: important_topics, notes: null, transcript: null };
      setCurrentVideo(updatedVideo);
      setHistory((prev) => prev.map((v) => (v.id === video.id ? updatedVideo : v)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate summary";
      toast.error(message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, summary: false }));
    }
  }, [ensureVideoExists]);

  const generateNotes = useCallback(async () => {
    const video = ensureVideoExists();
    if (!video) return;

    setVisibleSections({ summary: false, notes: true, transcript: false, chat: false });
    setLoadingStates((prev) => ({ ...prev, notes: true }));
    setCurrentVideo((prev) =>
      prev && prev.id === video.id
        ? { ...prev, summary: null, transcript: null }
        : prev
    );
    setHistory((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, summary: null, transcript: null } : v
      )
    );

    try {
      const { notes } = await api.notes({ url: video.url, lang });
      const notesArray = parseNotesString(notes);
      const updatedVideo = {
        ...video,
        notes: notesArray.length ? notesArray : [notes],
        summary: null,
        transcript: null,
      };
      setCurrentVideo(updatedVideo);
      setHistory((prev) => prev.map((v) => (v.id === video.id ? updatedVideo : v)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate notes";
      toast.error(message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, notes: false }));
    }
  }, [ensureVideoExists]);

  const getTranscript = useCallback(async () => {
    const video = ensureVideoExists();
    if (!video) return;

    setVisibleSections({ summary: false, notes: false, transcript: true, chat: false });
    setLoadingStates((prev) => ({ ...prev, transcript: true }));
    setCurrentVideo((prev) =>
      prev && prev.id === video.id
        ? { ...prev, summary: null, notes: null }
        : prev
    );
    setHistory((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, summary: null, notes: null } : v
      )
    );

    try {
      const { transcript } = await api.transcript({ url: video.url, lang });
      const updatedVideo = { ...video, transcript, summary: null, notes: null };
      setCurrentVideo(updatedVideo);
      setHistory((prev) => prev.map((v) => (v.id === video.id ? updatedVideo : v)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get transcript";
      toast.error(message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, transcript: false }));
    }
  }, [ensureVideoExists]);

  const openChat = useCallback(() => {
    const video = ensureVideoExists();
    if (!video) return;
    setVisibleSections({ summary: false, notes: false, transcript: false, chat: true });
    setCurrentVideo((prev) =>
      prev && prev.id === video.id
        ? { ...prev, summary: null, notes: null, transcript: null }
        : prev
    );
    setHistory((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? { ...v, summary: null, notes: null, transcript: null }
          : v
      )
    );
  }, [ensureVideoExists]);

  const closeChat = useCallback(() => {
    setVisibleSections((prev) => ({ ...prev, chat: false }));
  }, []);

  const toggleSectionVisibility = useCallback((section: 'summary' | 'notes' | 'transcript') => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!currentVideo) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setCurrentVideo((prev) => {
      if (!prev) return null;
      return { ...prev, messages: [...prev.messages, userMessage] };
    });

    setLoadingStates((prev) => ({ ...prev, chat: true }));

    try {
      const { response } = await api.ask({
        url: currentVideo.url,
        lang,
        query: message,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };

      setCurrentVideo((prev) => {
        if (!prev) return null;
        const updated = { ...prev, messages: [...prev.messages, aiMessage] };
        setHistory((hist) => hist.map((v) => (v.id === prev.id ? updated : v)));
        return updated;
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get an answer";
      toast.error(errorMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, something went wrong: ${err instanceof Error ? err.message : "Please try again."}`,
      };
      setCurrentVideo((prev) => {
        if (!prev) return null;
        return { ...prev, messages: [...prev.messages, aiMessage] };
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, chat: false }));
    }
  }, [currentVideo]);

  return {
    url,
    setUrl,
    lang,
    setLang,
    currentVideo,
    loadingStates,
    visibleSections,
    generateSummary,
    generateNotes,
    getTranscript,
    openChat,
    closeChat,
    sendMessage,
    toggleSectionVisibility,
  };
}
