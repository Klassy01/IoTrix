interface Props {
  text: string;
  sender: "user" | "bot";
}

export default function MessageBubble({ text, sender }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 sm:mb-4 md:mb-5 px-1 sm:px-0 animate-fadeInUp`}>
      <div className={`flex items-start gap-2 sm:gap-3 md:gap-4 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar - Enhanced with IoTrix logo for bot */}
        <div className={`flex-shrink-0 ${isUser ? "" : ""}`}>
          {isUser ? (
            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 ring-2 ring-white/20">
              👤
            </div>
          ) : (
            <div className="relative">
              <img 
                src="/Iotrix.jpeg" 
                alt="IoTrix Bot" 
                className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover shadow-lg ring-2 ring-emerald-400/30 hover:ring-emerald-400/50 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20"></div>
            </div>
          )}
        </div>
        
        {/* Message Content - Enhanced responsiveness and styling */}
        <div className={`relative px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md border-blue-400/30 hover:from-blue-600 hover:to-purple-700"
            : "bg-white/10 border-white/20 text-white rounded-bl-md hover:bg-white/15 hover:border-white/30"
        }`}>
          {/* Message Text - Enhanced typography */}
          <div className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base md:text-base lg:text-base selection:bg-white/20">
            {text}
          </div>
          
          {/* Message Tail - Responsive sizing */}
          <div className={`absolute top-3 sm:top-4 md:top-5 w-2 h-2 sm:w-3 sm:h-3 transition-all duration-300 ${
            isUser 
              ? "right-[-4px] sm:right-[-6px] bg-gradient-to-r from-blue-500 to-purple-600 transform rotate-45"
              : "left-[-4px] sm:left-[-6px] bg-white/10 border-l border-b border-white/20 transform rotate-45"
          }`}></div>
          
          {/* Subtle shimmer effect on hover */}
          <div className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
            isUser ? "animate-shimmer" : ""
          }`}></div>
        </div>
      </div>
    </div>
  );
}
