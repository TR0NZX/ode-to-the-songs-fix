
import { Link } from "react-router-dom";
import { Music, Search, History } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import MessageCard from "@/components/MessageCard";
import { useEffect, useState } from "react";
import { fetchMessages } from "@/services/apiService";
import { Message } from "@/types";

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecentMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await fetchMessages();
        setMessages(fetchedMessages.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load recent messages");
        
        const sampleMessages = [
          {
            id: "1",
            recipient: "Ani",
            message: "Always.",
            date: new Date().toISOString(),
            song: {
              id: "1",
              title: "Always",
              artist: "Bon Jovi",
              albumCover: "https://i.scdn.co/image/ab67616d0000b273b7c05417113f613a3c76c226"
            }
          }
        ];
        setMessages(sampleMessages);
      } finally {
        setLoading(false);
      }
    };

    getRecentMessages();
  }, []);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 md:px-0">
          <h1 className="cursive-heading text-4xl md:text-6xl mb-2">
            Feelings left unspoken,
          </h1>
          <h2 className="cursive-heading text-4xl md:text-6xl mb-6">
            sung through the tune.
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Send your unspoken thoughts through the music.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/submit" className="btn-primary">
              Ready to write
            </Link>
            <Link to="/browse" className="btn-secondary">
              Browse stories
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Share your messages"
              description="Choose a song and write a heartfelt message to someone special or save it as a little gift for yourself"
              icon={<Music size={24} />}
            />
            <FeatureCard
              title="Browse Messages"
              description="Find messages that were written for you. Search your name and uncover heartfelt messages written just for you."
              icon={<Search size={24} />}
            />
            <FeatureCard
              title="Listen Messages"
              description="Tap on any message card to discover the full story behind it and listen to the song that captures the emotion of the moment!"
              icon={<History size={24} />}
            />
          </div>
        </div>
      </section>

      {/* Recent Messages Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-0">
          <h2 className="text-2xl font-semibold text-center mb-12">Recent Messages</h2>
          
          {error && (
            <div className="text-center py-4 mb-6 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading recent messages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  id={message.id}
                  recipient={message.recipient}
                  message={message.message}
                  song={message.song}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
