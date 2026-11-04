# WordConnect Songbook Pro
## High-Density 2-Up Side-by-Side Printable Songbook and Chord Formatter

WordConnect Songbook Pro is a Next.js application tailored for worship leaders, choir directors, church bands, and acoustic musicians. It resolves the common challenge of manual chord placement over lyrics and formats songs for print in a 2-up, side-by-side spread on a single page with vector-quality PDF export.

---

## Overview

In traditional text processors, placing chords above lyrics requires tedious manual spacing that breaks across different devices and print engines. WordConnect Songbook Pro automates chord-to-syllable alignment, provides interactive point-and-click placement tools, supports standard ChordPro syntax, and arranges songs side-by-side in a two-column spread optimized for printing and PDF generation.

---

## Core Features

### 1. Automated Chord-to-Lyric Alignment
* **Smart Two-Line Tab Auto-Converter:** Paste plain chord sheets where chords are written on the line directly above the lyrics. The parser calculates character offsets and locks each chord above its exact syllable.
* **Visual Syllable Click-to-Place Editor:** Paste raw lyrics and click directly on any syllable or word to attach, adjust, or remove a chord.
* **Diatonic Chord Palette:** Automatically generates the diatonic chord scale for the song's active key (for example, in the Key of G: G, Am, Bm, C, D, Em, F#dim, D/F#) for single-click assignment.
* **ChordPro Bracket Support:** Bi-directional synchronization with ChordPro bracket notation (`[G]Amazing [D]grace, how [Em]sweet the [C]sound`).
* **Performance and Notation Badges:** Insert musical cues such as `(Intro)`, `(2x)`, `(3x)`, `N.C.`, `(Softly)`, `(Build)`, and `(Outro)`.

### 2. Side-by-Side 2-Up Print and PDF Layout
* **Two Songs per Page Spread:** Designed specifically for church hymnals, binders, and service handouts on A4 Landscape and US Letter.
  * **Left Column:** Song A (Title, Key, Capo, Tempo, Time Signature, Author/Hymnist, Section Badges, Chords, and Lyrics).
  * **Right Column:** Song B (Title, Key, Capo, Tempo, Time Signature, Author/Hymnist, Section Badges, Chords, and Lyrics).
* **Folding and Cutting Guide:** Optional central dotted divider with a cutting guideline.
* **Running Headers and Footers:** Configurable book title, church/ministry name, date, song pairing references, and dynamic page numbering.
* **Print Customization Sliders:** Adjust chord font size, lyric font size, line spacing, and title size to ensure long songs fit comfortably on a single page.
* **Lyrics-Only Toggle:** Switch off chord display to instantly print congregational lyric sheets.

### 3. Musical Utilities
* **Key Transposition:** Shift songs up or down in semitones (-1 / +1) or select a new key directly. All chords (including slash chords such as `D/F#` and `A/C#`) update automatically.
* **Capo and Tempo Calculation:** Define capo fret positions, BPM tempo indicators, and time signatures (4/4, 3/4, 6/8).

### 4. Storage and Data Portability
* **Automatic Local Persistence:** Songs and layout preferences are automatically saved in local storage.
* **JSON Import and Export:** Backup the entire songbook catalog to a portable JSON file or import existing catalogs.

---

## Technical Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 with custom print stylesheet
* **Icons:** Lucide React
* **Output:** Browser-native vector PDF generation via `@media print` rules

---

## Project Structure

```text
songbook/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind styles and print media rules
│   │   ├── layout.tsx          # Root HTML layout and metadata
│   │   └── page.tsx            # Main application studio
│   ├── components/
│   │   ├── Header.tsx               # Navigation, backup, and print triggers
│   │   ├── PrintPreviewModal.tsx    # 2-up side-by-side spread and PDF engine
│   │   ├── SmartPasteModal.tsx      # Tab auto-converter and parser
│   │   ├── SongEditor.tsx           # Metadata, transposition, and tab switcher
│   │   ├── SongListSidebar.tsx      # Song index and print order management
│   │   ├── SongRenderer.tsx         # Syllable-aligned chord renderer
│   │   └── VisualChordEditor.tsx    # Syllable click-to-place editor
│   ├── lib/
│   │   ├── chord-utils.ts      # Chord parsing, transposition, and segmentization
│   │   └── default-songs.ts    # Initial sample hymns and worship songs
│   └── types/
│       └── song.ts             # TypeScript definitions for songs and layouts
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js v20 or later
* npm v10 or later

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/TIRK3Y/songbook.git
cd songbook
npm install
```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Instructions for PDF Export

1. Open the songbook in the browser and click **Print / Export PDF** in the top navigation bar.
2. In the preview modal, verify the side-by-side song pairs and adjust typography sliders if necessary.
3. Click **Export as PDF / Print** (or press `Ctrl + P`).
4. In the print dialog:
   * **Destination:** Save as PDF
   * **Layout:** Landscape
   * **Margins:** Default or None
   * **Options:** Enable "Background graphics"
5. Save the generated vector PDF.

---

## License

This project is licensed under the MIT License.
