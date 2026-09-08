import React from 'react';

export default function Logo({ className = "h-10", showText = true, lightText = false }) {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            {/* CROWDPLAY Dynamic 3D Star/Play Icon */}
            <div className="relative w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <defs>
                        {/* Cyan to Royal Blue Gradient */}
                        <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f2fe" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>

                        {/* Gold to Amber Gradient */}
                        <linearGradient id="goldAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>

                        {/* Purple to Magenta Gradient */}
                        <linearGradient id="purplePink" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>

                    {/* Figure 1: Left Cyan/Blue */}
                    <path
                        d="M 32 30 C 25 40, 22 60, 35 78 C 40 70, 48 55, 42 42 Z"
                        fill="url(#cyanBlue)"
                    />
                    <circle cx="30" cy="24" r="7" fill="url(#cyanBlue)" />

                    {/* Figure 2: Top Gold/Amber */}
                    <path
                        d="M 40 28 C 55 20, 72 25, 78 36 C 68 42, 52 48, 46 36 Z"
                        fill="url(#goldAmber)"
                    />
                    <circle cx="75" cy="20" r="7" fill="url(#goldAmber)" />

                    {/* Figure 3: Right Purple/Magenta */}
                    <path
                        d="M 76 42 C 82 58, 70 76, 52 82 C 55 70, 58 52, 68 46 Z"
                        fill="url(#purplePink)"
                    />
                    <circle cx="56" cy="85" r="7" fill="url(#purplePink)" />

                    {/* Center Play Triangle Arrow Core */}
                    <path
                        d="M 42 34 L 70 50 L 42 66 Z"
                        fill="white"
                        fillOpacity="0.9"
                    />
                </svg>
            </div>

            {/* Typography */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`font-black text-xl tracking-wider leading-none uppercase ${lightText ? 'text-white' : 'text-slate-100'}`}>
                        CROWD<span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">PLAY</span>
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase leading-tight mt-0.5">
                        SOCIAL CASINO
                    </span>
                </div>
            )}
        </div>
    );
}
