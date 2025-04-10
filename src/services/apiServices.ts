
import { Message, Song } from "@/types";

const API_URL = "http://localhost:5000/api";

export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/messages`);
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const fetchMessageById = async (id: string): Promise<Message | null> => {
  try {
    const response = await fetch(`${API_URL}/messages/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch message");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching message:", error);
    return null;
  }
};

export const searchMessages = async (query: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/messages/search/${query}`);
    if (!response.ok) {
      throw new Error("Failed to search messages");
    }
    return response.json();
  } catch (error) {
    console.error("Error searching messages:", error);
    return [];
  }
};

export const createMessage = async (
  recipient: string,
  message: string,
  song: Song
): Promise<Message | null> => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        message,
        song,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create message");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
};
