"use client";

import React, { useState } from "react";
import { Song, SongbookConfig } from "@/types/song";
import { SongRenderer } from "./SongRenderer";
import {
  Printer,
  X,
  Sliders,
  Eye,
  Scissors,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  config: SongbookConfig;
  onUpdateConfig: (config: SongbookConfig) => void;
}

interface PagePair {
  pageNumber: number;
  leftSong: Song | null;
  rightSong: Song | null;
  fullPageSong?: Song | null;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  songs,
  config,
  onUpdateConfig,
}) => {
  const [zoomScale, setZoomScale] = useState(0.85);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  if (!isOpen) return null;

  // Build pages: 2 songs per page side by side
  const pages: PagePair[] = [];
  let pageNum = 1;
  let sIdx = 0;

  while (sIdx < songs.length) {
    const current = songs[sIdx];
    if (current.spanColumns === 2) {
      // Takes full page
      pages.push({
        pageNumber: pageNum++,
        leftSong: null,
        rightSong: null,
        fullPageSong: current,
      });
      sIdx++;
    } else {
      const left = current;
      const right = sIdx + 1 < songs.length && songs[sIdx + 1].spanColumns !== 2 ? songs[sIdx + 1] : null;
      pages.push({
        pageNumber: pageNum++,
        leftSong: left,
        rightSong: right,
      });
      sIdx += right ? 2 : 1;
    }
  }

  const handlePrint = () => {
    // Print triggers native browser print dialog, which supports Save as PDF directly
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-900/90 backdrop-blur-md text-white animate-in fade-in">
      {/* Top Action Bar (Hidden on print) */}
      <div className="no-print flex items-center justify-between px-6 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Songbook Print & PDF Export
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                2 Songs Per Page (Side by Side)
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Total {songs.length} songs across {pages.length} printed sheets ({config.paperSize}{" "}
              {config.orientation})
            </p>
          </div>
        </div>

        {/* Central Controls: Zoom & Page navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-800/80 rounded-lg p-1 border border-zinc-700">
            <button
              onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))}
              className="p-1.5 text-zinc-300 hover:text-white rounded hover:bg-zinc-700 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-zinc-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.min(1.3, prev + 0.1))}
              className="p-1.5 text-zinc-300 hover:text-white rounded hover:bg-zinc-700 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              showSettingsPanel
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Page Layout
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Export as PDF / Print
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Drawer (Hidden on print) */}
        {showSettingsPanel && (
          <div className="no-print w-80 bg-zinc-950 border-r border-zinc-800 p-5 space-y-5 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Print & Layout Options
            </h3>

            {/* Paper Size & Orientation */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Paper Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateConfig({ ...config, paperSize: "A4" })}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      config.paperSize === "A4"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    A4 (210×297mm)
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ ...config, paperSize: "Letter" })}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      config.paperSize === "Letter"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    US Letter
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateConfig({ ...config, orientation: "landscape" })}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      config.orientation === "landscape"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    Landscape (Side-by-Side)
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ ...config, orientation: "portrait" })}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      config.orientation === "portrait"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    Portrait (2 Columns)
                  </button>
                </div>
              </div>
            </div>

            {/* Typography Sizing Sliders */}
            <div className="space-y-4 pt-3 border-t border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-300">Typography Sizing</h4>
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Chord Size</span>
                  <span className="font-mono">{config.fontSizeChords} pt</span>
                </div>
                <input
                  type="range"
                  min={9}
                  max={14}
                  step={0.5}
                  value={config.fontSizeChords}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, fontSizeChords: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Lyrics Size</span>
                  <span className="font-mono">{config.fontSizeLyrics} pt</span>
                </div>
                <input
                  type="range"
                  min={9}
                  max={15}
                  step={0.5}
                  value={config.fontSizeLyrics}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, fontSizeLyrics: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Song Title Size</span>
                  <span className="font-mono">{config.fontSizeTitle} pt</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={config.fontSizeTitle}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, fontSizeTitle: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Display Toggles */}
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-300">Elements</h4>
              <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                <span>Print Chords</span>
                <input
                  type="checkbox"
                  checked={config.showChords}
                  onChange={(e) => onUpdateConfig({ ...config, showChords: e.target.checked })}
                  className="rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                <span>Center Cutting / Fold Divider</span>
                <input
                  type="checkbox"
                  checked={config.showDivider}
                  onChange={(e) => onUpdateConfig({ ...config, showDivider: e.target.checked })}
                  className="rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                <span>Page Numbers</span>
                <input
                  type="checkbox"
                  checked={config.showPageNumbers}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, showPageNumbers: e.target.checked })
                  }
                  className="rounded accent-blue-600"
                />
              </label>
            </div>

            {/* Running Header Details */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-300">
                Book Header Title
              </label>
              <input
                type="text"
                value={config.bookTitle}
                onChange={(e) => onUpdateConfig({ ...config, bookTitle: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
              />
              <label className="block text-xs font-semibold text-zinc-300">
                Church / Ministry Name
              </label>
              <input
                type="text"
                value={config.churchName}
                onChange={(e) => onUpdateConfig({ ...config, churchName: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
              />
            </div>
          </div>
        )}

        {/* Scrollable Sheets Preview */}
        <div className="flex-1 overflow-auto p-8 flex flex-col items-center gap-10 bg-zinc-900/60">
          {pages.map((page) => {
            const isLandscape = config.orientation === "landscape";
            // Landscape A4 aspect ratio 297mm x 210mm (~ 1.414 ratio)
            // In screen preview pixels: 1050px width x 742px height
            const sheetWidth = isLandscape ? 1050 : 760;
            const sheetMinHeight = isLandscape ? 742 : 1050;

            return (
              <div
                key={page.pageNumber}
                className="printable-sheet bg-white text-zinc-900 shadow-2xl rounded-sm transition-transform duration-200 border border-zinc-300 relative flex flex-col justify-between"
                style={{
                  width: `${sheetWidth}px`,
                  minHeight: `${sheetMinHeight}px`,
                  transform: `scale(${zoomScale})`,
                  transformOrigin: "top center",
                  padding: "24px 28px",
                  marginBottom: `${(zoomScale - 1) * 300}px`,
                }}
              >
                {/* Running Header on top of each page */}
                <div className="sheet-header flex items-center justify-between pb-2 mb-3 border-b border-zinc-300 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>{config.bookTitle}</span>
                  <span>{config.churchName}</span>
                  {config.showDate && (
                    <span>{new Date().toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>
                  )}
                </div>

                {/* 2 Songs Side by Side Content */}
                <div className="sheet-body flex-1 grid grid-cols-2 gap-6 relative">
                  {/* Left Column (Song 1) */}
                  <div className="song-col-left flex flex-col pr-3">
                    {page.leftSong ? (
                      <SongRenderer
                        song={page.leftSong}
                        showChords={config.showChords}
                        chordColor={config.chordColor}
                        fontSizeChords={config.fontSizeChords}
                        fontSizeLyrics={config.fontSizeLyrics}
                        fontSizeTitle={config.fontSizeTitle}
                        lineHeight={config.lineHeight}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-zinc-300 italic text-xs">
                        (Blank Column)
                      </div>
                    )}
                  </div>

                  {/* Center Vertical Divider with Scissors Icon */}
                  {config.showDivider && (
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                      <div className="h-4 border-l border-dashed border-zinc-300" />
                      <Scissors className="w-3.5 h-3.5 text-zinc-400 rotate-90 my-1" />
                      <div className="flex-1 border-l border-dashed border-zinc-300" />
                    </div>
                  )}

                  {/* Right Column (Song 2) */}
                  <div className="song-col-right flex flex-col pl-3">
                    {page.rightSong ? (
                      <SongRenderer
                        song={page.rightSong}
                        showChords={config.showChords}
                        chordColor={config.chordColor}
                        fontSizeChords={config.fontSizeChords}
                        fontSizeLyrics={config.fontSizeLyrics}
                        fontSizeTitle={config.fontSizeTitle}
                        lineHeight={config.lineHeight}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-lg p-6 text-zinc-400 text-xs text-center">
                        <FileText className="w-8 h-8 mb-2 text-zinc-300" />
                        <span>Notes & Prayer Requests Space</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Running Footer on bottom of each page */}
                <div className="sheet-footer flex items-center justify-between pt-2 mt-3 border-t border-zinc-300 text-[10px] text-zinc-400 font-medium">
                  <span>
                    Songs: {page.leftSong?.title || "—"} &amp; {page.rightSong?.title || "—"}
                  </span>
                  {config.showPageNumbers && (
                    <span className="font-mono font-bold text-zinc-600">
                      Page {page.pageNumber} of {pages.length}
                    </span>
                  )}
                  <span>WordConnect Songbook System</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
