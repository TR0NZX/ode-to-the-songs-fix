
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover?: string;
  uri?: string;  // Spotify URI
  previewUrl?: string; // URL for 30 second preview
}

export interface Message {
  id: string;
  recipient: string;
  message: string;
  song: Song;
  date: string;
}

export interface SpotifySearchResult {
  id: string;
  title: string;
  artist: string;
  albumCover?: string;
  uri: string;
  previewUrl?: string; // URL for 30 second preview
}
