import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Logo from './Logo';
import { Home, Star, ChevronDown, ChevronRight, Users, Dices, Gamepad2, Flame, Trophy, Sparkles, ShieldCheck, X } from 'lucide-react';

export default function Sidebar({ currentCategory, isOpen = false, onClose = () => {} }) {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    const categoriesList = [
        { name: 'Slots', icon: Gamepad2 },
        { name: 'Roulette', icon: Dices },
        { name: 'Baccarat', icon: Trophy },
        { name: 'Mini Games', icon: Sparkles },
        { name: 'Sportsbook', icon: Flame },
    ];

    const handleLinkClick = () => onClose && onClose();

    const navItemClass = (active) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
            active
                ? 'bg-white/[0.045] text-gold-200'
                : 'text-slate-500 hover:bg-white/[0.025] hover:text-slate-200'
        }`;

    const ActiveMark = ({ active }) => (
        <span
            className={`absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 rounded-full bg-gradient-to-b from-gold-200 to-gold-500 transition-opacity duration-300 ${
                active ? 'opacity-100' : 'opacity-0'
            }`}
        />
    );

    return (
        <>
            {isOpen && (
                <div onClick={onClose} className="fixed inset-0 z-40 bg-obsidian-950/85 backdrop-blur-sm lg:hidden" />
            )}

            <aside
                className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 select-none flex-col overflow-y-auto border-r border-white/[0.06] bg-obsidian-950/92 backdrop-blur-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-64 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-6">
                    <Link href={route('home')} onClick={handleLinkClick} className="block transition-opacity hover:opacity-80">
                        <Logo />
                    </Link>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-slate-500 transition-colors hover:text-white lg:hidden"
                        title="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 space-y-8 px-4 py-7">
                    <div>
                        <p className="px-3.5 pb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-700">
                            Navigation
                        </p>
                        <nav className="space-y-0.5">
                            <Link href={route('home')} onClick={handleLinkClick} className={navItemClass(currentCategory === 'All')}>
                                <ActiveMark active={currentCategory === 'All'} />
                                <Home className="h-4 w-4 opacity-70" />
                                <span>All Games</span>
                            </Link>

                            <Link
                                href={route('home', { category: 'Recommended' })}
                                onClick={handleLinkClick}
                                className={navItemClass(currentCategory === 'Recommended')}
                            >
                                <ActiveMark active={currentCategory === 'Recommended'} />
                                <Star className="h-4 w-4 opacity-70" />
                                <span>Recommended</span>
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <button
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex w-full items-center justify-between px-3.5 pb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-700 transition-colors hover:text-slate-500"
                        >
                            <span>Categories</span>
                            {isCategoriesOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </button>

                        {isCategoriesOpen && (
                            <nav className="space-y-0.5">
                                {categoriesList.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = currentCategory === cat.name;

                                    return (
                                        <Link
                                            key={cat.name}
                                            href={route('home', { category: cat.name })}
                                            onClick={handleLinkClick}
                                            className={navItemClass(isActive)}
                                        >
                                            <ActiveMark active={isActive} />
                                            <Icon className="h-4 w-4 opacity-70" />
                                            <span className="flex-1">{cat.name}</span>
                                            <span className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                                                <span className="h-1 w-1 rounded-full bg-jade-400/70" />
                                                Live
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    {/* Referral card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gold-400/18 p-5"
                         style={{ background: 'linear-gradient(165deg, rgba(217,182,92,0.07), rgba(255,255,255,0.012))' }}>
                        <div className="flex items-center gap-2 text-gold-300">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Refer & Earn</span>
                        </div>
                        <p className="mt-3 text-[11px] font-light leading-relaxed text-slate-500">
                            Invite a friend and receive 50 Social Coins on their first spin.
                        </p>
                        <button
                            onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.origin)}
                            className="mt-4 w-full rounded-full border border-gold-400/28 bg-gold-400/[0.06] py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-200 transition-all hover:bg-gold-400/12"
                        >
                            Copy invite link
                        </button>
                    </div>
                </div>

                {/* Footer seal */}
                <div className="border-t border-white/[0.06] px-5 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        <ShieldCheck className="h-3 w-3 text-gold-400/60" />
                        <span>GGR Seamless Protected</span>
                    </div>
                    <p className="mt-1.5 text-[9px] font-light tracking-[0.1em] text-slate-700">
                        Crowdplay Casino Engine
                    </p>
                </div>
            </aside>
        </>
    );
}
