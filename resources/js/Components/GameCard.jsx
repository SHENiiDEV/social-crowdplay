import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Play, Eye, Sparkles } from 'lucide-react';

export default function GameCard({ game, onOpenAuth }) {
    const { auth } = usePage().props;

    return (
        <div className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-purple-500/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1">
            {/* Cover Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                    src={game.cover_image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[10px] font-extrabold uppercase text-purple-400 tracking-wider">
                    {game.category}
                </div>

                {game.is_recommended && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>HOT</span>
                    </div>
                )}

                {/* Hover Overlay with Play & Demo Buttons */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
                    {auth.user ? (
                        <Link
                            href={route('game.play', { slug: game.slug })}
                            className="w-full btn-gold py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>PLAY NOW</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => onOpenAuth('login')}
                            className="w-full btn-gold py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>PLAY NOW</span>
                        </button>
                    )}

                    <Link
                        href={route('game.play', { slug: game.slug })}
                        className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>DEMO MODE</span>
                    </Link>
                </div>
            </div>

            {/* Title Footer */}
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors truncate max-w-[160px]">
                        {game.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">GammaPlus Provider</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
            </div>
        </div>
    );
}
