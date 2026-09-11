import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Coins, PlusCircle, LogOut, Shield, Gift, Sparkles, User as UserIcon, Volume2, VolumeX, Trophy, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import StoreModal from './Modals/StoreModal';
import { ReferralModal } from './Modals/ReferralModal';
import { DailyWheelModal } from './Modals/DailyWheelModal';
import { soundFx } from '../utils/soundFx';

export default function Header({ onOpenAuth, searchQuery, setSearchQuery }) {
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

    // Track balance differences to trigger floating animated badges & audio FX
    useEffect(() => {
        const activeBal = localBalance !== null ? localBalance : (auth.user ? Number(auth.user.game_balance) : null);
        if (activeBal === null) return;

        if (prevBalance !== null && prevBalance !== activeBal) {
            const diff = activeBal - prevBalance;
            if (Math.abs(diff) >= 0.01) {
                setBalanceDiff({ amount: diff, id: Date.now() });

                if (diff > 0) {
                    soundFx.playCoinSound();
                }

                setTimeout(() => {
                    setBalanceDiff(null);
                }, 2200);
            }
        }
        setPrevBalance(activeBal);
    }, [localBalance, auth.user]);

    // Live Balance Polling (every 2.5s) to reflect real-time GGR spin debits/wins in top nav
    useEffect(() => {


        if (!auth.user) return;

        const fetchBalance = async () => {
            try {
                const res = await fetch('/user/balance');
                if (res.ok) {
                    const data = await res.json();
                    if (typeof data.balance === 'number') {
                        setLocalBalance(data.balance);
                    }
                }
            } catch (e) {
                // Ignore transient network errors
            }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 2500);

        const handleCustomBalanceUpdate = (e) => {
            if (e.detail?.balance !== undefined) {
                setLocalBalance(e.detail.balance);
            }
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

    const handleToggleMute = () => {
        const muted = soundFx.toggleMute();
        setIsMuted(muted);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowSearchDropdown(false);
        window.location.href = route('home', { search: searchQuery });
    };

    const currentBalance = localBalance !== null
        ? localBalance
        : (auth.user ? Number(auth.user.game_balance) : 0);

    return (
        <>
            <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 fixed top-0 left-64 right-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-2xl">
                {/* Search Input & Instant Autocomplete Dropdown */}
                <div className="relative w-72 sm:w-96">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery || ''}
                            onChange={handleSearchChange}
                            onFocus={() => searchQuery && searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                            placeholder="Search 3,200+ games, slots, baccarat..."
                            className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                        />
                    </form>

                    {/* Instant Search Autocomplete Dropdown */}
                    {showSearchDropdown && searchResults.length > 0 && (
                        <div className="absolute top-12 left-0 right-0 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                            <p className="px-3 py-1 text-[10px] font-black uppercase text-slate-500">Matching Games</p>
                            {searchResults.map(g => (
                                <Link
                                    key={g.id}
                                    href={route('game.play', { slug: g.slug })}
                                    onClick={(e) => {
                                        if (!auth.user) {
                                            e.preventDefault();
                                            setShowSearchDropdown(false);
                                            onOpenAuth('register');
                                        }
                                    }}
                                    className="flex items-center justify-between p-2 hover:bg-slate-800/80 rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img src={g.cover_image} alt={g.title} className="w-8 h-8 rounded-lg object-cover" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-white truncate group-hover:text-amber-400">{g.title}</p>
                                            <p className="text-[10px] text-slate-400">{g.provider_code || 'GGR API'}</p>
                                        </div>
                                    </div>
                                    <Badge variant="gold" className="text-[9px] px-2 py-0.5">PLAY</Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side Navigation & User Actions */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Audio Mute Toggle Button */}
                    <button
                        onClick={handleToggleMute}
                        title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                        className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-all shadow-md"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    {/* Daily Wheel Bonus Button */}
                    <button
                        onClick={() => setIsWheelOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black transition-all shadow-sm"
                    >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="hidden sm:inline">Daily Wheel</span>
                    </button>

                    <nav className="hidden md:flex items-center gap-5 text-sm font-extrabold text-slate-300">
                        <Link href={route('home')} className="hover:text-amber-400 transition-colors">Home</Link>
                        <button
                            onClick={() => {
                                if (!auth.user) onOpenAuth('register');
                                else setIsReferralOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                        >
                            <Gift className="w-4 h-4 text-amber-400" />
                            <span>Referral</span>
                        </button>
                        {auth.user?.is_admin && (
                            <Link href={route('admin.dashboard')} className="flex items-center gap-1.5 text-amber-400 font-black bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition-all">
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}
                    </nav>

                    {/* Authenticated User Actions vs Guest Buttons */}
                    {auth.user ? (
                        <div className="flex items-center gap-3">
                            {/* Balance Pill & Buy Coins Button */}
                            <div className="relative flex items-center bg-slate-900/90 rounded-2xl p-1.5 pl-3.5 border border-amber-500/30 shadow-lg">
                                {/* Floating Coin Change Badge Animation */}
                                <AnimatePresence>
                                    {balanceDiff && (
                                        <motion.div
                                            key={balanceDiff.id}
                                            initial={{ opacity: 0, y: balanceDiff.amount > 0 ? 10 : -10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: balanceDiff.amount > 0 ? -28 : 28, scale: 1.1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                                            className={`absolute left-3 px-2.5 py-0.5 rounded-full text-xs font-black font-mono shadow-2xl z-50 flex items-center gap-1 border pointer-events-none ${
                                                balanceDiff.amount > 0
                                                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white border-emerald-300 shadow-emerald-500/50'
                                                    : 'bg-gradient-to-r from-rose-600 to-rose-500 text-white border-rose-300 shadow-rose-500/50'
                                            }`}
                                        >
                                            {balanceDiff.amount > 0 ? `+${balanceDiff.amount.toFixed(2)} SC` : `${balanceDiff.amount.toFixed(2)} SC`}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-2 mr-3">
                                    <Coins className={`w-5 h-5 transition-transform duration-300 ${balanceDiff ? 'scale-125' : 'animate-pulse'} ${balanceDiff?.amount > 0 ? 'text-emerald-400' : (balanceDiff?.amount < 0 ? 'text-rose-400' : 'text-amber-400')}`} />
                                    <div>
                                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block leading-none">Balance</span>
                                        <span className={`font-black text-sm sm:text-base leading-none font-mono transition-colors duration-300 ${
                                            balanceDiff?.amount > 0
                                                ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                                : (balanceDiff?.amount < 0
                                                    ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]'
                                                    : 'text-amber-400')
                                        }`}>
                                            {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-sans text-amber-300">SC</span>
                                        </span>
                                    </div>
                                </div>


                                <Button
                                    variant="gold"
                                    size="sm"
                                    onClick={() => setIsStoreOpen(true)}
                                    className="shadow-md"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>BUY COINS</span>
                                </Button>
                            </div>


                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdown(!userDropdown)}
                                    className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-extrabold text-white max-w-[90px] truncate hidden sm:inline">{auth.user.name}</span>
                                </button>

                                {userDropdown && (
                                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                                        <div className="p-3 border-b border-slate-800 mb-1 space-y-0.5">
                                            <p className="text-xs font-black text-white truncate">{auth.user.name}</p>
                                            <p className="text-[11px] font-medium text-slate-400 truncate">{auth.user.email}</p>
                                        </div>

                                        <Link
                                            href={route('profile')}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-extrabold text-slate-200 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-all mb-1"
                                        >
                                            <UserIcon className="w-4 h-4 text-amber-400" />
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-extrabold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenAuth('login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="gold"
                                size="sm"
                                onClick={() => onOpenAuth('register')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Store Modal */}
            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                user={auth.user}
                onBalanceUpdate={(newBal) => setLocalBalance(newBal)}
                onOpenAuth={onOpenAuth}
            />

            {/* Referral Modal */}
            <ReferralModal
                isOpen={isReferralOpen}
                onClose={() => setIsReferralOpen(false)}
                user={auth.user}
            />

            {/* Daily Wheel Modal */}
            <DailyWheelModal
                isOpen={isWheelOpen}
                onClose={() => setIsWheelOpen(false)}
                onBalanceUpdate={(newBal) => setLocalBalance(newBal)}
            />
        </>
    );
}
