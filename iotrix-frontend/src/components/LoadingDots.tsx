export default function LoadingDots() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 relative">
        <div className="flex gap-1 items-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute top-3 sm:top-4 left-[-4px] sm:left-[-6px] w-2 h-2 sm:w-3 sm:h-3 bg-white/10 border-l border-b border-white/20 transform rotate-45"></div>
      </div>
    </div>
  );
}
