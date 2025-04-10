
import { useState } from "react";
import { Info } from "lucide-react";
import SongSelector from "@/components/SongSelector";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createMessage } from "@/services/apiService";
import { Song } from "@/types";

const SubmitPage = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient.trim()) {
      toast({
        title: "Recipient is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSong || !selectedSong.id) {
      toast({
        title: "Please select a song",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newMessage = await createMessage(recipient, message, selectedSong);
      
      if (newMessage) {
        toast({
          title: "Message submitted successfully!",
        });
        
        const history = JSON.parse(localStorage.getItem("message-history") || "[]");
        history.push({
          ...newMessage,
          date: new Date().toISOString()
        });
        localStorage.setItem("message-history", JSON.stringify(history));
        
        navigate("/history");
      } else {
        throw new Error("Failed to create message");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Failed to submit message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-0 max-w-2xl">
        {/* Message Deletion Notice */}
        <div className="bg-blue-600 text-white p-6 rounded-lg mb-8 flex items-start gap-3">
          <Info className="mt-1 flex-shrink-0" size={20} />
          <div>
            <h2 className="font-semibold mb-2">Message Deletion Not Available</h2>
            <p className="text-sm text-blue-100">
              Currently, we do not support message deletion. Once a message is posted, it
              cannot be removed. Please ensure your messages are appropriate before submitting.
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit}>
          {/* Recipient */}
          <div className="mb-6">
            <label htmlFor="recipient" className="block text-gray-700 font-medium mb-2">
              Recipient
            </label>
            <input 
              id="recipient"
              type="text" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient's name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ode-burgundy focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea 
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ode-burgundy focus:border-transparent"
            />
          </div>

          {/* Song Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Song
            </label>
            <SongSelector 
              onSelect={(song) => setSelectedSong(song)}
            />
            <p className="text-gray-500 text-xs mt-2">
              Total available songs: 10512
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage;
