import React from "react";
import ChatbotWidget from "../components/ChatbotWidget";
import { AuthProvider } from "../components/Auth/AuthProvider";

export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
      <ChatbotWidget />
    </AuthProvider>
  );
}
