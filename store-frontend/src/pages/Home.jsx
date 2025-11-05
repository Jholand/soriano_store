import { FaKey } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      
      {/* Subtle animated gold background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.08),_transparent_70%)] blur-3xl animate-pulse-slow" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-10">
        
        {/* Key Emblem */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <FaKey className="text-yellow-500 text-8xl rotate-90 drop-shadow-[0_0_8px_#FFD70060]" />
          <div className="h-[2px] w-16 bg-yellow-500/60 rounded-full" />
        </div>

        {/* Store Name */}
        <div className="px-10 py-4 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent shadow-[0_0_25px_#FFD70020] backdrop-blur-sm">
          <h1
            className="text-6xl md:text-7xl font-[Cinzel] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400 drop-shadow-[0_0_8px_#FFD70050]"
            style={{ letterSpacing: "3px" }}
          >
            RaiLyn’s Store
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-gray-300 max-w-2xl text-lg leading-relaxed font-light">
          Discover a collection where <span className="text-yellow-400 font-semibold">luxury</span> meets{" "}
          <span className="text-yellow-400 font-semibold">refinement</span>.  
          Step into the golden world of RaiLyn’s — where every product defines sophistication.
        </p>

        {/* Button */}
        <button className="mt-6 px-12 py-4 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-semibold text-lg tracking-wide shadow-[0_0_10px_#FFD70020] hover:shadow-[0_0_25px_#FFD70050] hover:scale-105 transition-all duration-300">
          Shop Now
        </button>
      </div>

      {/* Elegant gold borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent" />
    </div>
  );
}
