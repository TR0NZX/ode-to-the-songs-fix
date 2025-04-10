
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClientCredentialsToken } from "@/services/spotifyService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const success = await getClientCredentialsToken();
      
      if (success) {
        toast({
          title: "Connected to Spotify",
          description: "You can now search and share songs",
        });
      } else {
        toast({
          title: "Failed to connect to Spotify",
          description: "Please try again",
          variant: "destructive"
        });
      }
      navigate("/submit");
    };
    
    getToken();
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <p className="text-lg">Connecting to Spotify...</p>
    </div>
  );
};

export default SpotifyCallback;
