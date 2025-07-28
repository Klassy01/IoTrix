import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import LoadingDots from "./LoadingDots";

interface Chat {
  user: string;
  bot: string;
}

export default function ChatUI() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage("");
    setIsLoading(true);
    
    // Add user message immediately
    setChat(prev => [...prev, { user: userMsg, bot: "" }]);

    try {
      const res = await fetch(
        `/api/chat?user_message=${encodeURIComponent(userMsg)}`,
        { method: "POST" }
      );
      const data = await res.text();

      // Update with bot response
      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1 ? { ...c, bot: data } : c
        )
      );
    } catch (error) {
      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1 ? { ...c, bot: "Sorry, I'm having trouble connecting. Please try again." } : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How do I configure a WiFi router?",
    "What's the difference between IoT protocols?",
    "Help me troubleshoot my smart home device",
    "Explain network security best practices"
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3 sm:px-6 sm:py-4 shadow-xl flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-lg sm:text-xl">🚀</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white">IoTrix</h1>
              <p className="text-xs sm:text-sm text-purple-200">IoT & Network Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to IoTrix!</h2>
              <p className="text-purple-200 max-w-md text-sm sm:text-base mb-6">
                I'm here to help you with IoT devices, networking, and technical questions. 
                Ask me anything about smart devices, network protocols, or troubleshooting!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedQuestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(suggestion)}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-left text-purple-100 hover:bg-white/20 transition-all duration-200 text-sm hover:scale-105 active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {chat.map((c, i) => (
            <div key={i} className="space-y-3 animate-fadeInUp">
              <MessageBubble text={c.user} sender="user" />
              {c.bot ? (
                <MessageBubble text={c.bot} sender="bot" />
              ) : (
                <LoadingDots />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-md border-t border-white/20 flex-shrink-0">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[44px] max-h-32 text-sm sm:text-base"
                placeholder="Ask me about IoT, networking, or tech support..."
                rows={1}
                disabled={isLoading}
              />
              {message && (
                <button
                  onClick={() => setMessage("")}
                  className="absolute right-2 sm:right-3 top-2 sm:top-3 text-purple-300 hover:text-white transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-sm sm:text-base min-w-[60px] sm:min-w-[80px] flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="hidden sm:inline">Send</span>
              )}
              {!isLoading && (
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-2 text-center hidden sm:block">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
