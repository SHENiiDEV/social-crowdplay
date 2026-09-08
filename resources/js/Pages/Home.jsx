import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { GameCard } from '../Components/Home/GameCard';
import { HeroBanner } from '../Components/Home/HeroBanner';
import { LiveFeed } from '../Components/Home/LiveFeed';

import StoreModal from '../Components/Modals/StoreModal';
import { JackpotWinModal } from '../Components/Modals/JackpotWinModal';
import AuthModal from '../Components/AuthModal';
import { Sparkles, Trophy, Flame, Shield, ArrowRight, Dices, Users, Filter, Heart } from 'lucide-react';
import { Badge } from '../Components/ui/badge';
import { Button } from '../Components/ui/button';

export default function Home({ games = [], currentCategory = 'All', categories = [], jackpotAmount = 1284959.92 }) {
    const { flash, auth } = usePage().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isJackpotOpen, setIsJackpotOpen] = useState(false);
    const [authModal, setAuthModal] = useState({ open: false, mode: 'register' });
    const [wonJackpotAmount, setWonJackpotAmount] = useState(1284959.92);
    const [selectedProvider, setSelectedProvider] = useState('ALL');
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    useEffect(() => {
        if (auth.user) {
            fetch('/api/favorites')
                .then(res => res.json())
                .then(data => {
                    if (data && Array.isArray(data.favorite_ids)) {
                        setFavoriteIds(data.favorite_ids);
                    }
                })
                .catch(() => {});
        }
    }, [auth.user]);

    const handleTriggerJackpot = async () => {
        try {
            const response = await fetch('/api/jackpot/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data && data.won_amount) {
                setWonJackpotAmount(data.won_amount);
            }
            setIsJackpotOpen(true);
        } catch (e) {
            setIsJackpotOpen(true);
        }
    };

    const handleFavToggle = (gameId, isFav) => {
        if (isFav) {
            setFavoriteIds(prev => [...prev, gameId]);
        } else {
            setFavoriteIds(prev => prev.filter(id => id !== gameId));
        }
    };

    const providers = ['ALL', 'PRAGMATIC', 'EVOLUTION', 'PGSOFT', 'HACKSAW', 'SPRIBE', 'PLAYNGO', 'AMATIC', 'EGT'];

    const allCategories = categories.includes('Favorites') ? categories : ['Favorites', ...categories];

    const filteredGames = games.filter(game => {
        const matchesFavorites = showOnlyFavorites || currentCategory === 'Favorites'
            ? favoriteIds.includes(game.id)
            : true;

        const matchesCategory = (currentCategory === 'All' || currentCategory === 'Recommended' || currentCategory === 'Favorites')
            ? true
            : (game.category === currentCategory);

        const matchesProvider = selectedProvider === 'ALL'
            ? true
            : (game.provider_code === selectedProvider);

        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (game.provider_code && game.provider_code.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFavorites && matchesCategory && matchesProvider && matchesSearch;
    });

    return (
        <MainLayout
            currentCategory={currentCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            <Head title="CROWDPLAY Social Casino - Play 3,200+ Slots & Live Casino Games" />

            {/* Flash Notifications */}
            {flash.success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-extrabold text-sm flex items-center gap-2 shadow-lg">
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Bento Hero Banner */}
            <HeroBanner
                initialJackpot={jackpotAmount}
                onOpenStore={() => setIsStoreOpen(true)}
            />



            {/* Live Winners Feed Widget */}
            <LiveFeed />

            {/* Category & Provider Navigation Section */}
            <div id="games-catalog" className="space-y-6 mb-8">
                {/* Category Pills Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 overflow-x-auto gap-3">
                    <div className="flex items-center gap-2">
                        {allCategories.map((cat) => {
                            const isActive = currentCategory === cat;
                            return (
                                <Link
                                    key={cat}
                                    href={route('home', { category: cat })}
                                    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                                            : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-white hover:border-slate-700'
                                    }`}
                                >
                                    {cat === 'Favorites' && <Heart className={`w-3.5 h-3.5 ${isActive ? 'fill-slate-950 text-slate-950' : 'text-rose-500 fill-rose-500'}`} />}
                                    <span>{cat}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{filteredGames.length} Available Games</span>
                    </div>
                </div>

                {/* Provider Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <span className="text-[11px] font-black uppercase text-slate-500 mr-2 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Provider:</span>
                    </span>
                    {providers.map((prov) => {
                        const isSelected = selectedProvider === prov;
                        return (
                            <button
                                key={prov}
                                onClick={() => setSelectedProvider(prov)}
                                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wide transition-all ${
                                    isSelected
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                        : 'bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-slate-200'
                                }`}
                            >
                                {prov}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Game Cards Grid */}
            {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredGames.map((game, index) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            index={index}
                            isFavInitial={favoriteIds.includes(game.id)}
                            onFavToggle={handleFavToggle}
                            onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
                    <Dices className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-black text-white">No Games Found</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                        No games matched your selected filter. Try resetting your search or exploring all 3,200+ games.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedProvider('ALL'); setSearchQuery(''); }}>
                        Reset Filters
                    </Button>
                </div>
            )}

            {/* Store Modal */}
            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                user={auth.user}
            />

            {/* Jackpot Win Modal */}
            <JackpotWinModal
                isOpen={isJackpotOpen}
                onClose={() => setIsJackpotOpen(false)}
                winnerName={auth.user ? auth.user.name : 'Player'}
                amount={wonJackpotAmount}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModal.open}
                onClose={() => setAuthModal({ open: false, mode: 'login' })}
                mode={authModal.mode}
            />
        </MainLayout>
    );
}
