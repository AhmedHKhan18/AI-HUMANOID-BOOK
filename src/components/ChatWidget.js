import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = ({
  backendUrl = 'http://localhost:8000/chat', // Default backend URL, replace with your actual URL
  initialOpen = false,
  welcomeMessage = "Hello! I'm your AI assistant. Ask me anything about Physical AI & Humanoid Robotics.",
  placeholder = "Ask about Physical AI & Humanoid Robotics..."
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ bottom: '20px', right: '20px' });
  const messagesEndRef = useRef(null);
  const floatButtonRef = useRef(null);

  const toggleChat = () => {
    if (floatButtonRef.current) {
      const rect = floatButtonRef.current.getBoundingClientRect();
      const rightPos = window.innerWidth - rect.right;
      const bottomPos = window.innerHeight - rect.top + 10; // 10px above the button

      setPosition({
        bottom: `${bottomPos}px`,
        right: `${rightPos}px`
      });
    }
    setIsOpen(!isOpen);
  };

  // Scroll to bottom of messages when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update position when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && floatButtonRef.current) {
        const rect = floatButtonRef.current.getBoundingClientRect();
        const rightPos = window.innerWidth - rect.right;
        const bottomPos = window.innerHeight - rect.top + 10;

        setPosition({
          bottom: `${bottomPos}px`,
          right: `${rightPos}px`
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    
    try {
      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        text: inputValue,
        senderId: 'current-user',
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');

      // Call the backend API
      const response = await callOpenAIAPI([...messages, userMessage]);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: response,
        senderId: 'system',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        senderId: 'system',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  // Call backend FastAPI endpoint
  const callOpenAIAPI = async (conversationHistory) => {
    // Call your FastAPI backend instead of OpenAI directly
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          query: inputValue, // The current user query
          // You can add more fields as needed for your backend
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API request failed with status ${response.status}`);
      }

      const data = await response.json();
      // Adjust based on your API response structure
      // Assuming your FastAPI returns a JSON with a 'response' field
      return data.response || data.answer || data.message || data.content;
    } catch (error) {
      console.error('Error calling backend API:', error);
      // Fallback response in case of error
      return `I'm sorry, I encountered an error processing your request. ${error.message || 'Please try again later.'}`;
    }
  };

  return (
    <>
      {/* Floating chat icon */}
      {!isOpen && (
        <button
          ref={floatButtonRef}
          className="chat-float-button"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="chat-modal-content positioned animated"
          style={{
            bottom: position.bottom,
            right: position.right,
          }}
        >
          {/* Chat header */}
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages container */}
          <div className="chat-messages" ref={messagesEndRef}>
            {messages.length === 0 ? (
              <div className="welcome-message">
                {welcomeMessage}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.senderId === 'current-user' ? 'user-message' : 'ai-message'}`}
                >
                  {message.text}
                </div>
              ))
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;