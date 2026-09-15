import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Gamepad2, Trophy, Gift, User, LogIn, Coins } from 'lucide-react';

export default function MobileBottomNav({ onOpenAuth, onOpenStore, onOpenWheel, onToggleSidebar, currentCategory }) {
    const { auth } = usePage().props;

    return (
        <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 z-30 px-2 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
            {/* 1. Home / Lobby */}
            <Link
                href={route('home')}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                    currentCategory === 'All' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Home className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-tight">Lobby</span>
            </Link>

            {/* 2. Categories Drawer */}
            <button
                type="button"
                onClick={onToggleSidebar}
                className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
                <Gamepad2 className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-tight">Catalog</span>
            </button>

            {/* 3. Daily Wheel (Centered Prominent Glow Button) */}
            <button
                type="button"
                onClick={onOpenWheel}
                className="flex flex-col items-center justify-center flex-1 py-1 -mt-4 group relative"
            >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 ring-2 ring-slate-950 flex items-center justify-center transition-transform active:scale-95">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                        <Trophy className="w-5 h-5 animate-pulse" />
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase text-amber-400 mt-1 tracking-tight">Wheel</span>
            </button>

            {/* 4. Free 1 SC / Store */}
            <button
                type="button"
                onClick={onOpenStore}
                className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-emerald-400 transition-colors relative"
            >
                <div className="relative">
                    <Gift className="w-5 h-5 mb-0.5 text-emerald-400" />
                    <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 text-[8px] font-black px-1 rounded-full leading-tight">
                        1 SC
                    </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-emerald-400">Bonus</span>
            </button>

            {/* 5. Profile or Auth */}
            {auth.user ? (
                <Link
                    href={route('profile')}
                    className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <User className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[50px]">Profile</span>
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={() => onOpenAuth('register')}
                    className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-amber-400 transition-colors"
                >
                    <LogIn className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">Sign Up</span>
                </button>
            )}
        </nav>
    );
}
