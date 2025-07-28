interface Props {
  text: string;
  sender: "user" | "bot";
}

export default function MessageBubble({ text, sender }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 sm:mb-4`}>
      <div className={`flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 ${
          isUser 
            ? "bg-gradient-to-r from-blue-500 to-purple-600" 
            : "bg-gradient-to-r from-emerald-500 to-teal-600"
        }`}>
          {isUser ? "👤" : "🤖"}
        </div>
        
        {/* Message Content */}
        <div className={`relative px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-lg ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
            : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-md"
        }`}>
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
            {text}
          </div>
          
          {/* Message Tail */}
          <div className={`absolute top-3 sm:top-4 w-2 h-2 sm:w-3 sm:h-3 ${
            isUser 
              ? "right-[-4px] sm:right-[-6px] bg-gradient-to-r from-blue-500 to-purple-600 transform rotate-45"
              : "left-[-4px] sm:left-[-6px] bg-white/10 border-l border-b border-white/20 transform rotate-45"
          }`}></div>
        </div>
      </div>
    </div>
  );
}
