import { ChordToken, Song, SongLine, SongSection, SectionType } from "@/types/song";

export const CHROMATIC_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const CHROMATIC_FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const CHORD_REGEX = /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G](?:#|b)?)?$/;

// Diatonic chords for major keys
export const KEY_DIATONIC_CHORDS: Record<string, string[]> = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim", "G/B", "F/A", "C/E"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim", "D/F#", "C/E", "G/B"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim", "A/C#", "G/B", "D/F#"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim", "E/G#", "D/F#", "A/C#"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim", "B/D#", "A/C#", "E/G#"],
  B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim", "F#/A#", "E/G#", "B/D#"],
  F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim", "C/E", "Bb/D", "F/A"],
  Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim", "F/A", "Eb/G", "Bb/D"],
  Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim", "Bb/D", "Ab/C", "Eb/G"],
  Ab: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim", "Eb/G", "Db/F", "Ab/C"],
  Db: ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim", "Ab/C", "Gb/Bb", "Db/F"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim", "C#/E#", "B/D#", "F#/A#"],
};

export function normalizeNote(note: string): string {
  const map: Record<string, string> = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
  };
  return map[note] || note;
}

export function transposeSingleNote(note: string, semitones: number, preferFlats = false): string {
  const cleanNote = note.trim();
  let index = CHROMATIC_SHARPS.indexOf(cleanNote);
  if (index === -1) {
    index = CHROMATIC_FLATS.indexOf(cleanNote);
  }
  if (index === -1) return cleanNote;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  const scale = preferFlats ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  return scale[newIndex];
}

export function transposeChord(chord: string, semitones: number, preferFlats = false): string {
  if (!chord || semitones === 0) return chord;

  // Handle slash chord e.g. D/F#
  if (chord.includes("/")) {
    const [main, bass] = chord.split("/");
    return `${transposeChord(main, semitones, preferFlats)}/${transposeSingleNote(bass, semitones, preferFlats)}`;
  }

  // Match root note and chord quality e.g. "F#m7" -> root: "F#", rest: "m7"
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  const [, root, quality] = match;
  const newRoot = transposeSingleNote(root, semitones, preferFlats);
  return `${newRoot}${quality}`;
}

export function isChordToken(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  // Allow common chords and notation markers like 2x, 3x, NC, N.C.
  if (/^(?:NC|N\.C\.|2x|3x|4x|Fine)$/i.test(trimmed)) return true;
  return /^[A-G][b#]?(?:m|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G][b#]?)?$/.test(trimmed);
}

export function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Split by whitespace
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;

  const chordCount = tokens.filter((t) => isChordToken(t)).length;
  // If at least 70% of tokens look like chords, it's a chord line
  return chordCount / tokens.length >= 0.7;
}

export function detectSectionHeader(line: string): { isHeader: boolean; type: SectionType; title: string } {
  const trimmed = line.trim().replace(/^\[|\]$/g, "").trim();
  const lower = trimmed.toLowerCase();

  if (/^(verse\s*\d*|v\d+)/i.test(lower)) {
    return { isHeader: true, type: "verse", title: trimmed };
  }
  if (/^(chorus\s*\d*|refrain)/i.test(lower)) {
    return { isHeader: true, type: "chorus", title: trimmed };
  }
  if (/^bridge/i.test(lower)) {
    return { isHeader: true, type: "bridge", title: trimmed };
  }
  if (/^pre-?chorus/i.test(lower)) {
    return { isHeader: true, type: "pre-chorus", title: trimmed };
  }
  if (/^intro/i.test(lower)) {
    return { isHeader: true, type: "intro", title: trimmed };
  }
  if (/^outro|ending/i.test(lower)) {
    return { isHeader: true, type: "outro", title: trimmed };
  }
  if (/^instrumental|interlude/i.test(lower)) {
    return { isHeader: true, type: "instrumental", title: trimmed };
  }
  if (/^tag/i.test(lower)) {
    return { isHeader: true, type: "tag", title: trimmed };
  }

  return { isHeader: false, type: "other", title: trimmed };
}

/**
 * Smart Auto-Converter for 2-line chords over lyrics paste:
 * e.g.
 *    G               D             Em       C
 * Amazing grace, how sweet the sound
 */
export function parseTwoLineSheet(rawText: string): SongSection[] {
  const rawLines = rawText.split(/\r?\n/);
  const sections: SongSection[] = [];
  let currentSection: SongSection = {
    id: `sec-${Date.now()}-0`,
    type: "verse",
    title: "Verse 1",
    lines: [],
  };

  let i = 0;
  let sectionIndex = 1;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Check if line is a section header (e.g. "[Chorus]" or "Verse 2:")
    const headerCheck = detectSectionHeader(trimmed.replace(/:$/, ""));
    if (headerCheck.isHeader) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        id: `sec-${Date.now()}-${sectionIndex++}`,
        type: headerCheck.type,
        title: headerCheck.title,
        lines: [],
      };
      i++;
      continue;
    }

    // Check if line is a chord line
    if (isChordLine(line)) {
      const chordLine = line;
      const nextLine = i + 1 < rawLines.length ? rawLines[i + 1] : "";

      if (nextLine && !isChordLine(nextLine) && !detectSectionHeader(nextLine.trim()).isHeader) {
        // Paired: chordLine + nextLine (lyrics)
        const chords: ChordToken[] = [];
        const regex = /\S+/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(chordLine)) !== null) {
          chords.push({
            id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            chord: match[0],
            position: match.index,
          });
        }

        currentSection.lines.push({
          id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          lyrics: nextLine,
          chords,
        });

        i += 2; // consumed both
        continue;
      } else {
        // Standalone chord line (e.g., Intro or Instrumental chords)
        const chords: ChordToken[] = [];
        const regex = /\S+/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(chordLine)) !== null) {
          chords.push({
            id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            chord: match[0],
            position: match.index,
          });
        }

        currentSection.lines.push({
          id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          lyrics: "",
          chords,
        });
        i++;
        continue;
      }
    } else {
      // Lyrics-only line (or ChordPro bracket line)
      if (line.includes("[") && line.includes("]")) {
        // Line has inline ChordPro brackets
        const parsed = parseChordProLine(line);
        currentSection.lines.push(parsed);
      } else {
        currentSection.lines.push({
          id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          lyrics: line,
          chords: [],
        });
      }
      i++;
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections.length > 0
    ? sections
    : [
        {
          id: `sec-empty`,
          type: "verse",
          title: "Verse 1",
          lines: [],
        },
      ];
}

/**
 * Parses a single line with ChordPro brackets like:
 * "[G]Amazing [D]grace, how [Em]sweet the [C]sound"
 */
export function parseChordProLine(raw: string): SongLine {
  let cleanLyrics = "";
  const chords: ChordToken[] = [];
  let inBracket = false;
  let currentChord = "";

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === "[") {
      inBracket = true;
      currentChord = "";
    } else if (char === "]" && inBracket) {
      inBracket = false;
      chords.push({
        id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        chord: currentChord.trim(),
        position: cleanLyrics.length,
      });
    } else if (inBracket) {
      currentChord += char;
    } else {
      cleanLyrics += char;
    }
  }

  return {
    id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    lyrics: cleanLyrics,
    chords,
  };
}

/**
 * Converts standard ChordPro text into full Song structure
 */
export function parseFullChordPro(text: string): {
  title?: string;
  artist?: string;
  key?: string;
  tempo?: string;
  timeSignature?: string;
  capo?: number;
  sections: SongSection[];
} {
  const lines = text.split(/\r?\n/);
  const metadata: {
    title?: string;
    artist?: string;
    key?: string;
    tempo?: string;
    timeSignature?: string;
    capo?: number;
  } = {};

  const sections: SongSection[] = [];
  let currentSection: SongSection = {
    id: `sec-${Date.now()}-0`,
    type: "verse",
    title: "Verse 1",
    lines: [],
  };

  let sectionCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check directives {title: ...}, {key: ...}, etc.
    const directiveMatch = trimmed.match(/^\{([a-z_-]+):?\s*(.*)\}$/i);
    if (directiveMatch) {
      const [, directive, value] = directiveMatch;
      const dirLower = directive.toLowerCase();
      const val = value.trim();

      if (dirLower === "title" || dirLower === "t") metadata.title = val;
      else if (dirLower === "artist" || dirLower === "subtitle" || dirLower === "st") metadata.artist = val;
      else if (dirLower === "key") metadata.key = val;
      else if (dirLower === "tempo") metadata.tempo = val;
      else if (dirLower === "time") metadata.timeSignature = val;
      else if (dirLower === "capo") metadata.capo = parseInt(val, 10) || 0;
      else if (dirLower === "comment" || dirLower === "c") {
        const headerCheck = detectSectionHeader(val);
        if (currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        currentSection = {
          id: `sec-${Date.now()}-${sectionCounter++}`,
          type: headerCheck.type,
          title: val,
          lines: [],
        };
      }
      continue;
    }

    // Check bracket section header like [Verse 1], [Chorus]
    const headerCheck = detectSectionHeader(trimmed);
    if (headerCheck.isHeader) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        id: `sec-${Date.now()}-${sectionCounter++}`,
        type: headerCheck.type,
        title: headerCheck.title,
        lines: [],
      };
      continue;
    }

    // Normal line (either chordpro inline brackets or raw lyrics)
    currentSection.lines.push(parseChordProLine(trimmed));
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return {
    ...metadata,
    sections: sections.length > 0 ? sections : parseTwoLineSheet(text),
  };
}

/**
 * Formats a SongLine into ChordPro inline string:
 * e.g. "[G]Amazing [D]grace, how [Em]sweet the [C]sound"
 */
export function formatLineToChordPro(line: SongLine): string {
  if (!line.chords || line.chords.length === 0) {
    return line.lyrics;
  }

  // Sort chords by position ascending
  const sortedChords = [...line.chords].sort((a, b) => a.position - b.position);
  let result = "";
  let lastPos = 0;

  for (const token of sortedChords) {
    const pos = Math.max(0, Math.min(token.position, line.lyrics.length));
    result += line.lyrics.slice(lastPos, pos);
    result += `[${token.chord}]`;
    lastPos = pos;
  }
  result += line.lyrics.slice(lastPos);
  return result;
}

/**
 * Formats an entire Song to ChordPro string
 */
export function formatSongToChordPro(song: Song): string {
  let output = "";
  if (song.title) output += `{title: ${song.title}}\n`;
  if (song.author) output += `{artist: ${song.author}}\n`;
  if (song.currentKey) output += `{key: ${song.currentKey}}\n`;
  if (song.tempo) output += `{tempo: ${song.tempo}}\n`;
  if (song.timeSignature) output += `{time: ${song.timeSignature}}\n`;
  if (song.capo) output += `{capo: ${song.capo}}\n`;
  output += "\n";

  for (const section of song.sections) {
    output += `[${section.title}]\n`;
    for (const line of section.lines) {
      output += formatLineToChordPro(line) + "\n";
    }
    output += "\n";
  }

  return output.trim();
}

/**
 * Transpose all chords across all sections in a Song
 */
export function transposeSong(song: Song, semitones: number): Song {
  if (semitones === 0) return song;

  const preferFlats = ["F", "Bb", "Eb", "Ab", "Db"].includes(song.currentKey);
  const newKey = transposeSingleNote(song.currentKey, semitones, preferFlats);

  const updatedSections: SongSection[] = song.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) => ({
      ...line,
      chords: line.chords.map((token) => ({
        ...token,
        chord: transposeChord(token.chord, semitones, preferFlats),
      })),
    })),
  }));

  return {
    ...song,
    currentKey: newKey,
    sections: updatedSections,
  };
}

/**
 * Splits a line into chunks of syllables with chord attachments
 * for pixel-perfect rendering above words/syllables!
 */
export interface LyricChordSegment {
  chord?: string;
  chordId?: string;
  text: string;
  startIndex: number;
}

export function segmentizeLine(line: SongLine): LyricChordSegment[] {
  if (!line.lyrics && (!line.chords || line.chords.length === 0)) {
    return [{ text: " ", startIndex: 0 }];
  }

  // If there are no chords, return the whole lyrics as one segment
  if (!line.chords || line.chords.length === 0) {
    return [{ text: line.lyrics || " ", startIndex: 0 }];
  }

  // Sort chords by position
  const chords = [...line.chords].sort((a, b) => a.position - b.position);
  const segments: LyricChordSegment[] = [];

  let cursor = 0;
  for (let i = 0; i < chords.length; i++) {
    const current = chords[i];
    const nextChord = chords[i + 1];
    const pos = Math.max(0, current.position);

    // If there is lyrics before this chord
    if (pos > cursor) {
      segments.push({
        text: line.lyrics.substring(cursor, pos),
        startIndex: cursor,
      });
      cursor = pos;
    }

    // Determine how much text belongs to this chord
    const endPos = nextChord ? Math.max(pos, nextChord.position) : line.lyrics.length;
    const segmentText = line.lyrics.substring(pos, endPos);

    segments.push({
      chord: current.chord,
      chordId: current.id,
      text: segmentText || " ",
      startIndex: pos,
    });

    cursor = endPos;
  }

  // Any remaining lyrics after the last chord
  if (cursor < line.lyrics.length) {
    segments.push({
      text: line.lyrics.substring(cursor),
      startIndex: cursor,
    });
  }

  return segments;
}
