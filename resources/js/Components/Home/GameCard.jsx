import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, Flame, Heart } from 'lucide-react';
import { Badge } from '../ui/badge';

export function GameCard({ game, index = 0, onOpenAuth, isFavInitial = false, onFavToggle }) {
    const { auth } = usePage().props;
    const [isFav, setIsFav] = useState(isFavInitial);
    const isHot = game.is_recommended || index < 6;
    const providerName = game.provider_code || 'GGR API';

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

            if (onFavToggle) {
                onFavToggle(game.id, newFav);
            }
        } catch (err) {
            setIsFav(!newFav);
        }
    };

    const handlePlayClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            if (onOpenAuth) {
                onOpenAuth('register');
            } else {
                window.location.href = route('home');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                delay: Math.min(index * 0.04, 0.4),
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-slate-900/90 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-2xl flex flex-col justify-between"
        >
            {/* Liquid Glass Edge Reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />

            {/* Thumbnail Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                    src={game.cover_image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60';
                    }}
                />

                {/* Ambient Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <Badge variant={isHot ? 'gold' : 'muted'} className="shadow-lg backdrop-blur-md">
                        {isHot && <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        <span>{game.category || 'Slots'}</span>
                    </Badge>

                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800">
                        {providerName}
                    </span>
                </div>

                {/* Play & Favorite Combined Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 p-4 z-20">
                    <Link
                        href={route('game.play', { slug: game.slug })}
                        onClick={handlePlayClick}
                        className="transform scale-95 group-hover:scale-100 transition-all duration-300 px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-2xl shadow-amber-500/50 flex items-center gap-2 text-xs tracking-wide active:scale-95"
                    >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>PLAY NOW</span>
                    </Link>

                    <button
                        onClick={handleFavoriteClick}
                        className={`transform scale-95 group-hover:scale-100 transition-all duration-300 p-3 rounded-2xl border backdrop-blur-md flex items-center justify-center shadow-xl active:scale-90 ${
                            isFav
                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                                : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/40'
                        }`}
                        title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                        <Heart className={`w-4.5 h-4.5 transition-all ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Bottom Meta Bar */}
            <div className="p-4 flex items-center justify-between bg-slate-950/60 border-t border-slate-800/60">
                <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-black text-white truncate group-hover:text-amber-400 transition-colors">
                        {game.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 truncate">
                        RTP ~96.5% • Verified
                    </p>
                </div>

                <button
                    onClick={handleFavoriteClick}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 border ${
                        isFav
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                    }`}
                    title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
            </div>
        </motion.div>
    );
}
