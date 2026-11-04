"use client";

import React, { useState } from "react";
import { Song } from "@/types/song";
import {
  BookOpen,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Music,
  FileSpreadsheet,
} from "lucide-react";

interface SongListSidebarProps {
  songs: Song[];
  selectedSongId: string | null;
  onSelectSong: (id: string) => void;
  onAddSong: () => void;
  onMoveSong: (index: number, direction: "up" | "down") => void;
}

export const SongListSidebar: React.FC<SongListSidebarProps> = ({
  songs,
  selectedSongId,
  onSelectSong,
  onAddSong,
  onMoveSong,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.author && s.author.toLowerCase().includes(q)) ||
      s.currentKey.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col h-full select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-sm text-zinc-900">Songbook Index</h2>
        </div>
        <button
          onClick={onAddSong}
          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          title="Add new song"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-zinc-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search songs or keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Songbook Songs List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {filteredSongs.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 text-xs">
            No songs found.
          </div>
        ) : (
          filteredSongs.map((song) => {
            const index = songs.findIndex((s) => s.id === song.id);
            const isSelected = song.id === selectedSongId;

            // Compute page pairing
            const pageNum = Math.floor(index / 2) + 1;
            const side = index % 2 === 0 ? "Left" : "Right";

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song.id)}
                className={`group px-3 py-2.5 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-blue-50/80 border-l-4 border-blue-600"
                    : "hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      #{index + 1}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {song.title || "Untitled"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                    <span className="font-mono font-bold px-1 rounded bg-zinc-100 text-zinc-700 text-[10px]">
                      {song.currentKey}
                    </span>
                    {song.tempo && <span>{song.tempo}</span>}
                    <span className="text-[10px] text-blue-600/80 font-medium">
                      P.{pageNum} ({side})
                    </span>
                  </div>
                </div>

                {/* Move Up/Down Controls */}
                <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-0.5 transition-opacity">
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSong(index, "up");
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20 hover:bg-zinc-200 rounded"
                    title="Move song up in print order"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={index === songs.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSong(index, "down");
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20 hover:bg-zinc-200 rounded"
                    title="Move song down in print order"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Summary */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>{songs.length} total songs</span>
        <span className="font-semibold text-zinc-700">
          {Math.ceil(songs.length / 2)} printed sheets
        </span>
      </div>
    </aside>
  );
};
