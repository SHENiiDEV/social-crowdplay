import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowUpRight, Gift } from 'lucide-react';

import { Button } from '../ui/button';

function JackpotDigits({ value }) {
    const text = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <span className="font-mono num text-gold text-gold-shimmer tracking-[-0.02em]">
            {text}
        </span>
    );
}

export function HeroBanner({ onOpenStore, initialJackpot = 1284959.92 }) {
    const [jackpot, setJackpot] = useState(initialJackpot);

    useEffect(() => {
        setJackpot(initialJackpot);
    }, [initialJackpot]);

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

    const stats = [
        { label: 'Top win today', value: '+14,852.75', unit: 'SC', accent: 'text-jade-400' },
        { label: 'Players online', value: '1,429', unit: '', accent: 'text-pearl-400' },
        { label: 'Game titles', value: '3,200', unit: '+', accent: 'text-pearl-400' },
    ];

    return (
        <section className="relative w-full overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] lux-surface lux-topline lux-grain mb-8 sm:mb-14">
            {/* Ambient light */}
            <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-gold-400/[0.07] blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-52 left-[-12%] h-[440px] w-[440px] rounded-full bg-gold-600/[0.05] blur-[120px]" />

            {/* Fine vertical rule pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.28]"
                style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                    backgroundSize: '96px 100%',
                    maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent 78%)',
                    WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent 78%)',
                }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 p-6 sm:p-10 lg:p-14">
                {/* ---------- Left: statement ---------- */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-7 flex flex-col justify-center"
                >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="eyebrow">Next-Gen Social Casino</span>
                        <span className="hidden sm:block h-3 w-px bg-white/12" />
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            <ShieldCheck className="h-3.5 w-3.5 text-gold-400/80" />
                            GGR Gold Encrypted
                        </span>
                    </div>

                    <h1 className="mt-6 font-display font-light text-white leading-[0.92] text-[2.9rem] sm:text-6xl lg:text-[4.75rem] tracking-[-0.02em]">
                        Where every spin
                        <br />
                        feels <em className="not-italic text-gold text-gold-shimmer font-medium">first class</em>
                    </h1>

                    <p className="mt-6 max-w-lg text-sm sm:text-[0.95rem] leading-relaxed text-slate-400 font-light">
                        Over <span className="text-slate-100 font-medium">3,200 authentic casino titles</span> from
                        Pragmatic Play, Evolution Live, Spribe and Hacksaw — with instant Seamless Wallet sync
                        and a progressive pool that never sleeps.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Button variant="gold" size="lg" onClick={onOpenStore} className="group w-full sm:w-auto">
                            <Gift className="h-4 w-4" />
                            <span>Claim 1.00 SC daily</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>

                        <a href="#games-catalog" className="w-full sm:w-auto">
                            <Button variant="glass" size="lg" className="w-full group">
                                <span>Explore catalogue</span>
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Button>
                        </a>
                    </div>

                    {/* Stat rail */}
                    <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04]">
                        {stats.map((s) => (
                            <div key={s.label} className="bg-obsidian-900/80 px-3 sm:px-5 py-4">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
                                <p className={`mt-1.5 font-mono num text-sm sm:text-base font-semibold ${s.accent}`}>
                                    {s.value}
                                    {s.unit && <span className="ml-1 font-sans text-[10px] text-slate-500">{s.unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ---------- Right: jackpot vitrine ---------- */}
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-5 flex items-center"
                >
                    <div className="relative w-full overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] lux-gold-surface lux-topline p-7 sm:p-9">
                        <div className="pointer-events-none absolute inset-0 opacity-70"
                             style={{ background: 'radial-gradient(120% 70% at 50% -10%, rgba(217,182,92,0.16), transparent 62%)' }} />

                        <div className="relative text-center">
                            <p className="eyebrow text-gold-300/70">Grand Progressive Jackpot</p>

                            <div className="mt-6 flex items-baseline justify-center gap-2">
                                <span className="text-[1.9rem] sm:text-[2.6rem] lg:text-[2.9rem] font-semibold leading-none">
                                    <JackpotDigits value={jackpot} />
                                </span>
                                <span className="font-display text-xl sm:text-2xl italic text-gold-400/70">SC</span>
                            </div>

                            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

                            <p className="mt-5 text-[11px] leading-relaxed text-slate-500 font-light">
                                Live community pool — grows with every spin across all 3,200 titles.
                            </p>

                            <div className="mt-7 flex items-center justify-center gap-2.5">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-jade-400 opacity-70"
                                          style={{ animation: 'lux-pulse-dot 2s ease-in-out infinite' }} />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade-400" />
                                </span>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Pool active
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
