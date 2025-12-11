import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatbotWidget.css';

// =============================================================================
// CONFIGURATION - Replace with your actual FastAPI backend URL
// =============================================================================
const API_CONFIG = {
  // TODO: Replace this URL with your FastAPI RAG endpoint
  BASE_URL: 'https://backend-chatbot-ai-book.up.railway.app',
  CHAT_ENDPOINT: '/chat',
};

// =============================================================================
// ChatbotWidget Component
// =============================================================================
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('ready'); // ready | connected | error
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Capture selected text from the page
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 0) {
        setSelectedText(text);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset selected text when opening
      setSelectedText('');
    }
  };

  // Close chat window
  const closeChat = () => {
    setIsOpen(false);
  };

  // Clear selected text context
  const clearSelectedText = () => {
    setSelectedText('');
  };

  // Send message to backend
  const sendMessage = async (e) => {
    e?.preventDefault();

    const query = inputValue.trim();
    if (!query || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: query,
      context: selectedText || null,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);

    // Add placeholder for AI response
    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }]);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CHAT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          selected_text: selectedText || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is streaming (SSE/EventSource pattern)
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream') || contentType?.includes('text/plain')) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE format if present
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                }
              } catch {
                // Plain text chunk
                fullContent += data;
              }
            } else if (line.trim() && !line.startsWith(':')) {
              // Plain text without SSE format
              fullContent += line;
            }
          }

          // Update message with streamed content
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: fullContent }
              : msg
          ));
        }

        // Finalize streaming
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ));
        setConnectionStatus('connected');
      } else {
        // Handle JSON response
        const data = await response.json();
        const aiContent = data.response || data.message || data.answer || data.content || 'No response received.';

        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: aiContent, isStreaming: false }
            : msg
        ));
        setConnectionStatus('connected');
      }

      // Clear selected text after successful send
      setSelectedText('');

    } catch (error) {
      console.error('Chat API Error:', error);
      setConnectionStatus('error');

      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
              ...msg,
              content: `Connection error: Unable to reach the AI assistant. Please check that the backend server is running at ${API_CONFIG.BASE_URL}`,
              isStreaming: false,
              isError: true,
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setConnectionStatus('ready');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-float-button ${isOpen ? 'chat-float-button--active' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        title="Chat with AI Assistant"
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <ChatIcon />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-modal-content animated" ref={chatWindowRef}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-icon">
                <BotIcon />
              </div>
              <div className="chat-header-info">
                <h3>AI Book Assistant</h3>
                <span className={`chat-status chat-status--${connectionStatus}`}>
                  {connectionStatus === 'ready' && 'Ready to chat'}
                  {connectionStatus === 'connected' && 'Connected'}
                  {connectionStatus === 'error' && 'Connection error'}
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="chat-header-btn"
              >
                <TrashIcon />
              </button>
              <button
                onClick={closeChat}
                title="Close chat"
                className="chat-header-btn"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Selected Text Context Banner */}
          {selectedText && (
            <div className="chat-context-banner">
              <div className="chat-context-content">
                <span className="chat-context-label">Selected context:</span>
                <span className="chat-context-text">
                  {selectedText.length > 100
                    ? `${selectedText.substring(0, 100)}...`
                    : selectedText}
                </span>
              </div>
              <button
                onClick={clearSelectedText}
                className="chat-context-clear"
                title="Clear context"
              >
                <CloseIcon />
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">
                  <BotIcon />
                </div>
                <h4>Welcome!</h4>
                <p>
                  Ask me anything about Physical AI & Humanoid Robotics.
                  You can also select text on the page to provide context for your questions.
                </p>
                <div className="chat-suggestions">
                  <button
                    className="chat-suggestion"
                    onClick={() => setInputValue('What are the key concepts in humanoid robotics?')}
                  >
                    Key concepts in robotics
                  </button>
                  <button
                    className="chat-suggestion"
                    onClick={() => setInputValue('Explain Vision-Language-Action models')}
                  >
                    VLA models explained
                  </button>
                  <button
                    className="chat-suggestion"
                    onClick={() => setInputValue('How does reinforcement learning work in robotics?')}
                  >
                    RL in robotics
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'} ${message.isError ? 'error-message' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="message-avatar">
                      <BotIcon />
                    </div>
                  )}
                  <div className="message-content">
                    {message.context && (
                      <div className="message-context">
                        <span className="context-label">Context:</span>
                        <span className="context-text">
                          {message.context.length > 50
                            ? `${message.context.substring(0, 50)}...`
                            : message.context}
                        </span>
                      </div>
                    )}
                    <div className="message-text">
                      {message.content || (message.isStreaming && <TypingIndicator />)}
                    </div>
                    {message.isStreaming && message.content && (
                      <span className="streaming-cursor" />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="chat-input-form" onSubmit={sendMessage}>
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedText ? "Ask about selected text..." : "Type your message..."}
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                title="Send message"
              >
                {isLoading ? <LoadingSpinner /> : <SendIcon />}
              </button>
            </div>
            <div className="chat-input-hint">
              Press Enter to send
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// =============================================================================
// Icon Components
// =============================================================================

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
