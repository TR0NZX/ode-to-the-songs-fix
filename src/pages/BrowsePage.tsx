
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import MessageCard from "@/components/MessageCard";
import { fetchMessages, searchMessages } from "@/services/apiService";
import { Message } from "@/types";

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsSearching(true);
      try {
        const fetchedMessages = await fetchMessages();
        setAllMessages(fetchedMessages);
        setMessages(fetchedMessages);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setIsSearching(false);
      }
    };

    loadMessages();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      if (!query.trim()) {
        // If query is empty, show all messages
        setMessages(allMessages);
      } else {
        // Search for messages matching the query
        const results = await searchMessages(query);
        setMessages(results);
      }
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-0">
        {/* Search Section */}
        <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-semibold mb-2">Find Message</h1>
          <p className="mb-4 text-blue-100">
            Scroll the latest messages or start typing recipient name to find your messages
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <SearchBox 
                onSearch={setSearchQuery} 
                placeholder="Enter recipient's name"
              />
            </div>
            <button
              className="btn-primary bg-gray-800 hover:bg-gray-900"
              onClick={() => handleSearch(searchQuery)}
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center py-4 mb-6 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        {isSearching ? (
          <div className="text-center py-12">
            <p>Searching...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map(message => (
              <MessageCard
                key={message.id}
                id={message.id}
                recipient={message.recipient}
                message={message.message}
                song={message.song}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
