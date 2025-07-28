export default function LoadingDots() {
  return (
    <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 animate-fadeInUp">
      {/* IoTrix Logo Avatar */}
      <div className="relative flex-shrink-0">
        <img 
          src="/Iotrix.jpeg" 
          alt="IoTrix Bot Typing" 
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover shadow-lg ring-2 ring-emerald-400/30 animate-pulse"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20"></div>
      </div>
      
      {/* Typing Indicator */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 relative shadow-lg">
        <div className="flex gap-1 sm:gap-1.5 items-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0.1s'}}></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute top-3 sm:top-4 md:top-5 left-[-4px] sm:left-[-6px] w-2 h-2 sm:w-3 sm:h-3 bg-white/10 border-l border-b border-white/20 transform rotate-45"></div>
      </div>
    </div>
  );
}
