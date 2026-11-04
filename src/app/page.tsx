"use client";

import React, { useState, useEffect } from "react";
import { Song, SongbookConfig } from "@/types/song";
import { INITIAL_SONGS, DEFAULT_SONGBOOK_CONFIG } from "@/lib/default-songs";
import { Header } from "@/components/Header";
import { SongListSidebar } from "@/components/SongListSidebar";
import { SongEditor } from "@/components/SongEditor";
import { SmartPasteModal } from "@/components/SmartPasteModal";
import { PrintPreviewModal } from "@/components/PrintPreviewModal";
import { Music, Plus, Sparkles } from "lucide-react";

const STORAGE_KEY_SONGS = "wordconnect_songbook_songs";
const STORAGE_KEY_CONFIG = "wordconnect_songbook_config";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [config, setConfig] = useState<SongbookConfig>(DEFAULT_SONGBOOK_CONFIG);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(INITIAL_SONGS[0]?.id || null);
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedSongs = localStorage.getItem(STORAGE_KEY_SONGS);
      const storedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (storedSongs) {
        const parsedSongs = JSON.parse(storedSongs);
        if (Array.isArray(parsedSongs) && parsedSongs.length > 0) {
          setSongs(parsedSongs);
          setSelectedSongId(parsedSongs[0].id);
        }
      }
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }
    } catch (e) {
      console.error("Failed to load saved songbook data", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SONGS, JSON.stringify(songs));
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to persist songbook data", e);
    }
  }, [songs, config, isLoaded]);

  const selectedSong = songs.find((s) => s.id === selectedSongId) || songs[0] || null;

  const handleAddSong = () => {
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: `Song #${songs.length + 1}`,
      originalKey: "G",
      currentKey: "G",
      tempo: "75 BPM",
      timeSignature: "4/4",
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: "verse",
          title: "Verse 1",
          lines: [
            {
              id: `line-${Date.now()}-1`,
              lyrics: "Enter lyrics here or click Smart Paste to import...",
              chords: [{ id: `c-${Date.now()}`, chord: "G", position: 0 }],
            },
          ],
        },
      ],
    };

    setSongs((prev) => [...prev, newSong]);
    setSelectedSongId(newSong.id);
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
    );
  };

  const handleDeleteSong = (id: string) => {
    if (songs.length <= 1) {
      alert("A songbook must have at least one song.");
      return;
    }
    const remaining = songs.filter((s) => s.id !== id);
    setSongs(remaining);
    if (selectedSongId === id) {
      setSelectedSongId(remaining[0]?.id || null);
    }
  };

  const handleDuplicateSong = (song: Song) => {
    const duplicated: Song = {
      ...song,
      id: `song-${Date.now()}`,
      title: `${song.title} (Copy)`,
    };
    setSongs((prev) => [...prev, duplicated]);
    setSelectedSongId(duplicated.id);
  };

  const handleMoveSong = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= songs.length) return;

    const copy = [...songs];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setSongs(copy);
  };

  const handleImportSong = (importedSong: Song) => {
    // If updating current song
    if (selectedSong && songs.some((s) => s.id === importedSong.id)) {
      handleUpdateSong(importedSong);
    } else {
      setSongs((prev) => [...prev, importedSong]);
      setSelectedSongId(importedSong.id);
    }
  };

  const handleResetSamples = () => {
    if (
      confirm(
        "Reset songbook to default sample worship songs? Any custom songs will be replaced."
      )
    ) {
      setSongs(INITIAL_SONGS);
      setConfig(DEFAULT_SONGBOOK_CONFIG);
      setSelectedSongId(INITIAL_SONGS[0].id);
      localStorage.removeItem(STORAGE_KEY_SONGS);
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    }
  };

  const handleImportJson = (
    importedSongs: Song[],
    importedConfig?: SongbookConfig
  ) => {
    setSongs(importedSongs);
    if (importedConfig) setConfig(importedConfig);
    if (importedSongs.length > 0) setSelectedSongId(importedSongs[0].id);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 font-sans">
      {/* Top Header */}
      <Header
        songs={songs}
        config={config}
        onAddSong={handleAddSong}
        onOpenSmartPaste={() => setIsSmartPasteOpen(true)}
        onOpenPrintPreview={() => setIsPrintPreviewOpen(true)}
        onResetSamples={handleResetSamples}
        onImportJson={handleImportJson}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Song List */}
        <SongListSidebar
          songs={songs}
          selectedSongId={selectedSongId}
          onSelectSong={(id) => setSelectedSongId(id)}
          onAddSong={handleAddSong}
          onMoveSong={handleMoveSong}
        />

        {/* Right Area: Active Song Editor */}
        {selectedSong ? (
          <SongEditor
            song={selectedSong}
            onChange={handleUpdateSong}
            onDelete={handleDeleteSong}
            onDuplicate={handleDuplicateSong}
            onOpenSmartPaste={() => setIsSmartPasteOpen(true)}
            chordColor={config.chordColor}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <Music className="w-12 h-12 mb-3 text-zinc-300" />
            <h3 className="text-base font-bold text-zinc-700">No Song Selected</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Select a song from the index on the left or create a new song to start editing.
            </p>
            <button
              onClick={handleAddSong}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Create Song
            </button>
          </div>
        )}
      </div>

      {/* Smart Paste & Auto-Converter Modal */}
      <SmartPasteModal
        isOpen={isSmartPasteOpen}
        onClose={() => setIsSmartPasteOpen(false)}
        onImport={handleImportSong}
        existingSong={selectedSong || undefined}
      />

      {/* Print Preview (2 Songs Per Page Side-by-Side) & PDF Export Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        songs={songs}
        config={config}
        onUpdateConfig={setConfig}
      />
    </div>
  );
}
