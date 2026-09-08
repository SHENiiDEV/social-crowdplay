import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { GameCard } from '../Components/Home/GameCard';
import { HeroBanner } from '../Components/Home/HeroBanner';
import { LiveFeed } from '../Components/Home/LiveFeed';

import StoreModal from '../Components/Modals/StoreModal';
import { JackpotWinModal } from '../Components/Modals/JackpotWinModal';
import AuthModal from '../Components/AuthModal';
import { 
    Sparkles, Trophy, Flame, Shield, ArrowRight, Dices, Users, Filter, 
    Heart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
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

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(24);

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

    // Reset pagination to page 1 on filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedProvider, currentCategory, showOnlyFavorites]);

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

    // Pagination calculations
    const totalGames = filteredGames.length;
    const totalPages = Math.max(1, Math.ceil(totalGames / perPage));
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalGames);
    const paginatedGames = filteredGames.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const el = document.getElementById('games-catalog');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

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
            <div id="games-catalog" className="space-y-6 mb-8 scroll-mt-24">
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

                    <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400 whitespace-nowrap">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{totalGames} Available Games</span>
                    </div>
                </div>

                {/* Provider Filter Tabs & Per-Page Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <span className="text-[11px] font-black uppercase text-slate-500 mr-1 flex items-center gap-1">
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

                    {totalGames > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 ml-auto">
                            <span className="text-[11px] font-bold text-slate-500">Per page:</span>
                            {[16, 24, 32, 48].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        setPerPage(size);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                        perPage === size
                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Cards Grid */}
            {paginatedGames.length > 0 ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedGames.map((game, index) => (
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

                    {/* Interactive Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-xl">
                            {/* Counter */}
                            <div className="text-xs font-bold text-slate-400">
                                Showing <span className="text-white font-extrabold">{startIndex + 1}</span> to{' '}
                                <span className="text-white font-extrabold">{endIndex}</span> of{' '}
                                <span className="text-amber-400 font-black">{totalGames}</span> games
                            </div>

                            {/* Page Controls */}
                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                {/* First & Prev */}
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    title="First page"
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Prev</span>
                                </button>

                                {/* Numbered Pages */}
                                {getPageNumbers().map((page, i) => {
                                    if (page === '...') {
                                        return (
                                            <span key={`dots-${i}`} className="px-2 text-slate-500 font-bold select-none">
                                                ...
                                            </span>
                                        );
                                    }
                                    const isActive = currentPage === page;
                                    return (
                                        <button
                                            key={`page-${page}`}
                                            onClick={() => handlePageChange(page)}
                                            className={`min-w-[38px] h-[38px] rounded-xl text-xs font-black transition-all ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                                                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next & Last */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    title="Last page"
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
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
