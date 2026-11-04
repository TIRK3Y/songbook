"use client";

import React, { useState } from "react";
import { Song, SongSection, SongLine, ChordToken } from "@/types/song";
import { KEY_DIATONIC_CHORDS } from "@/lib/chord-utils";
import { Plus, Trash2, Edit2, Check, Music, X, ChevronDown, ChevronUp } from "lucide-react";

interface VisualChordEditorProps {
  song: Song;
  onChange: (updatedSong: Song) => void;
  chordColor?: string;
}

export const VisualChordEditor: React.FC<VisualChordEditorProps> = ({
  song,
  onChange,
  chordColor = "#2563eb",
}) => {
  // Active target for adding/editing a chord
  const [activeSlot, setActiveSlot] = useState<{
    sectionId: string;
    lineId: string;
    charIndex: number;
    wordText: string;
    existingChordId?: string;
    existingChord?: string;
  } | null>(null);

  const [customChordInput, setCustomChordInput] = useState("");
  const [editingLyricsLineId, setEditingLyricsLineId] = useState<string | null>(null);
  const [lyricsDraft, setLyricsDraft] = useState("");

  const currentKeyChords = KEY_DIATONIC_CHORDS[song.currentKey] || KEY_DIATONIC_CHORDS["G"];
  const notationPresets = ["(Intro)", "(2x)", "(3x)", "N.C.", "(Softly)", "(Build)", "(Outro)"];

  const handleApplyChord = (chordValue: string) => {
    if (!activeSlot || !chordValue.trim()) return;

    const { sectionId, lineId, charIndex, existingChordId } = activeSlot;

    const updatedSections = song.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;

      const updatedLines = sec.lines.map((ln) => {
        if (ln.id !== lineId) return ln;

        let newChords = [...(ln.chords || [])];
        if (existingChordId) {
          // Update existing chord
          newChords = newChords.map((ch) =>
            ch.id === existingChordId ? { ...ch, chord: chordValue.trim() } : ch
          );
        } else {
          // Add new chord token at character position
          const newToken: ChordToken = {
            id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            chord: chordValue.trim(),
            position: charIndex,
          };
          newChords.push(newToken);
        }

        // Sort chords by position
        newChords.sort((a, b) => a.position - b.position);
        return { ...ln, chords: newChords };
      });

      return { ...sec, lines: updatedLines };
    });

    onChange({ ...song, sections: updatedSections });
    setActiveSlot(null);
    setCustomChordInput("");
  };

  const handleRemoveChord = (sectionId: string, lineId: string, chordId: string) => {
    const updatedSections = song.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const updatedLines = sec.lines.map((ln) => {
        if (ln.id !== lineId) return ln;
        return {
          ...ln,
          chords: (ln.chords || []).filter((ch) => ch.id !== chordId),
        };
      });
      return { ...sec, lines: updatedLines };
    });

    onChange({ ...song, sections: updatedSections });
    if (activeSlot?.existingChordId === chordId) {
      setActiveSlot(null);
    }
  };

  const handleUpdateLyrics = (sectionId: string, lineId: string, newText: string) => {
    const updatedSections = song.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const updatedLines = sec.lines.map((ln) => {
        if (ln.id !== lineId) return ln;
        // Clamp chord positions if lyrics shortened
        const clampedChords = (ln.chords || []).map((ch) => ({
          ...ch,
          position: Math.min(ch.position, Math.max(0, newText.length - 1)),
        }));
        return { ...ln, lyrics: newText, chords: clampedChords };
      });
      return { ...sec, lines: updatedLines };
    });

    onChange({ ...song, sections: updatedSections });
    setEditingLyricsLineId(null);
  };

  const handleAddLine = (sectionId: string) => {
    const updatedSections = song.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newLine: SongLine = {
        id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        lyrics: "New lyric line",
        chords: [],
      };
      return { ...sec, lines: [...sec.lines, newLine] };
    });
    onChange({ ...song, sections: updatedSections });
  };

  const handleDeleteLine = (sectionId: string, lineId: string) => {
    const updatedSections = song.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, lines: sec.lines.filter((ln) => ln.id !== lineId) };
    });
    onChange({ ...song, sections: updatedSections });
  };

  const handleAddSection = () => {
    const newSec: SongSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: "verse",
      title: `Verse ${song.sections.length + 1}`,
      lines: [
        {
          id: `line-${Date.now()}-1`,
          lyrics: "Enter lyrics here...",
          chords: [],
        },
      ],
    };
    onChange({ ...song, sections: [...song.sections, newSec] });
  };

  const handleDeleteSection = (sectionId: string) => {
    onChange({
      ...song,
      sections: song.sections.filter((s) => s.id !== sectionId),
    });
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    onChange({
      ...song,
      sections: song.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    });
  };

  // Helper to split a line's lyrics into clickable word tokens
  const renderInteractiveLine = (sec: SongSection, line: SongLine) => {
    const lyrics = line.lyrics || "";
    // Match words and intervening spaces
    const tokens: { text: string; startIndex: number; isSpace: boolean }[] = [];
    const regex = /(\S+|\s+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(lyrics)) !== null) {
      tokens.push({
        text: match[0],
        startIndex: match.index,
        isSpace: /^\s+$/.test(match[0]),
      });
    }

    if (tokens.length === 0) {
      tokens.push({ text: "(empty line - click to add chord/lyrics)", startIndex: 0, isSpace: false });
    }

    return (
      <div className="flex flex-wrap items-end gap-y-2 py-1">
        {tokens.map((token, tIdx) => {
          if (token.isSpace) {
            return (
              <span key={tIdx} className="whitespace-pre">
                {token.text}
              </span>
            );
          }

          // Find if there's any chord stationed near this token
          const chordOnThisToken = (line.chords || []).find(
            (c) => c.position >= token.startIndex && c.position < token.startIndex + token.text.length
          );

          const isSlotActive =
            activeSlot?.sectionId === sec.id &&
            activeSlot?.lineId === line.id &&
            activeSlot?.charIndex === token.startIndex;

          return (
            <div
              key={tIdx}
              className={`group/word relative inline-flex flex-col items-center rounded-md px-1 py-0.5 transition-all cursor-pointer ${
                isSlotActive
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "hover:bg-zinc-100 hover:ring-1 hover:ring-zinc-300"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlot({
                  sectionId: sec.id,
                  lineId: line.id,
                  charIndex: chordOnThisToken ? chordOnThisToken.position : token.startIndex,
                  wordText: token.text,
                  existingChordId: chordOnThisToken?.id,
                  existingChord: chordOnThisToken?.chord,
                });
                setCustomChordInput(chordOnThisToken?.chord || "");
              }}
            >
              {/* Chord pill above word */}
              <div className="h-5 flex items-center justify-center">
                {chordOnThisToken ? (
                  <span
                    className="font-mono font-bold text-xs px-1.5 py-0.2 rounded shadow-xs"
                    style={{
                      color: chordColor,
                      backgroundColor: `${chordColor}15`,
                    }}
                  >
                    {chordOnThisToken.chord}
                  </span>
                ) : (
                  <span className="opacity-0 group-hover/word:opacity-100 text-[10px] font-bold text-zinc-400 bg-white border border-zinc-200 px-1 rounded">
                    +chord
                  </span>
                )}
              </div>

              {/* Word text */}
              <span className="text-sm font-medium text-zinc-800 leading-none pt-0.5">
                {token.text}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Floating or Sticky Chord Palette when a syllable/word is selected */}
      {activeSlot && (
        <div className="sticky top-2 z-30 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-blue-200 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-50 text-blue-600">
                <Music className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                  Attaching chord to:
                </span>{" "}
                <strong className="text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded text-sm">
                  "{activeSlot.wordText}"
                </strong>
                {activeSlot.existingChord && (
                  <span className="ml-2 text-xs text-zinc-400">
                    (Current: <strong className="text-blue-600">{activeSlot.existingChord}</strong>)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveSlot(null)}
              className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Diatonic Chords for Current Key */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-zinc-500 mb-1.5 flex items-center justify-between">
              <span>Quick Chords in Key of {song.currentKey}:</span>
              <span className="text-[10px] text-zinc-400">Click to place above word</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentKeyChords.map((ch) => (
                <button
                  key={ch}
                  onClick={() => handleApplyChord(ch)}
                  className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-2xs active:scale-95"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Musical Annotations & Notations */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-zinc-500 mb-1.5">
              Notations & Performance Notes:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {notationPresets.map((note) => (
                <button
                  key={note}
                  onClick={() => handleApplyChord(note)}
                  className="px-2 py-0.5 text-[11px] rounded border border-dashed border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Chord Input & Remove */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Or type custom chord (e.g. Dsus4, F#m/C#, 2x)..."
                value={customChordInput}
                onChange={(e) => setCustomChordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyChord(customChordInput);
                }}
                className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => handleApplyChord(customChordInput)}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" /> Place
            </button>
            {activeSlot.existingChordId && (
              <button
                onClick={() =>
                  handleRemoveChord(
                    activeSlot.sectionId,
                    activeSlot.lineId,
                    activeSlot.existingChordId!
                  )
                }
                className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                title="Remove chord from this word"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-5">
        {song.sections.map((section, secIdx) => (
          <div
            key={section.id}
            className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3"
          >
            {/* Section Header Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  className="font-bold text-sm uppercase tracking-wider text-zinc-800 bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-300 rounded px-2 py-0.5 focus:outline-none"
                />
                <span className="text-xs text-zinc-400">({section.lines.length} lines)</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddLine(section.id)}
                  className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </button>
                {song.sections.length > 1 && (
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-zinc-400 hover:text-red-500 p-1 rounded hover:bg-zinc-100 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Lines */}
            <div className="space-y-2">
              {section.lines.map((line) => {
                const isEditingLyrics = editingLyricsLineId === line.id;

                return (
                  <div
                    key={line.id}
                    className="group relative p-2 rounded-lg bg-zinc-50/70 hover:bg-zinc-50 border border-zinc-100 transition-colors"
                  >
                    {isEditingLyrics ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={lyricsDraft}
                          onChange={(e) => setLyricsDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateLyrics(section.id, line.id, lyricsDraft);
                            }
                          }}
                          autoFocus
                          className="flex-1 text-sm px-2 py-1 bg-white border border-blue-400 rounded focus:outline-none ring-1 ring-blue-400 font-sans"
                        />
                        <button
                          onClick={() => handleUpdateLyrics(section.id, line.id, lyricsDraft)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingLyricsLineId(null)}
                          className="px-2 py-1 text-zinc-500 hover:bg-zinc-200 text-xs rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">{renderInteractiveLine(section, line)}</div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pt-2">
                          <button
                            onClick={() => {
                              setEditingLyricsLineId(line.id);
                              setLyricsDraft(line.lyrics);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-200"
                            title="Edit lyrics text"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteLine(section.id, line.id)}
                            className="p-1 text-zinc-400 hover:text-red-600 rounded hover:bg-zinc-200"
                            title="Delete this line"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={handleAddSection}
          className="w-full py-3 border-2 border-dashed border-zinc-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-zinc-600 hover:text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Section (Verse, Chorus, Bridge...)
        </button>
      </div>
    </div>
  );
};
