import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, LogOut, Shield, Gift, User as UserIcon, Volume2, VolumeX, Trophy, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Logo from './Logo';
import StoreModal from './Modals/StoreModal';
import { ReferralModal } from './Modals/ReferralModal';
import { DailyWheelModal } from './Modals/DailyWheelModal';
import { soundFx } from '../utils/soundFx';

const iconButton =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] text-slate-500 transition-all duration-300 hover:border-gold-400/30 hover:text-gold-200';

export default function Header({ onOpenAuth, onToggleSidebar, searchQuery, setSearchQuery }) {
    const { auth, games = [] } = usePage().props;
    const [userDropdown, setUserDropdown] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isReferralOpen, setIsReferralOpen] = useState(false);
    const [isWheelOpen, setIsWheelOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(soundFx.isMuted);
    const [localBalance, setLocalBalance] = useState(null);
    const [prevBalance, setPrevBalance] = useState(null);
    const [balanceDiff, setBalanceDiff] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        const activeBal = localBalance !== null ? localBalance : (auth.user ? Number(auth.user.game_balance) : null);
        if (activeBal === null) return;

        if (prevBalance !== null && prevBalance !== activeBal) {
            const diff = activeBal - prevBalance;
            if (Math.abs(diff) >= 0.01) {
                setBalanceDiff({ amount: diff, id: Date.now() });
                if (diff > 0) soundFx.playCoinSound();
                setTimeout(() => setBalanceDiff(null), 2200);
            }
        }
        setPrevBalance(activeBal);
    }, [localBalance, auth.user]);

    useEffect(() => {
        if (!auth.user) return;

        const fetchBalance = async () => {
            try {
                const res = await fetch('/user/balance');
                if (res.ok) {
                    const data = await res.json();
                    if (typeof data.balance === 'number') setLocalBalance(data.balance);
                }
            } catch (e) { /* transient */ }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 2500);

        const handleCustomBalanceUpdate = (e) => {
            if (e.detail?.balance !== undefined) setLocalBalance(e.detail.balance);
        };

        window.addEventListener('balanceUpdated', handleCustomBalanceUpdate);
        return () => {
            clearInterval(interval);
            window.removeEventListener('balanceUpdated', handleCustomBalanceUpdate);
        };
    }, [auth.user]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length >= 2 && Array.isArray(games) && games.length > 0) {
            const matches = games.filter(g =>
                g.title.toLowerCase().includes(query.toLowerCase()) ||
                (g.provider_code && g.provider_code.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 5);
            setSearchResults(matches);
            setShowSearchDropdown(true);
        } else {
            setShowSearchDropdown(false);
        }
    };

    const handleToggleMute = () => setIsMuted(soundFx.toggleMute());

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowSearchDropdown(false);
        setIsMobileSearchOpen(false);
        window.location.href = route('home', { search: searchQuery });
    };

    const currentBalance = localBalance !== null
        ? localBalance
        : (auth.user ? Number(auth.user.game_balance) : 0);

    const balanceTone = balanceDiff?.amount > 0
        ? 'text-jade-400'
        : (balanceDiff?.amount < 0 ? 'text-rose-300' : 'text-gold-200');

    const renderResult = (g, onNavigate) => (
        <Link
            key={g.id}
            href={route('game.play', { slug: g.slug })}
            onClick={(e) => {
                onNavigate && onNavigate();
                if (!auth.user) {
                    e.preventDefault();
                    setShowSearchDropdown(false);
                    onOpenAuth('register');
                }
            }}
            className="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.04]"
        >
            <div className="flex min-w-0 items-center gap-3">
                <img src={g.cover_image} alt={g.title} className="h-9 w-9 rounded-lg border border-white/[0.06] object-cover" />
                <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-slate-200 group-hover:text-gold-200">{g.title}</p>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-slate-600">{g.provider_code || 'GGR'}</p>
                </div>
            </div>
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-400/70">Play</span>
        </Link>
    );

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-obsidian-950/80 px-4 backdrop-blur-2xl sm:h-20 sm:px-6 lg:left-64 lg:px-10">
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className={`${iconButton} lg:hidden`}
                        title="Menu"
                    >
                        <Menu className="h-4 w-4" />
                    </button>

                    <div className="shrink-0 lg:hidden">
                        <Link href={route('home')} className="block origin-left scale-90">
                            <Logo showText={false} className="h-9" />
                        </Link>
                    </div>

                    <div className="relative hidden md:block w-64 lg:w-80">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                            <input
                                type="text"
                                value={searchQuery || ''}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery && searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                                placeholder="Search the collection"
                                className="w-full rounded-full border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-[13px] font-light text-white placeholder-slate-600 transition-all duration-300 focus:border-gold-400/35 focus:bg-white/[0.04] focus:outline-none"
                            />
                        </form>

                        {showSearchDropdown && searchResults.length > 0 && (
                            <div className="lux-surface absolute left-0 right-0 top-14 z-50 space-y-0.5 rounded-2xl p-2">
                                <p className="px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.24em] text-slate-700">
                                    Matching titles
                                </p>
                                {searchResults.map(g => renderResult(g))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className={`${iconButton} md:hidden`} title="Search">
                        <Search className="h-4 w-4" />
                    </button>

                    <button onClick={handleToggleMute} className={iconButton} title={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>

                    <button
                        onClick={() => setIsWheelOpen(true)}
                        className="flex shrink-0 items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-200 transition-all duration-300 hover:bg-gold-400/12 sm:px-4"
                        title="Daily Wheel"
                    >
                        <Trophy className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Daily Wheel</span>
                    </button>

                    <nav className="hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 xl:flex">
                        <Link href={route('home')} className="transition-colors hover:text-gold-200">Home</Link>
                        <button
                            onClick={() => (!auth.user ? onOpenAuth('register') : setIsReferralOpen(true))}
                            className="flex items-center gap-1.5 transition-colors hover:text-gold-200"
                        >
                            <Gift className="h-3.5 w-3.5" />
                            <span>Referral</span>
                        </button>
                        {auth.user?.is_admin && (
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-1.5 rounded-full border border-gold-400/25 px-3 py-1.5 text-gold-200 transition-all hover:bg-gold-400/10"
                            >
                                <Shield className="h-3.5 w-3.5" />
                                <span>Admin</span>
                            </Link>
                        )}
                    </nav>

                    {auth.user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Balance */}
                            <div className="relative flex items-center gap-3 rounded-full border border-gold-400/22 bg-white/[0.025] py-1 pl-4 pr-1">
                                <AnimatePresence>
                                    {balanceDiff && (
                                        <motion.div
                                            key={balanceDiff.id}
                                            initial={{ opacity: 0, y: balanceDiff.amount > 0 ? 8 : -8 }}
                                            animate={{ opacity: 1, y: balanceDiff.amount > 0 ? -26 : 26 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                            className={`pointer-events-none absolute left-4 z-50 rounded-full border px-2.5 py-0.5 font-mono num text-[10px] font-semibold ${
                                                balanceDiff.amount > 0
                                                    ? 'border-jade-400/40 bg-jade-400/12 text-jade-400'
                                                    : 'border-rose-400/40 bg-rose-500/12 text-rose-300'
                                            }`}
                                        >
                                            {balanceDiff.amount > 0 ? '+' : ''}{balanceDiff.amount.toFixed(2)}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="leading-none">
                                    <span className="hidden text-[7px] font-semibold uppercase tracking-[0.24em] text-slate-600 sm:block">
                                        Balance
                                    </span>
                                    <span className={`mt-0.5 block font-mono num text-[13px] font-semibold transition-colors duration-300 sm:text-sm ${balanceTone}`}>
                                        {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        <span className="ml-1 font-sans text-[9px] text-slate-600">SC</span>
                                    </span>
                                </div>

                                <button
                                    onClick={() => setIsStoreOpen(true)}
                                    className="lux-btn-gold flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.14em]"
                                >
                                    <Plus className="relative z-10 h-3.5 w-3.5" />
                                    <span className="relative z-10 hidden sm:inline">Buy</span>
                                </button>
                            </div>

                            {/* Account */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdown(!userDropdown)}
                                    className="flex items-center gap-2 rounded-full border border-white/[0.07] py-1 pl-1 pr-1 transition-colors hover:border-white/15 md:pr-3.5"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-200 to-gold-600 text-[11px] font-semibold text-obsidian-950">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="hidden max-w-[84px] truncate text-[12px] font-medium text-slate-300 md:inline">
                                        {auth.user.name}
                                    </span>
                                </button>

                                {userDropdown && (
                                    <div className="lux-surface absolute right-0 mt-3 w-56 rounded-2xl p-2">
                                        <div className="border-b border-white/[0.06] px-3 pb-3 pt-2">
                                            <p className="truncate text-[13px] font-medium text-white">{auth.user.name}</p>
                                            <p className="mt-0.5 truncate text-[10px] font-light text-slate-600">{auth.user.email}</p>
                                        </div>

                                        <Link
                                            href={route('profile')}
                                            className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-gold-200"
                                        >
                                            <UserIcon className="h-3.5 w-3.5 opacity-70" />
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-rose-500/[0.07] hover:text-rose-300"
                                        >
                                            <LogOut className="h-3.5 w-3.5 opacity-70" />
                                            <span>Log Out</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onOpenAuth('login')}>
                                Login
                            </Button>
                            <Button variant="gold" size="sm" onClick={() => onOpenAuth('register')}>
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile search */}
            {isMobileSearchOpen && (
                <div className="fixed left-0 right-0 top-16 z-30 border-b border-white/[0.06] bg-obsidian-950/95 p-4 backdrop-blur-2xl md:hidden">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery || ''}
                                onChange={handleSearchChange}
                                placeholder="Search the collection"
                                className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-[13px] font-light text-white placeholder-slate-600 focus:border-gold-400/35 focus:outline-none"
                            />
                        </div>
                        <button type="button" onClick={() => setIsMobileSearchOpen(false)} className={iconButton}>
                            <X className="h-4 w-4" />
                        </button>
                    </form>

                    {searchResults.length > 0 && searchQuery && searchQuery.trim().length >= 2 && (
                        <div className="mt-3 max-h-64 space-y-0.5 overflow-y-auto rounded-2xl border border-white/[0.06] bg-obsidian-900/80 p-2">
                            {searchResults.map(g => renderResult(g, () => setIsMobileSearchOpen(false)))}
                        </div>
                    )}
                </div>
            )}

            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                user={auth.user}
                onBalanceUpdate={(newBal) => setLocalBalance(newBal)}
                onOpenAuth={onOpenAuth}
            />

            <ReferralModal isOpen={isReferralOpen} onClose={() => setIsReferralOpen(false)} user={auth.user} />

            <DailyWheelModal
                isOpen={isWheelOpen}
                onClose={() => setIsWheelOpen(false)}
                onBalanceUpdate={(newBal) => setLocalBalance(newBal)}
            />
        </>
    );
}
