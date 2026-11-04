export type MusicalKey =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B"
  | "Am"
  | "Em"
  | "Dm"
  | "Bm";

export type SectionType =
  | "verse"
  | "chorus"
  | "bridge"
  | "pre-chorus"
  | "intro"
  | "outro"
  | "instrumental"
  | "tag"
  | "other";

export interface ChordToken {
  id: string;
  chord: string; // e.g. "G", "D/F#", "Em7", "riff", "(2x)"
  position: number; // character index in the line
}

export interface SongLine {
  id: string;
  lyrics: string;
  chords: ChordToken[];
  annotation?: string; // e.g. "(Softly)", "(Band enters)"
}

export interface SongSection {
  id: string;
  type: SectionType;
  title: string; // e.g. "Verse 1", "Chorus", "Bridge"
  lines: SongLine[];
}

export interface Song {
  id: string;
  title: string;
  originalKey: string;
  currentKey: string;
  capo?: number;
  tempo?: string; // e.g. "74 BPM"
  timeSignature?: string; // e.g. "4/4", "3/4", "6/8"
  author?: string; // e.g. "John Newton / Chris Tomlin"
  ccli?: string;
  copyright?: string;
  notes?: string;
  tags?: string[];
  sections: SongSection[];
  spanColumns?: 1 | 2; // 1 = fits one column (2 songs per page), 2 = long song taking entire page
}

export interface SongbookConfig {
  bookTitle: string;
  subtitle: string;
  churchName: string;
  showChords: boolean;
  showDivider: boolean;
  showPageNumbers: boolean;
  showDate: boolean;
  twoSongsPerPage: boolean;
  paperSize: "A4" | "Letter";
  orientation: "landscape" | "portrait";
  chordColor: string; // hex or tailwind class
  fontSizeChords: number; // in pt/px
  fontSizeLyrics: number;
  fontSizeTitle: number;
  lineHeight: number;
  columnGap: number;
}
