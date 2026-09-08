import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Zap, ShieldCheck, ArrowRight, Coins, Gift } from 'lucide-react';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function HeroBanner({ onOpenStore, onTriggerJackpot, initialJackpot = 1284959.92 }) {
    const [jackpot, setJackpot] = useState(initialJackpot);

    useEffect(() => {
        setJackpot(initialJackpot);
    }, [initialJackpot]);


    // Real-time progressive jackpot polling and micro-increment
    useEffect(() => {
        const fetchStatus = () => {
            fetch('/api/jackpot/status')
                .then(res => res.json())
                .then(data => {
                    if (data && typeof data.jackpot_amount === 'number') {
                        setJackpot(data.jackpot_amount);
                    }
                })
                .catch(() => {});
        };

        fetchStatus();
        const interval = setInterval(() => {
            setJackpot(prev => prev + (Math.random() * 0.12));
        }, 2500);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl p-6 sm:p-10 mb-10">
            {/* Ambient Background Gradient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Content Column */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="lg:col-span-7 space-y-6 text-left"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="gold" className="px-3 py-1 text-xs shadow-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>NO REAL MONEY REQUIRED • 100% FREE SOCIAL CASINO</span>
                        </Badge>
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>GGR Gold API Encrypted</span>
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                        NEXT-GEN <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">SOCIAL CASINO</span> SLOTS
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                        Spin over <strong className="text-white font-extrabold">3,200+ authentic casino games</strong> from Pragmatic Play, Evolution Live, Spribe, and Hacksaw with instant Seamless Wallet balance sync.
                    </p>

                    {/* CTA Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Button
                            variant="gold"
                            size="lg"
                            onClick={onOpenStore}
                            className="shadow-xl shadow-amber-500/20 group"
                        >
                            <Gift className="w-5 h-5 text-slate-950" />
                            <span>CLAIM 1.00 SC FREE DAILY</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>


                        <a href="#games-catalog">
                            <Button variant="glass" size="lg">
                                <Zap className="w-5 h-5 text-cyan-400" />
                                <span>EXPLORE CATALOG</span>
                            </Button>
                        </a>
                    </div>
                </motion.div>

                {/* Right Jackpot Bento Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
                    className="lg:col-span-5"
                >
                    <div className="relative bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                            <Trophy className="w-4 h-4" />
                            <span>GRAND CASINO JACKPOT</span>
                        </div>

                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-amber-400 tracking-tight drop-shadow-[0_4px_24px_rgba(251,191,36,0.3)]">
                                {jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xl sm:text-2xl text-amber-300 font-sans">SC</span>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold">Live Community Progressive Pool</p>
                        </div>



                        {/* Recent Winner Stats Bar */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                                <span className="text-[10px] font-bold uppercase text-slate-500 block">Top Win Today</span>
                                <span className="text-sm font-black text-emerald-400">+14,852.75 SC</span>
                            </div>



                            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                                <span className="text-[10px] font-bold uppercase text-slate-500 block">Live Players</span>
                                <span className="text-sm font-black text-cyan-400">1,429 Online</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
