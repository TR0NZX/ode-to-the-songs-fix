import { Link } from "react-router-dom";
import { Music, Play, Pause } from "lucide-react";
import { playSong } from "@/services/spotifyService";
import { useState } from "react";

interface MessageCardProps {
  id: string;
  recipient: string;
  message: string;
  song: {
    title: string;
    artist: string;
    albumCover?: string;
    uri?: string;
    previewUrl?: string;
  };
}

const MessageCard = ({ id, recipient, message, song }: MessageCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySong = (e: React.MouseEvent) => {
    e.preventDefault();
    
    setIsPlaying(!isPlaying);
    
    if (song.previewUrl) {
      playSong(song.previewUrl);
    }
  };

  return (
    <div className="message-card animate-fade-in">
      <div className="mb-6">
        <p className="text-gray-500 text-sm mb-2">To: {recipient}</p>
        <p className="message-text">{message}</p>
      </div>
      <div className="flex items-center bg-gray-100 rounded-md p-2">
        <div className="w-12 h-12 bg-gray-300 rounded">
          {song.albumCover && (
            <img 
              src={song.albumCover} 
              alt={`${song.title} album cover`}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>
        <div className="ml-3 flex-grow">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs text-gray-500 truncate">{song.artist}</p>
        </div>
        <button 
          onClick={handlePlaySong}
          className="spotify-button"
          aria-label={isPlaying ? "Pause song" : "Play song"}
          disabled={!song.previewUrl}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
      <div className="mt-4 text-right">
        <Link 
          to={`/message/${id}`}
          className="text-sm text-ode-burgundy hover:underline"
        >
          View full message
        </Link>
      </div>
    </div>
  );
};

export default MessageCard;
