
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Music, Play, Pause } from "lucide-react";
import { playSong } from "@/services/spotifyService";
import NotFound from "./NotFound";
import { fetchMessageById } from "@/services/apiService";
import { Message } from "@/types";

const MessagePage = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedMessage = await fetchMessageById(id);
        setMessage(fetchedMessage);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch message:", err);
        setError("Failed to load message. Please try again later.");
        
        // Check local storage as fallback
        const storedHistory = JSON.parse(localStorage.getItem("message-history") || "[]");
        const localMessage = storedHistory.find((m: Message) => m.id === id);
        if (localMessage) {
          setMessage(localMessage);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getMessage();
  }, [id]);

  const handlePlaySong = () => {
    if (!message?.song.previewUrl) return;
    
    setIsPlaying(!isPlaying);
    playSong(message.song.previewUrl);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p>Loading message...</p>
      </div>
    );
  }

  if (!message) {
    return <NotFound />;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-0 max-w-3xl">
        {error && (
          <div className="text-center py-4 mb-6 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2">
            Hello, <span className="handwriting text-3xl">{message.recipient}</span>
          </h1>
          <p className="text-gray-600">
            There's someone sending you a song, they want you to hear
            this song that maybe you'll like :)
          </p>
        </div>

        {/* Song Card */}
        <div className="bg-ode-burgundy rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center text-white">
          <div className="w-32 h-32 bg-gray-300 rounded mb-4 md:mb-0">
            {message.song.albumCover && (
              <img
                src={message.song.albumCover}
                alt={`${message.song.title} album cover`}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
          <div className="md:ml-6 text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-1">SONG</h2>
            <p className="mb-1">{message.song.title}</p>
            <p className="text-gray-200">{message.song.artist}</p>
            <button 
              onClick={handlePlaySong}
              className="mt-4 bg-black text-white px-4 py-2 rounded-full flex items-center mx-auto md:mx-0"
              disabled={!message.song.previewUrl}
            >
              {isPlaying ? (
                <><Pause size={16} className="mr-2" /> Pause Preview</>
              ) : (
                <><Play size={16} className="mr-2" /> Play Preview</>
              )}
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">Also here's a message from the sender:</p>
          <div className="text-center">
            <p className="text-4xl font-handwriting text-ode-burgundy leading-relaxed mb-6">
              {message.message}
            </p>
            <p className="text-gray-500 text-sm">
              sent on {new Date(message.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-12">
          <Link to="/submit" className="btn-primary inline-block">
            Send your own message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
