import React from 'react';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
      {/* Subtle background glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Key Icon in glowing box */}
      <div className="mb-12 p-8 bg-yellow-400/10 rounded-3xl border border-yellow-400/20 shadow-lg shadow-yellow-400/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
          />
        </svg>
      </div>

      {/* Store Name - Large and Bold */}
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight text-center">
        RaiLyn<span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">'s</span> Store
      </h1>

      {/* Divider */}
      <div className="h-1.5 w-48 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
    </div>
  );
}
