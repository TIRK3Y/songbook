import { Song, SongbookConfig } from "@/types/song";

export const DEFAULT_SONGBOOK_CONFIG: SongbookConfig = {
  bookTitle: "WORSHIP & PRAISE SONGBOOK",
  subtitle: "Chords & Lyrics Collection",
  churchName: "Grace Fellowship / WordConnect Edition",
  showChords: true,
  showDivider: true,
  showPageNumbers: true,
  showDate: true,
  twoSongsPerPage: true,
  paperSize: "A4",
  orientation: "landscape",
  chordColor: "#2563eb", // vibrant royal blue for clarity
  fontSizeChords: 11,
  fontSizeLyrics: 12,
  fontSizeTitle: 15,
  lineHeight: 1.45,
  columnGap: 24,
};

export const INITIAL_SONGS: Song[] = [
  {
    id: "song-1",
    title: "Amazing Grace",
    originalKey: "G",
    currentKey: "G",
    tempo: "70 BPM",
    timeSignature: "3/4",
    author: "John Newton (1779)",
    sections: [
      {
        id: "ag-v1",
        type: "verse",
        title: "Verse 1",
        lines: [
          {
            id: "ag-l1",
            lyrics: "Amazing grace! how sweet the sound,",
            chords: [
              { id: "c1", chord: "G", position: 0 },
              { id: "c2", chord: "C", position: 15 },
              { id: "c3", chord: "G", position: 29 },
            ],
          },
          {
            id: "ag-l2",
            lyrics: "That saved a wretch like me!",
            chords: [{ id: "c4", chord: "D", position: 17 }],
          },
          {
            id: "ag-l3",
            lyrics: "I once was lost, but now am found,",
            chords: [
              { id: "c5", chord: "G", position: 0 },
              { id: "c6", chord: "G7", position: 11 },
              { id: "c7", chord: "C", position: 17 },
              { id: "c8", chord: "G", position: 28 },
            ],
          },
          {
            id: "ag-l4",
            lyrics: "Was blind, but now I see.",
            chords: [
              { id: "c9", chord: "Em", position: 4 },
              { id: "c10", chord: "D", position: 15 },
              { id: "c11", chord: "G", position: 21 },
            ],
          },
        ],
      },
      {
        id: "ag-v2",
        type: "verse",
        title: "Verse 2",
        lines: [
          {
            id: "ag-l5",
            lyrics: "'Twas grace that taught my heart to fear,",
            chords: [
              { id: "c12", chord: "G", position: 0 },
              { id: "c13", chord: "C", position: 16 },
              { id: "c14", chord: "G", position: 32 },
            ],
          },
          {
            id: "ag-l6",
            lyrics: "And grace my fears relieved;",
            chords: [{ id: "c15", chord: "D", position: 13 }],
          },
          {
            id: "ag-l7",
            lyrics: "How precious did that grace appear",
            chords: [
              { id: "c16", chord: "G", position: 0 },
              { id: "c17", chord: "G7", position: 12 },
              { id: "c18", chord: "C", position: 22 },
              { id: "c19", chord: "G", position: 28 },
            ],
          },
          {
            id: "ag-l8",
            lyrics: "The hour I first believed!",
            chords: [
              { id: "c20", chord: "Em", position: 4 },
              { id: "c21", chord: "D", position: 11 },
              { id: "c22", chord: "G", position: 19 },
            ],
          },
        ],
      },
      {
        id: "ag-v3",
        type: "verse",
        title: "Verse 3",
        lines: [
          {
            id: "ag-l9",
            lyrics: "When we've been there ten thousand years,",
            chords: [
              { id: "c23", chord: "G", position: 0 },
              { id: "c24", chord: "C", position: 19 },
              { id: "c25", chord: "G", position: 33 },
            ],
          },
          {
            id: "ag-l10",
            lyrics: "Bright shining as the sun,",
            chords: [{ id: "c26", chord: "D", position: 14 }],
          },
          {
            id: "ag-l11",
            lyrics: "We've no less days to sing God's praise",
            chords: [
              { id: "c27", chord: "G", position: 0 },
              { id: "c28", chord: "G7", position: 13 },
              { id: "c29", chord: "C", position: 22 },
              { id: "c30", chord: "G", position: 33 },
            ],
          },
          {
            id: "ag-l12",
            lyrics: "Than when we first begun.",
            chords: [
              { id: "c31", chord: "Em", position: 5 },
              { id: "c32", chord: "D", position: 13 },
              { id: "c33", chord: "G", position: 20 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "song-2",
    title: "10,000 Reasons (Bless The Lord)",
    originalKey: "G",
    currentKey: "G",
    capo: 0,
    tempo: "73 BPM",
    timeSignature: "4/4",
    author: "Matt Redman / Jonas Myrin",
    sections: [
      {
        id: "tr-ch",
        type: "chorus",
        title: "Chorus",
        lines: [
          {
            id: "tr-l1",
            lyrics: "Bless the Lord O my soul, O my soul,",
            chords: [
              { id: "tc1", chord: "C", position: 0 },
              { id: "tc2", chord: "G", position: 15 },
              { id: "tc3", chord: "D/F#", position: 25 },
              { id: "tc4", chord: "Em", position: 31 },
            ],
          },
          {
            id: "tr-l2",
            lyrics: "Worship His Holy name.",
            chords: [
              { id: "tc5", chord: "C", position: 0 },
              { id: "tc6", chord: "G", position: 8 },
              { id: "tc7", chord: "Dsus4", position: 16 },
              { id: "tc8", chord: "D", position: 21 },
            ],
          },
          {
            id: "tr-l3",
            lyrics: "Sing like never before, O my soul,",
            chords: [
              { id: "tc9", chord: "C", position: 0 },
              { id: "tc10", chord: "Em", position: 10 },
              { id: "tc11", chord: "C", position: 23 },
              { id: "tc12", chord: "D", position: 25 },
              { id: "tc13", chord: "Em", position: 30 },
            ],
          },
          {
            id: "tr-l4",
            lyrics: "I'll worship Your Holy name.",
            chords: [
              { id: "tc14", chord: "C", position: 0 },
              { id: "tc15", chord: "D", position: 5 },
              { id: "tc16", chord: "G", position: 17 },
            ],
          },
        ],
      },
      {
        id: "tr-v1",
        type: "verse",
        title: "Verse 1",
        lines: [
          {
            id: "tr-l5",
            lyrics: "The sun comes up, it's a new day dawning,",
            chords: [
              { id: "tc17", chord: "C", position: 0 },
              { id: "tc18", chord: "G", position: 13 },
              { id: "tc19", chord: "D", position: 24 },
              { id: "tc20", chord: "Em", position: 32 },
            ],
          },
          {
            id: "tr-l6",
            lyrics: "It's time to sing Your song again.",
            chords: [
              { id: "tc21", chord: "C", position: 0 },
              { id: "tc22", chord: "G", position: 13 },
              { id: "tc23", chord: "D", position: 23 },
              { id: "tc24", chord: "Em", position: 29 },
            ],
          },
          {
            id: "tr-l7",
            lyrics: "Whatever may pass and whatever lies before me,",
            chords: [
              { id: "tc25", chord: "C", position: 0 },
              { id: "tc26", chord: "G", position: 14 },
              { id: "tc27", chord: "D", position: 23 },
              { id: "tc28", chord: "Em", position: 37 },
            ],
          },
          {
            id: "tr-l8",
            lyrics: "Let me be singing when the evening comes.",
            chords: [
              { id: "tc29", chord: "C2", position: 0 },
              { id: "tc30", chord: "G", position: 10 },
              { id: "tc31", chord: "Dsus4", position: 27 },
              { id: "tc32", chord: "G", position: 35 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "song-3",
    title: "How Great Is Our God",
    originalKey: "C",
    currentKey: "C",
    tempo: "78 BPM",
    timeSignature: "4/4",
    author: "Chris Tomlin / Ed Cash",
    sections: [
      {
        id: "hg-v1",
        type: "verse",
        title: "Verse 1",
        lines: [
          {
            id: "hg-l1",
            lyrics: "The splendor of a King, clothed in majesty;",
            chords: [
              { id: "hc1", chord: "C", position: 0 },
              { id: "hc2", chord: "Am7", position: 25 },
            ],
          },
          {
            id: "hg-l2",
            lyrics: "Let all the earth rejoice, all the earth rejoice.",
            chords: [
              { id: "hc3", chord: "F2", position: 0 },
              { id: "hc4", chord: "G", position: 30 },
            ],
          },
          {
            id: "hg-l3",
            lyrics: "He wraps Himself in light, and darkness tries to hide,",
            chords: [
              { id: "hc5", chord: "C", position: 0 },
              { id: "hc6", chord: "Am7", position: 27 },
            ],
          },
          {
            id: "hg-l4",
            lyrics: "And trembles at His voice, and trembles at His voice.",
            chords: [
              { id: "hc7", chord: "F2", position: 0 },
              { id: "hc8", chord: "G", position: 30 },
            ],
          },
        ],
      },
      {
        id: "hg-ch",
        type: "chorus",
        title: "Chorus",
        lines: [
          {
            id: "hg-l5",
            lyrics: "How great is our God, sing with me,",
            chords: [
              { id: "hc9", chord: "C", position: 0 },
              { id: "hc10", chord: "G/B", position: 15 },
              { id: "hc11", chord: "Am7", position: 22 },
            ],
          },
          {
            id: "hg-l6",
            lyrics: "How great is our God, and all will see,",
            chords: [
              { id: "hc12", chord: "F", position: 0 },
              { id: "hc13", chord: "G", position: 22 },
            ],
          },
          {
            id: "hg-l7",
            lyrics: "How great, how great is our God!",
            chords: [
              { id: "hc14", chord: "C", position: 0 },
              { id: "hc15", chord: "C", position: 24 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "song-4",
    title: "Yeshu Masih Tere Jaisa Hai Koi Nahi",
    originalKey: "D",
    currentKey: "D",
    tempo: "80 BPM",
    timeSignature: "4/4",
    author: "Traditional Hindi Worship",
    sections: [
      {
        id: "ym-ch",
        type: "chorus",
        title: "Chorus",
        lines: [
          {
            id: "ym-l1",
            lyrics: "Yeshu Masih tere jaisa hai koi nahi,",
            chords: [
              { id: "yc1", chord: "D", position: 0 },
              { id: "yc2", chord: "Bm", position: 12 },
              { id: "yc3", chord: "G", position: 24 },
              { id: "yc4", chord: "A", position: 32 },
            ],
          },
          {
            id: "ym-l2",
            lyrics: "Tere charno mein jhuke aasmaan aur zameen.",
            chords: [
              { id: "yc5", chord: "D", position: 0 },
              { id: "yc6", chord: "Bm", position: 16 },
              { id: "yc7", chord: "G", position: 28 },
              { id: "yc8", chord: "A", position: 38 },
            ],
          },
        ],
      },
      {
        id: "ym-v1",
        type: "verse",
        title: "Verse 1",
        lines: [
          {
            id: "ym-l3",
            lyrics: "Hum gaaye Hosanna, Tu rajao ka raja,",
            chords: [
              { id: "yc9", chord: "D", position: 0 },
              { id: "yc10", chord: "F#m", position: 10 },
              { id: "yc11", chord: "G", position: 20 },
              { id: "yc12", chord: "A", position: 32 },
            ],
          },
          {
            id: "ym-l4",
            lyrics: "Teri mahima gaayein srishti saari yahan.",
            chords: [
              { id: "yc13", chord: "D", position: 0 },
              { id: "yc14", chord: "Bm", position: 12 },
              { id: "yc15", chord: "G", position: 26 },
              { id: "yc16", chord: "A", position: 35 },
            ],
          },
        ],
      },
    ],
  },
];
