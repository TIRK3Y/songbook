"use client";

import React, { useRef } from "react";
import { Song, SongbookConfig } from "@/types/song";
import {
  BookOpen,
  Printer,
  Sparkles,
  Plus,
  Download,
  Upload,
  RotateCcw,
  Music,
} from "lucide-react";

interface HeaderProps {
  songs: Song[];
  config: SongbookConfig;
  onAddSong: () => void;
  onOpenSmartPaste: () => void;
  onOpenPrintPreview: () => void;
  onResetSamples: () => void;
  onImportJson: (importedSongs: Song[], importedConfig?: SongbookConfig) => void;
}

export const Header: React.FC<HeaderProps> = ({
  songs,
  config,
  onAddSong,
  onOpenSmartPaste,
  onOpenPrintPreview,
  onResetSamples,
  onImportJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      config,
      songs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.bookTitle.toLowerCase().replace(/\s+/g, "-")}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.songs)) {
          onImportJson(parsed.songs, parsed.config);
        } else if (Array.isArray(parsed)) {
          onImportJson(parsed);
        }
      } catch (err) {
        alert("Failed to parse songbook JSON file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <header className="no-print h-14 bg-white border-b border-zinc-200 px-5 flex items-center justify-between select-none shadow-2xs">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-black text-zinc-900 tracking-tight flex items-center gap-2">
            WordConnect Songbook Pro
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              2-Up Print Studio
            </span>
          </h1>
          <p className="text-[11px] text-zinc-400 font-medium leading-none">
            Lyrics &amp; Chords Formatter for 2 Songs Per Printed Page
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSmartPaste}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
          title="Smart Paste auto-detector"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Smart Paste
        </button>

        <button
          onClick={onAddSong}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Song
        </button>

        {/* Print / PDF Button */}
        <button
          onClick={onOpenPrintPreview}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>

        <div className="h-5 w-px bg-zinc-200 mx-1" />

        {/* Backup / Export Menu */}
        <button
          onClick={handleExportJson}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          title="Export Songbook to JSON file"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          title="Import Songbook from JSON file"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={onResetSamples}
          className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          title="Reset to default sample songs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
