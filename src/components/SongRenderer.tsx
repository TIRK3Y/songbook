"use client";

import React from "react";
import { Song, SongSection, SongLine } from "@/types/song";
import { segmentizeLine } from "@/lib/chord-utils";

interface SongRendererProps {
  song: Song;
  showChords?: boolean;
  chordColor?: string;
  fontSizeChords?: number;
  fontSizeLyrics?: number;
  fontSizeTitle?: number;
  lineHeight?: number;
  interactive?: boolean;
  onSelectWord?: (sectionId: string, lineId: string, charIndex: number, currentChord?: string, chordId?: string) => void;
  className?: string;
}

export const SongRenderer: React.FC<SongRendererProps> = ({
  song,
  showChords = true,
  chordColor = "#2563eb",
  fontSizeChords = 11,
  fontSizeLyrics = 12,
  fontSizeTitle = 15,
  lineHeight = 1.45,
  interactive = false,
  onSelectWord,
  className = "",
}) => {
  return (
    <div className={`song-container font-sans text-zinc-900 ${className}`}>
      {/* Song Header */}
      <div className="border-b border-zinc-200 pb-2 mb-3">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h2
            className="font-bold tracking-tight text-zinc-950 uppercase"
            style={{ fontSize: `${fontSizeTitle}px` }}
          >
            {song.title || "Untitled Song"}
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
            {song.currentKey && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300">
                Key: <strong className="text-zinc-900">{song.currentKey}</strong>
              </span>
            )}
            {song.capo ? (
              <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                Capo: {song.capo}
              </span>
            ) : null}
            {song.tempo && (
              <span className="text-zinc-500 font-mono text-[11px]">{song.tempo}</span>
            )}
            {song.timeSignature && (
              <span className="text-zinc-500 font-mono text-[11px]">{song.timeSignature}</span>
            )}
          </div>
        </div>
        {song.author && (
          <div className="text-[11px] text-zinc-500 italic mt-0.5">
            {song.author}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {song.sections.map((section: SongSection) => (
          <div key={section.id} className="section-block">
            {/* Section Badge */}
            {section.title && (
              <div className="inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 mb-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {section.title}
              </div>
            )}

            {/* Lines */}
            <div
              className="space-y-1"
              style={{ lineHeight: `${lineHeight}` }}
            >
              {section.lines.map((line: SongLine) => {
                const hasChords = showChords && line.chords && line.chords.length > 0;
                const segments = segmentizeLine(line);

                return (
                  <div key={line.id} className="song-line flex flex-wrap items-end">
                    {segments.map((seg, sIdx) => {
                      return (
                        <span
                          key={sIdx}
                          className={`inline-flex flex-col whitespace-pre ${
                            interactive
                              ? "cursor-pointer rounded hover:bg-blue-50/80 transition-colors px-0.5"
                              : ""
                          }`}
                          onClick={() => {
                            if (interactive && onSelectWord) {
                              onSelectWord(
                                section.id,
                                line.id,
                                seg.startIndex,
                                seg.chord,
                                seg.chordId
                              );
                            }
                          }}
                        >
                          {/* Chord Header above text */}
                          {showChords && (
                            <span
                              className="font-bold font-mono tracking-tight select-none h-4 inline-flex items-center"
                              style={{
                                color: chordColor,
                                fontSize: `${fontSizeChords}px`,
                              }}
                            >
                              {seg.chord || "\u00A0"}
                            </span>
                          )}

                          {/* Lyrics Text */}
                          <span
                            className="font-sans leading-none text-zinc-900"
                            style={{ fontSize: `${fontSizeLyrics}px` }}
                          >
                            {seg.text || "\u00A0"}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
