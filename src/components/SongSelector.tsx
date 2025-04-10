import { useState } from "react";
import { Search, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { searchTracks, getClientCredentialsToken } from "@/services/spotifyService";
import { Song } from "@/types";

interface SongSelectorProps {
  onSelect: (song: Song) => void;
}

const SongSelector = ({ onSelect }: SongSelectorProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length === 0) {
      toast({
        title: "Please enter a song title or artist",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const tracks = await searchTracks(query);
      setResults(tracks);
      
      if (tracks.length === 0) {
        toast({
          title: "No songs found",
          description: "Try a different search term",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Could not search for songs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (song: Song) => {
    setSelectedSong(song);
    setResults([]);
    setQuery("");
    onSelect(song);
  };

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song or artist"
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ode-burgundy focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-1 rounded-full"
          aria-label="Search for songs"
        >
          <Search size={20} />
        </button>
      </div>

      {isSearching && (
        <div className="flex justify-center my-4">
          <p>Searching...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          {results.map((song) => (
            <div
              key={song.id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(song)}
            >
              {song.albumCover ? (
                <img
                  src={song.albumCover}
                  alt={`${song.title} album cover`}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <Music size={16} />
                </div>
              )}
              <div className="ml-2">
                <p className="font-medium text-sm">{song.title}</p>
                <p className="text-gray-500 text-xs">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSong && (
        <div className="flex items-center bg-gray-100 p-3 rounded-md">
          {selectedSong.albumCover ? (
            <img
              src={selectedSong.albumCover}
              alt={`${selectedSong.title} album cover`}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <Music size={20} />
            </div>
          )}
          <div className="ml-3">
            <p className="font-medium">{selectedSong.title}</p>
            <p className="text-gray-500 text-sm">{selectedSong.artist}</p>
          </div>
          <button
            className="ml-auto text-gray-500 hover:text-red-500"
            onClick={() => {
              setSelectedSong(null);
              onSelect({
                id: "",
                title: "",
                artist: ""
              });
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default SongSelector;
