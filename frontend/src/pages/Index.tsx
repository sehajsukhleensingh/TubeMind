import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { YouTubeInput } from "@/components/YouTubeInput";
import { ActionButtons } from "@/components/ActionButtons";
import { SummaryCard } from "@/components/SummaryCard";
import { NotesCard } from "@/components/NotesCard";
import { TranscriptCard } from "@/components/TranscriptCard";
import { ChatSection } from "@/components/ChatSection";
import { useVideoInsights } from "@/hooks/useVideoInsights";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "history">("home");

  const {
    url,
    setUrl,
    currentVideo,
    history,
    loadingStates,
    visibleSections,
    generateSummary,
    generateNotes,
    getTranscript,
    openChat,
    closeChat,
    sendMessage,
    selectFromHistory,
    goHome,
  } = useVideoInsights();

  const handleTabChange = (tab: "home" | "history") => {
    setActiveTab(tab);
    if (tab === "home") {
      goHome();
    }
  };

  const handleHistorySelect = (id: string) => {
    selectFromHistory(id);
    setActiveTab("home");
  };

  const isUrlValid = url.trim().length > 0;
  const hasAnyContent = visibleSections.summary || visibleSections.notes || visibleSections.transcript || visibleSections.chat;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        history={history.map((v) => ({ id: v.id, title: v.title }))}
        onHistorySelect={handleHistorySelect}
        selectedVideoId={currentVideo?.id}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              {currentVideo ? currentVideo.title : "Learn from YouTube"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentVideo
                ? "Select an action below to generate insights"
                : "Paste a video URL and choose what you want to generate"}
            </p>
          </header>

          {/* YouTube Input */}
          <div className="mb-5">
            <YouTubeInput onUrlChange={setUrl} value={url} />
          </div>

          {/* Action Buttons */}
          <div className="mb-6">
            <ActionButtons
              onGenerateSummary={generateSummary}
              onGenerateNotes={generateNotes}
              onGetTranscript={getTranscript}
              onOpenChat={openChat}
              loadingStates={{
                summary: loadingStates.summary,
                notes: loadingStates.notes,
                transcript: loadingStates.transcript,
              }}
              completedStates={{
                summary: !!currentVideo?.summary,
                notes: !!currentVideo?.notes,
                transcript: !!currentVideo?.transcript,
              }}
              disabled={!isUrlValid}
            />
          </div>

          {/* Content: only the active section (on top, others cleared) */}
          {hasAnyContent && (
            <div className="space-y-5">
              {visibleSections.summary && (
                <SummaryCard
                  summary={currentVideo?.summary ?? null}
                  isLoading={loadingStates.summary}
                  isVisible
                />
              )}
              {visibleSections.notes && (
                <NotesCard
                  notes={currentVideo?.notes ?? null}
                  isLoading={loadingStates.notes}
                  isVisible
                />
              )}
              {visibleSections.transcript && (
                <TranscriptCard
                  transcript={currentVideo?.transcript ?? null}
                  isLoading={loadingStates.transcript}
                  isVisible
                />
              )}
              {visibleSections.chat && (
                <ChatSection
                  messages={currentVideo?.messages ?? []}
                  onSendMessage={sendMessage}
                  isLoading={loadingStates.chat}
                  isVisible
                  onClose={closeChat}
                />
              )}
            </div>
          )}

          {/* Empty State */}
          {!hasAnyContent && (
            <div className="card-elevated rounded-xl p-10 text-center">
              <div className="max-w-sm mx-auto">
                <h2 className="font-medium text-foreground mb-2">Ready to start</h2>
                <p className="text-sm text-muted-foreground">
                  Enter a YouTube URL above, then click any action button to generate summaries, notes, transcripts, or start a Q&A chat.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
