"use client";

import React, { useState } from "react";
import { Song, MusicalKey } from "@/types/song";
import { parseTwoLineSheet, parseFullChordPro, CHROMATIC_SHARPS } from "@/lib/chord-utils";
import { SongRenderer } from "./SongRenderer";
import { X, Sparkles, Clipboard, ArrowRight } from "lucide-react";

interface SmartPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newSong: Song) => void;
  existingSong?: Song;
}

export const SmartPasteModal: React.FC<SmartPasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
  existingSong,
}) => {
  const [rawText, setRawText] = useState("");
  const [songTitle, setSongTitle] = useState(existingSong?.title || "New Worship Song");
  const [selectedKey, setSelectedKey] = useState<MusicalKey>(
    (existingSong?.currentKey as MusicalKey) || "G"
  );
  const [author, setAuthor] = useState(existingSong?.author || "");
  const [tempo, setTempo] = useState(existingSong?.tempo || "72 BPM");
  const [timeSignature, setTimeSignature] = useState(existingSong?.timeSignature || "4/4");

  if (!isOpen) return null;

  // Real-time parsed preview
  const parseResult = (() => {
    if (!rawText.trim()) return null;

    // Check if it's ChordPro format
    if (rawText.includes("[") && rawText.includes("]")) {
      const parsed = parseFullChordPro(rawText);
      return {
        sections: parsed.sections,
        detectedKey: parsed.key || selectedKey,
        detectedTitle: parsed.title || songTitle,
        detectedArtist: parsed.artist || author,
      };
    }

    // Default to smart 2-line chords over lyrics auto-converter
    const sections = parseTwoLineSheet(rawText);
    return {
      sections,
      detectedKey: selectedKey,
      detectedTitle: songTitle,
      detectedArtist: author,
    };
  })();

  const previewSong: Song | null = parseResult
    ? {
        id: existingSong ? existingSong.id : `song-${Date.now()}`,
        title: parseResult.detectedTitle || songTitle,
        originalKey: parseResult.detectedKey || selectedKey,
        currentKey: parseResult.detectedKey || selectedKey,
        tempo: tempo,
        timeSignature: timeSignature,
        author: parseResult.detectedArtist || author,
        sections: parseResult.sections,
      }
    : null;

  const handleApply = () => {
    if (!previewSong) return;
    onImport(previewSong);
    onClose();
  };

  const handlePasteSample = (type: "twoline" | "chordpro" | "lyrics") => {
    if (type === "twoline") {
      setRawText(`[Chorus]
   G            D/F#          Em         C
Bless the Lord O my soul, O my soul,
   G             Dsus4  D
Worship His Holy name.
   C          Em        C   D   Em
Sing like never before, O my soul,
   C               D    G
I'll worship Your Holy name.

[Verse 1]
    C           G               D           Em
The sun comes up, it's a new day dawning,
    C           G               D      Em
It's time to sing Your song again.`);
      setSongTitle("10,000 Reasons");
      setSelectedKey("G");
      setAuthor("Matt Redman");
    } else if (type === "chordpro") {
      setRawText(`{title: Way Maker}
{artist: Sinach}
{key: E}

[Chorus]
[E]Way maker, miracle worker, [B]promise keeper
[F#m7]Light in the darkness, my God, [A2]that is who You are

[Verse 1]
[E]You are here, moving in our [B]midst
I worship [F#m7]You, I worship [A2]You`);
      setSongTitle("Way Maker");
      setSelectedKey("E");
      setAuthor("Sinach");
    } else {
      setRawText(`Amazing grace how sweet the sound
That saved a wretch like me
I once was lost but now am found
Was blind but now I see`);
      setSongTitle("Amazing Grace");
      setSelectedKey("G");
      setAuthor("John Newton");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Smart Paste & Auto-Alignment
              </h2>
              <p className="text-xs text-zinc-500">
                Paste chords-above-lyrics or ChordPro brackets - we automatically position chords above syllables.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Metadata quick inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Song Title
              </label>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Author / Artist
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Chris Tomlin"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as MusicalKey)}
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CHROMATIC_SHARPS.map((k) => (
                  <option key={k} value={k}>
                    Key of {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Tempo / Time
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  placeholder="74 BPM"
                  className="w-1/2 text-xs px-2 py-1.5 bg-white border border-zinc-200 rounded-lg"
                />
                <input
                  type="text"
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  placeholder="4/4"
                  className="w-1/2 text-xs px-2 py-1.5 bg-white border border-zinc-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Try an example:</span>
            <button
              onClick={() => handlePasteSample("twoline")}
              className="text-blue-600 hover:underline font-medium"
            >
              2-Line Chord Sheet
            </button>
            <span>•</span>
            <button
              onClick={() => handlePasteSample("chordpro")}
              className="text-blue-600 hover:underline font-medium"
            >
              ChordPro Brackets
            </button>
            <span>•</span>
            <button
              onClick={() => handlePasteSample("lyrics")}
              className="text-blue-600 hover:underline font-medium"
            >
              Plain Lyrics
            </button>
          </div>

          {/* Dual columns: Text Area vs Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Paste Raw Song Text Here
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Paste your song here...

Example with 2-lines (chords above):
   G            D          Em      C
Amazing grace, how sweet the sound

Or ChordPro style:
[G]Amazing [D]grace, how [Em]sweet the [C]sound`}
                rows={14}
                className="w-full text-xs font-mono p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                <span>Instant Formatted Preview</span>
                {previewSong && (
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Aligned ({previewSong.sections.length} sections)
                  </span>
                )}
              </label>
              <div className="h-[275px] overflow-y-auto p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                {previewSong ? (
                  <SongRenderer song={previewSong} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs text-center p-4">
                    <Clipboard className="w-8 h-8 mb-2 opacity-50" />
                    Paste or type in the left box to see your song auto-aligned with chords above lyrics!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <div className="text-xs text-zinc-500">
            Tip: You can visually adjust or add more chords after importing!
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!previewSong}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              Apply & Import <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
