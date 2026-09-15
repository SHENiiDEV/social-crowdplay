import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Gamepad2, Trophy, Gift, User, LogIn } from 'lucide-react';

const item = (active) =>
    `flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors duration-300 ${
        active ? 'text-gold-200' : 'text-slate-600 hover:text-slate-300'
    }`;

const label = 'text-[8px] font-semibold uppercase tracking-[0.16em]';

export default function MobileBottomNav({ onOpenAuth, onOpenStore, onOpenWheel, onToggleSidebar, currentCategory }) {
    const { auth } = usePage().props;

    return (
        <nav
            aria-label="Mobile Navigation"
            className="fixed bottom-0 left-0 right-0 z-30 flex h-[4.25rem] items-center justify-around border-t border-white/[0.06] bg-obsidian-950/92 px-2 backdrop-blur-2xl lg:hidden"
        >
            <Link href={route('home')} className={item(currentCategory === 'All')}>
                <Home className="h-[18px] w-[18px]" />
                <span className={label}>Lobby</span>
            </Link>

            <button type="button" onClick={onToggleSidebar} className={item(false)}>
                <Gamepad2 className="h-[18px] w-[18px]" />
                <span className={label}>Catalogue</span>
            </button>

            <button type="button" onClick={onOpenWheel} className="relative -mt-6 flex flex-1 flex-col items-center justify-center gap-1.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-500 ring-4 ring-[#06070a] transition-transform active:scale-95">
                    <Trophy className="h-[18px] w-[18px] text-obsidian-950" />
                </span>
                <span className={`${label} text-gold-200`}>Wheel</span>
            </button>

            <button type="button" onClick={onOpenStore} className={item(false)}>
                <Gift className="h-[18px] w-[18px]" />
                <span className={label}>Bonus</span>
            </button>

            {auth.user ? (
                <Link href={route('profile')} className={item(false)}>
                    <User className="h-[18px] w-[18px]" />
                    <span className={label}>Profile</span>
                </Link>
            ) : (
                <button type="button" onClick={() => onOpenAuth('register')} className={item(false)}>
                    <LogIn className="h-[18px] w-[18px]" />
                    <span className={label}>Sign Up</span>
                </button>
            )}
        </nav>
    );
}
