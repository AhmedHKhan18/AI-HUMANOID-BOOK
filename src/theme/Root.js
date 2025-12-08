import React from "react";
import ChatWidget from '../components/ChatWidget';

export default function Root({ children }) {
  return (
    <>
      {children}
      {/* Chat Widget - appears on every page */}
      <ChatWidget
        backendUrl={'http://localhost:8000/chat'} // Replace with your actual backend URL
        welcomeMessage="Hello! I'm your AI assistant for Physical AI & Humanoid Robotics. Ask me anything about the content in this textbook."
        placeholder="Ask about robotics, AI, machine learning, or humanoid systems..."
      />
    </>
  );
}
