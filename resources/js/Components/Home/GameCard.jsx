import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, Heart, Spade } from 'lucide-react';

export function GameCard({ game, index = 0, onOpenAuth, isFavInitial = false, onFavToggle }) {
    const { auth } = usePage().props;
    const [isFav, setIsFav] = useState(isFavInitial);
    const [imgError, setImgError] = useState(false);
    const isHot = game.is_recommended || index < 6;
    const providerName = game.provider_code || 'GGR';

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            if (onOpenAuth) onOpenAuth('register');
            return;
        }

        const newFav = !isFav;
        setIsFav(newFav);

        try {
            await fetch('/api/favorites/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ game_id: game.id }),
            });

            if (onFavToggle) onFavToggle(game.id, newFav);
        } catch (err) {
            setIsFav(!newFav);
        }
    };

    const handlePlayClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            if (onOpenAuth) onOpenAuth('register');
            else window.location.href = route('home');
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian-900/70 transition-all duration-400 hover:border-gold-400/35 hover:shadow-[0_30px_60px_-32px_rgba(0,0,0,0.95)]"
        >
            {/* Top hairline that lights up on hover */}
            <span className="pointer-events-none absolute inset-x-6 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold-300/0 to-transparent transition-all duration-500 group-hover:via-gold-300/60" />

            <Link
                href={route('game.play', { slug: game.slug })}
                onClick={handlePlayClick}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-obsidian-950"
            >
                {(!game.cover_image || imgError) ? (
                    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-obsidian-950 p-4 text-center">
                        <div className="absolute inset-0"
                             style={{ background: 'radial-gradient(70% 55% at 50% 38%, rgba(217,182,92,0.10), transparent 70%)' }} />
                        <Spade className="relative mb-2 h-7 w-7 text-gold-400/70 transition-transform duration-500 group-hover:scale-110" />
                        <span className="relative line-clamp-2 text-[11px] font-medium leading-tight text-slate-200">
                            {game.title}
                        </span>
                        <span className="relative mt-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-gold-400/60">
                            {providerName}
                        </span>
                    </div>
                ) : (
                    <img
                        src={game.cover_image}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                )}

                {/* Base vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/10 to-transparent opacity-90" />

                {/* Corner marks */}
                <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
                    {isHot ? (
                        <span className="rounded-full border border-gold-400/30 bg-black/55 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur-md">
                            {game.category || 'Slots'}
                        </span>
                    ) : (
                        <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400 backdrop-blur-md">
                            {game.category || 'Slots'}
                        </span>
                    )}

                    <span className="rounded-full border border-white/[0.08] bg-black/50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400 backdrop-blur-md">
                        {providerName}
                    </span>
                </div>

                {/* Hover veil */}
                <div className="absolute inset-0 hidden items-center justify-center gap-2.5 bg-obsidian-950/72 opacity-0 backdrop-blur-[3px] transition-opacity duration-400 group-hover:opacity-100 sm:flex">
                    <span className="lux-btn-gold flex items-center gap-2 rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">
                        <Play className="relative z-10 h-3.5 w-3.5 fill-current" />
                        <span className="relative z-10">Play</span>
                    </span>

                    <button
                        type="button"
                        onClick={handleFavoriteClick}
                        title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all active:scale-90 ${
                            isFav
                                ? 'border-gold-400/45 bg-gold-400/12 text-gold-300'
                                : 'border-white/12 bg-white/[0.06] text-slate-300 hover:border-gold-400/40 hover:text-gold-300'
                        }`}
                    >
                        <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </Link>

            {/* Meta */}
            <div className="flex items-center justify-between gap-2 border-t border-white/[0.05] px-3.5 py-3">
                <Link
                    href={route('game.play', { slug: game.slug })}
                    onClick={handlePlayClick}
                    className="min-w-0 flex-1"
                >
                    <h4 className="truncate text-[13px] font-medium text-slate-100 transition-colors duration-300 group-hover:text-gold-200">
                        {game.title}
                    </h4>
                    <p className="mt-0.5 truncate text-[10px] font-light tracking-wide text-slate-600">
                        RTP 96.5% · Verified
                    </p>
                </Link>

                <button
                    type="button"
                    onClick={handleFavoriteClick}
                    title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isFav
                            ? 'border-gold-400/40 bg-gold-400/10 text-gold-300'
                            : 'border-white/[0.08] bg-white/[0.03] text-slate-500 hover:text-gold-300 hover:border-gold-400/30'
                    }`}
                >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>
            </div>
        </motion.article>
    );
}
