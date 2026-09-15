import React from 'react';

export default function Logo({ className = 'h-10', showText = true }) {
    return (
        <div className={`flex select-none items-center gap-3 ${className}`}>
            <div className="relative h-9 w-9 flex-shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <defs>
                        <linearGradient id="lxGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fdf8e7" />
                            <stop offset="45%" stopColor="#ecd392" />
                            <stop offset="100%" stopColor="#c39a3c" />
                        </linearGradient>
                        <linearGradient id="lxChampagne" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e9dcb4" />
                            <stop offset="100%" stopColor="#9a7828" />
                        </linearGradient>
                        <linearGradient id="lxPearl" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f2f4f8" />
                            <stop offset="100%" stopColor="#8d94a5" />
                        </linearGradient>
                    </defs>

                    <path d="M 32 30 C 25 40, 22 60, 35 78 C 40 70, 48 55, 42 42 Z" fill="url(#lxPearl)" opacity="0.75" />
                    <circle cx="30" cy="24" r="7" fill="url(#lxPearl)" opacity="0.75" />

                    <path d="M 40 28 C 55 20, 72 25, 78 36 C 68 42, 52 48, 46 36 Z" fill="url(#lxGold)" />
                    <circle cx="75" cy="20" r="7" fill="url(#lxGold)" />

                    <path d="M 76 42 C 82 58, 70 76, 52 82 C 55 70, 58 52, 68 46 Z" fill="url(#lxChampagne)" />
                    <circle cx="56" cy="85" r="7" fill="url(#lxChampagne)" />

                    <path d="M 42 34 L 70 50 L 42 66 Z" fill="#06070a" fillOpacity="0.55" />
                    <path d="M 44 37 L 66 50 L 44 63 Z" fill="#fdf8e7" fillOpacity="0.92" />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className="text-[17px] font-semibold uppercase tracking-[0.16em] text-white">
                        Crowd<span className="text-gold">play</span>
                    </span>
                    <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.42em] text-slate-600">
                        Social Casino
                    </span>
                </div>
            )}
        </div>
    );
}
