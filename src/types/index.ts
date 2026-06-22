export interface EventItem {
  title: string;
  category: 'world' | 'science' | 'politics' | 'pop-culture';
  description: string;
}

export interface AlbumItem {
  title: string;
  artist: string;
  releaseDate?: string;
  coverUrl?: string;
  genre?: string;
}

export interface GenreItem {
  name: string;
  popularity: number; // 0 to 100
}

export interface SoundtrackTrack {
  title: string;
  artist: string;
  description: string;
}

export interface MusicSnapshot {
  artists: string[];
  albums: AlbumItem[];
  genres: GenreItem[];
  trends: string[];
  soundtrack: SoundtrackTrack[];
}

export interface TimeCapsule {
  averageSalary: string;
  popularJobs: string[];
  fashion: string[];
  technology: string[];
  musicHabits: string[];
  lifestyle: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'artist' | 'genre' | 'event' | 'album';
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphConnection {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface HistoricalSnapshot {
  year: number;
  narrative: string;
  events: EventItem[];
  music: MusicSnapshot;
  capsule: TimeCapsule;
  connections: GraphConnection;
}

export interface CompareResult {
  yearA: number;
  yearB: number;
  narrativeA: string;
  narrativeB: string;
  eventsA: EventItem[];
  eventsB: EventItem[];
  musicA: MusicSnapshot;
  musicB: MusicSnapshot;
  capsuleA: TimeCapsule;
  capsuleB: TimeCapsule;
  comparisonNarrative: string;
}
