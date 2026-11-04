"use client";

import React, { useState } from "react";
import { Song, MusicalKey } from "@/types/song";
import { VisualChordEditor } from "./VisualChordEditor";
import { SongRenderer } from "./SongRenderer";
import {
  transposeSong,
  CHROMATIC_SHARPS,
  formatSongToChordPro,
  parseFullChordPro,
} from "@/lib/chord-utils";
import {
  Sparkles,
  ArrowUpDown,
  Music2,
  Eye,
  Code,
  Sliders,
  Trash2,
  Copy,
  Plus,
} from "lucide-react";

interface SongEditorProps {
  song: Song;
  onChange: (updatedSong: Song) => void;
  onDelete: (id: string) => void;
  onDuplicate: (song: Song) => void;
  onOpenSmartPaste: () => void;
  chordColor?: string;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  song,
  onChange,
  onDelete,
  onDuplicate,
  onOpenSmartPaste,
  chordColor = "#2563eb",
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "preview" | "chordpro">("visual");
  const [chordProDraft, setChordProDraft] = useState("");

  const handleTranspose = (semitones: number) => {
    const transposed = transposeSong(song, semitones);
    onChange(transposed);
  };

  const handleKeySelect = (newKey: string) => {
    const oldKey = song.currentKey;
    const oldIdx = CHROMATIC_SHARPS.indexOf(oldKey);
    const newIdx = CHROMATIC_SHARPS.indexOf(newKey);
    if (oldIdx !== -1 && newIdx !== -1) {
      const diff = newIdx - oldIdx;
      handleTranspose(diff);
    } else {
      onChange({ ...song, currentKey: newKey });
    }
  };

  const handleOpenChordProTab = () => {
    setChordProDraft(formatSongToChordPro(song));
    setActiveTab("chordpro");
  };

  const handleSaveChordPro = () => {
    const parsed = parseFullChordPro(chordProDraft);
    onChange({
      ...song,
      title: parsed.title || song.title,
      author: parsed.artist || song.author,
      currentKey: parsed.key || song.currentKey,
      tempo: parsed.tempo || song.tempo,
      timeSignature: parsed.timeSignature || song.timeSignature,
      capo: parsed.capo ?? song.capo,
      sections: parsed.sections,
    });
    setActiveTab("visual");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50/60 overflow-hidden">
      {/* Top Song Header & Metadata Bar */}
      <div className="p-5 bg-white border-b border-zinc-200 space-y-4 shadow-2xs">
        {/* Title & Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <input
              type="text"
              value={song.title}
              onChange={(e) => onChange({ ...song, title: e.target.value })}
              placeholder="Song Title..."
              className="w-full text-xl sm:text-2xl font-black text-zinc-900 bg-transparent hover:bg-zinc-50 focus:bg-white border-b-2 border-transparent focus:border-blue-600 px-1 py-0.5 rounded transition-colors focus:outline-none"
            />
            <input
              type="text"
              value={song.author || ""}
              onChange={(e) => onChange({ ...song, author: e.target.value })}
              placeholder="Author / Artist / Hymnist..."
              className="w-full text-xs text-zinc-500 bg-transparent hover:bg-zinc-50 focus:bg-white px-1 py-0.5 rounded focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSmartPaste}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              title="Paste a chord sheet and auto-align chords"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Smart Paste
            </button>
            <button
              onClick={() => onDuplicate(song)}
              className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Duplicate song"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(song.id)}
              className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete song"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Music Meta & Transpose Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-zinc-100 text-xs">
          {/* Key & Transposition */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-500">Key:</span>
            <select
              value={song.currentKey}
              onChange={(e) => handleKeySelect(e.target.value)}
              className="font-bold font-mono px-2 py-1 bg-zinc-100 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900"
            >
              {CHROMATIC_SHARPS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            {/* Transpose -1 / +1 Buttons */}
            <div className="flex items-center bg-zinc-100 rounded-md border border-zinc-300 p-0.5">
              <button
                onClick={() => handleTranspose(-1)}
                className="px-2 py-0.5 font-bold hover:bg-white rounded text-zinc-700 hover:text-blue-600 transition-colors"
                title="Transpose down 1 semitone"
              >
                ♭ -1
              </button>
              <span className="text-[10px] text-zinc-400 px-1">|</span>
              <button
                onClick={() => handleTranspose(1)}
                className="px-2 py-0.5 font-bold hover:bg-white rounded text-zinc-700 hover:text-blue-600 transition-colors"
                title="Transpose up 1 semitone"
              >
                ♯ +1
              </button>
            </div>
          </div>

          {/* Capo & Tempo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-semibold">Capo:</span>
              <input
                type="number"
                min={0}
                max={10}
                value={song.capo || 0}
                onChange={(e) =>
                  onChange({ ...song, capo: parseInt(e.target.value, 10) || 0 })
                }
                className="w-12 px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-center font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-semibold">Tempo:</span>
              <input
                type="text"
                value={song.tempo || ""}
                onChange={(e) => onChange({ ...song, tempo: e.target.value })}
                placeholder="74 BPM"
                className="w-20 px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-mono text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-semibold">Time:</span>
              <input
                type="text"
                value={song.timeSignature || "4/4"}
                onChange={(e) => onChange({ ...song, timeSignature: e.target.value })}
                placeholder="4/4"
                className="w-14 px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-mono text-center"
              />
            </div>
          </div>

          {/* Editor Mode Tabs */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setActiveTab("visual")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                activeTab === "visual"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Music2 className="w-3.5 h-3.5" /> Visual Chord Placer
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                activeTab === "preview"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Column Preview
            </button>
            <button
              onClick={handleOpenChordProTab}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                activeTab === "chordpro"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Code className="w-3.5 h-3.5" /> ChordPro Text
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "visual" && (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-zinc-500 bg-blue-50/70 border border-blue-200/60 p-3 rounded-xl">
                <span>
                  💡 <strong>How to place chords:</strong> Click on any word or syllable below to attach, edit, or remove chords. You can also edit the lyrics text inline!
                </span>
                <button
                  onClick={onOpenSmartPaste}
                  className="font-bold text-blue-600 hover:underline shrink-0 ml-2"
                >
                  Or paste entire song &rarr;
                </button>
              </div>

              <VisualChordEditor
                song={song}
                onChange={onChange}
                chordColor={chordColor}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-xl mx-auto">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest pb-3 mb-4 border-b border-zinc-100 flex items-center justify-between">
                <span>Single Column Print View</span>
                <span className="text-zinc-500 font-mono">Key: {song.currentKey}</span>
              </div>
              <SongRenderer song={song} chordColor={chordColor} />
            </div>
          )}

          {activeTab === "chordpro" && (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">
                    ChordPro Direct Editor
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Chords enclosed in brackets like <code>[G]Amazing [D]grace</code>.
                  </p>
                </div>
                <button
                  onClick={handleSaveChordPro}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Save &amp; Update
                </button>
              </div>
              <textarea
                value={chordProDraft}
                onChange={(e) => setChordProDraft(e.target.value)}
                rows={18}
                className="w-full text-xs font-mono p-4 bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
