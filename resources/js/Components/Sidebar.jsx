import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Logo from './Logo';
import { Home, Star, ChevronDown, ChevronRight, Gift, Sparkles, Users, Dices, Gamepad2, Flame, Trophy, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';

export default function Sidebar({ currentCategory, categories = [] }) {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    const categoriesList = [
        { name: 'Slots', icon: Gamepad2 },
        { name: 'Roulette', icon: Dices },
        { name: 'Baccarat', icon: Trophy },
        { name: 'Mini Games', icon: Sparkles },
        { name: 'Sportsbook', icon: Flame },
    ];

    return (
        <aside className="w-64 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col fixed top-0 left-0 bottom-0 z-40 select-none overflow-y-auto">
            {/* CROWDPLAY Logo Header */}
            <div className="p-6 border-b border-slate-800/80">
                <Link href={route('home')} className="block hover:opacity-90 transition-opacity">
                    <Logo />
                </Link>
            </div>

            {/* Navigation Menu */}
            <div className="p-4 space-y-6 flex-1">
                <div>
                    <p className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2">Navigation</p>
                    <nav className="space-y-1">
                        <Link
                            href={route('home')}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-extrabold text-sm transition-all duration-200 ${
                                currentCategory === 'All'
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-inner'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            }`}
                        >
                            <Home className="w-4 h-4 text-amber-400" />
                            <span>All Games</span>
                        </Link>

                        <Link
                            href={route('home', { category: 'Recommended' })}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-extrabold text-sm transition-all duration-200 ${
                                currentCategory === 'Recommended'
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            }`}
                        >
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>Recommended</span>
                        </Link>
                    </nav>
                </div>

                {/* Collapsible Categories */}
                <div>
                    <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className="w-full px-3 py-1 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                    >
                        <span>Game Categories</span>
                        {isCategoriesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {isCategoriesOpen && (
                        <nav className="mt-2 space-y-1">
                            {categoriesList.map((cat) => {
                                const IconComponent = cat.icon;
                                const isActive = currentCategory === cat.name;

                                return (
                                    <Link
                                        key={cat.name}
                                        href={route('home', { category: cat.name })}
                                        className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                                            isActive
                                                ? 'bg-slate-900 text-amber-400 border border-amber-500/30 shadow-md'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                                            <span>{cat.name}</span>
                                        </div>
                                        <Badge variant="muted" className="text-[9px] px-1.5 py-0">LIVE</Badge>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* Crowdplay Community & Referral Box */}
                <div className="relative bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 overflow-hidden">
                    <div className="flex items-center gap-2 text-cyan-400 font-black text-xs">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>Refer & Earn</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Invite your friends to earn +50 free Social Coins!</p>
                    <button
                        onClick={() => alert('Referral link copied to clipboard!')}
                        className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-500/30 transition-all text-center"
                    >
                        Copy Invite Link
                    </button>
                </div>
            </div>

            {/* Provider Badge Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GGR Seamless Protected</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">CROWDPLAY Social Casino Engine</p>
            </div>
        </aside>
    );
}
