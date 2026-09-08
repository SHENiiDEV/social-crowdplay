import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Flame, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';

const getWinTier = (item) => {
    const win = Number(item.win || 0);
    const multiplier = Number(item.multiplier || 1);

    if (win >= 5000 || multiplier >= 100) {
        return {
            tier: 'epic',
            badgeText: `${multiplier.toFixed(1)}x EPIC WIN`,
            badgeStyle: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 animate-pulse border-amber-300',
            cardBg: 'bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-slate-900 border-amber-400/80 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/40',
            winText: 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] font-black',
            avatarBg: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-300 text-slate-950 ring-2 ring-amber-400/60 font-black',
            glowColor: 'text-amber-300',
        };
    }

    if (win >= 2000 || multiplier >= 50) {
        return {
            tier: 'mega',
            badgeText: `${multiplier.toFixed(1)}x MEGA WIN`,
            badgeStyle: 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black shadow-md shadow-purple-500/25 border-purple-300',
            cardBg: 'bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border-purple-500/60 shadow-xl shadow-purple-500/15',
            winText: 'text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.7)] font-black',
            avatarBg: 'bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-600 text-white ring-1 ring-purple-400/50 font-black',
            glowColor: 'text-purple-400',
        };
    }

    if (win >= 500 || multiplier >= 25) {
        return {
            tier: 'big',
            badgeText: `${multiplier.toFixed(1)}x BIG WIN`,
            badgeStyle: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black',
            cardBg: 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-500/40 hover:border-cyan-400/80 shadow-md shadow-cyan-500/10',
            winText: 'text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] font-bold',
            avatarBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black',
            glowColor: 'text-cyan-400',
        };
    }

    if (win >= 100 || multiplier >= 10) {
        return {
            tier: 'nice',
            badgeText: `${multiplier.toFixed(1)}x WIN`,
            badgeStyle: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold',
            cardBg: 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50',
            winText: 'text-emerald-400 font-bold',
            avatarBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold',
            glowColor: 'text-emerald-400',
        };
    }

    return {
        tier: 'standard',
        badgeText: item.time || 'just now',
        badgeStyle: 'text-slate-500 font-medium',
        cardBg: 'bg-slate-900/80 border-slate-800 hover:border-slate-700',
        winText: 'text-emerald-400/90 font-medium',
        avatarBg: 'bg-slate-800 text-slate-300 border border-slate-700 font-bold',
        glowColor: 'text-emerald-400',
    };
};

export function LiveFeed() {
    const [wins, setWins] = useState([]);

    const fetchLiveWins = () => {
        fetch('/api/live-wins')
            .then(res => res.json())
            .then(data => {
                if (data && data.wins) {
                    setWins(data.wins);
                }
            })
            .catch(err => console.error('Live feed error:', err));
    };

    useEffect(() => {
        fetchLiveWins();
        const interval = setInterval(fetchLiveWins, 8000);
        return () => clearInterval(interval);
    }, []);

    // Duplicate list for seamless infinite horizontal slider loop
    const displayList = wins.length > 0 ? [...wins, ...wins] : [];

    return (
        <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-3xl p-5 shadow-2xl mb-10 overflow-hidden relative">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <span>LIVE COMMUNITY WINNERS</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">Real-time payouts across all games</p>
                    </div>
                </div>

                <Badge variant="gold" className="hidden sm:inline-flex">
                    <Sparkles className="w-3 h-3" />
                    <span>24/7 LIVE FEED</span>
                </Badge>
            </div>

            {/* Horizontal Continuous Marquee Slider */}
            <div className="relative w-full overflow-hidden py-1">
                {/* Gradient Fades on Left & Right Edges */}
                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-4 w-max cursor-pointer"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        ease: 'linear',
                        duration: 35,
                        repeat: Infinity,
                    }}
                >
                    {displayList.map((item, idx) => {
                        const tierInfo = getWinTier(item);

                        return (
                            <div
                                key={`${item.id}-${idx}`}
                                className={`w-64 border rounded-2xl p-3.5 shadow-xl transition-all duration-200 shrink-0 flex items-center gap-3 group ${tierInfo.cardBg}`}
                            >
                                {/* User Initial Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs shadow-md shrink-0 ${tierInfo.avatarBg}`}>
                                    {item.user.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-white truncate">{item.user}</span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{item.provider}</span>
                                    </div>

                                    <p className="text-[11px] font-medium text-slate-400 truncate">{item.game}</p>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className={`text-xs font-mono flex items-center gap-0.5 ${tierInfo.winText}`}>
                                            +{Number(item.win).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SC
                                            <ArrowUpRight className="w-3 h-3" />
                                        </span>

                                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tight ${tierInfo.badgeStyle}`}>
                                            {tierInfo.badgeText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}

