import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Win tiers expressed purely through metal tones — gold, champagne, pearl —
 * so the rail reads as one material instead of a rainbow of alerts.
 */
const getWinTier = (item) => {
    const win = Number(item.win || 0);
    const multiplier = Number(item.multiplier || 1);

    if (win >= 5000 || multiplier >= 100) {
        return {
            label: `${multiplier.toFixed(0)}× Epic`,
            card: 'border-gold-400/40 bg-gradient-to-br from-gold-900/50 via-obsidian-850 to-obsidian-900 shadow-[0_26px_60px_-34px_rgba(201,159,63,0.6)]',
            badge: 'border-gold-300/50 bg-gold-400/15 text-gold-200',
            amount: 'text-gold-200',
            avatar: 'bg-gradient-to-br from-gold-200 to-gold-500 text-obsidian-950 border-gold-100/50',
        };
    }

    if (win >= 2000 || multiplier >= 50) {
        return {
            label: `${multiplier.toFixed(0)}× Mega`,
            card: 'border-gold-400/22 bg-gradient-to-br from-obsidian-800 to-obsidian-900',
            badge: 'border-gold-400/28 bg-gold-400/8 text-gold-300',
            amount: 'text-gold-300',
            avatar: 'bg-gradient-to-br from-gold-400/80 to-gold-700 text-obsidian-950 border-gold-300/30',
        };
    }

    if (win >= 500 || multiplier >= 25) {
        return {
            label: `${multiplier.toFixed(0)}× Big`,
            card: 'border-white/[0.08] bg-obsidian-900/90',
            badge: 'border-white/10 bg-white/[0.04] text-pearl-400',
            amount: 'text-pearl-400',
            avatar: 'bg-gradient-to-br from-slate-300/80 to-slate-500 text-obsidian-950 border-white/20',
        };
    }

    return {
        label: item.time || 'just now',
        card: 'border-white/[0.06] bg-obsidian-900/70',
        badge: 'border-transparent bg-transparent text-slate-600',
        amount: 'text-jade-400/90',
        avatar: 'bg-white/[0.06] text-slate-400 border-white/10',
    };
};

export function LiveFeed() {
    const [wins, setWins] = useState([]);

    const fetchLiveWins = () => {
        fetch('/api/live-wins')
            .then(res => res.json())
            .then(data => {
                if (data && data.wins) setWins(data.wins);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchLiveWins();
        const interval = setInterval(fetchLiveWins, 8000);
        return () => clearInterval(interval);
    }, []);

    const displayList = wins.length > 0 ? [...wins, ...wins] : [];

    return (
        <section className="relative mb-10 sm:mb-14">
            {/* Section header */}
            <div className="mb-5 flex items-end justify-between gap-4 px-1">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-jade-400 opacity-70"
                                  style={{ animation: 'lux-pulse-dot 2s ease-in-out infinite' }} />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade-400" />
                        </span>
                        <span className="eyebrow">Live activity</span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl font-light text-white tracking-[-0.01em]">
                        Community gameplay <em className="not-italic text-gold">activity</em>
                    </h2>
                </div>

                <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    24 / 7 feed
                </span>
            </div>

            {/* Rail */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-obsidian-950/60 py-5">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-[#06070a] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-[#06070a] to-transparent" />

                {displayList.length > 0 ? (
                    <div className="flex w-max gap-4 px-5 lux-marquee">
                        {displayList.map((item, idx) => {
                            const tier = getWinTier(item);

                            return (
                                <article
                                    key={`${item.id}-${idx}`}
                                    className={`flex w-[17rem] shrink-0 items-center gap-3.5 rounded-2xl border p-4 transition-colors duration-300 ${tier.card}`}
                                >
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold ${tier.avatar}`}>
                                        {item.user.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="truncate text-[13px] font-semibold text-white">{item.user}</span>
                                            <span className="shrink-0 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                                {item.provider}
                                            </span>
                                        </div>

                                        <p className="mt-0.5 truncate text-[11px] font-light text-slate-500">{item.game}</p>

                                        <div className="mt-2.5 flex items-center justify-between gap-2">
                                            <span className={`flex items-center gap-0.5 font-mono num text-[13px] font-semibold ${tier.amount}`}>
                                                +{Number(item.win).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                <ArrowUpRight className="h-3 w-3 opacity-60" />
                                            </span>

                                            <span className={`rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] ${tier.badge}`}>
                                                {tier.label}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex gap-4 px-5">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[92px] w-[17rem] shrink-0 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.02]" />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
