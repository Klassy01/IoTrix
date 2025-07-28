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
      {/* Header - Enhanced with IoTrix logo */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 shadow-xl flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* IoTrix Logo */}
            <div className="relative">
              <img 
                src="/Iotrix.jpeg" 
                alt="IoTrix Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover shadow-lg ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">IoTrix</h1>
              <p className="text-xs sm:text-sm md:text-base text-purple-200 font-medium">IoT & Network Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container - Enhanced responsiveness */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full min-h-0 px-2 sm:px-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 space-y-3 sm:space-y-4">
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-2 sm:px-4">
              {/* Welcome Logo */}
              <div className="relative mb-4 sm:mb-6">
                <img 
                  src="/Iotrix.jpeg" 
                  alt="IoTrix Welcome" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 animate-pulse"></div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-lg"></div>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to IoTrix!
              </h2>
              <p className="text-purple-200 max-w-xs sm:max-w-md md:max-w-lg text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                Your intelligent IoT and network assistant. I'm here to help you with smart devices, 
                network protocols, troubleshooting, and technical guidance.
              </p>
              
              {/* Enhanced Suggested Questions */}
              <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-200 mb-3 sm:mb-4">
                  Try asking me about:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {suggestedQuestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(suggestion)}
                      className="group p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-left text-purple-100 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-sm sm:text-base hover:scale-105 active:scale-95 touch-manipulation shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-400 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-0.5">
                          ⚡
                        </span>
                        <span className="group-hover:text-white transition-colors">
                          {suggestion}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {chat.map((c, i) => (
            <div key={i} className="space-y-2 sm:space-y-3 animate-fadeInUp">
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

        {/* Input Section - Enhanced mobile responsiveness */}
        <div className="p-3 sm:p-4 md:p-6 bg-white/5 backdrop-blur-md border-t border-white/20 flex-shrink-0 safe-area-bottom">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[40px] sm:min-h-[44px] max-h-24 sm:max-h-32 text-sm sm:text-base touch-manipulation"
                placeholder="Ask about IoT, networks, or tech..."
                rows={1}
                disabled={isLoading}
              />
              {message && (
                <button
                  onClick={() => setMessage("")}
                  className="absolute right-2 sm:right-3 top-2 sm:top-3 text-purple-300 hover:text-white transition-colors p-1 touch-manipulation"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-xs sm:text-sm md:text-base min-w-[50px] sm:min-w-[60px] md:min-w-[80px] flex items-center justify-center touch-manipulation"
            >
              {isLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="hidden sm:inline">Send</span>
                  <svg className="w-3 h-3 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-2 text-center hidden sm:block">
            Press Enter to send • Shift + Enter for new line
          </p>
          {/* Mobile hint */}
          <p className="text-xs text-purple-300 mt-1 text-center block sm:hidden">
            Tap Send to chat
          </p>
        </div>
      </div>
    </div>
  );
}
