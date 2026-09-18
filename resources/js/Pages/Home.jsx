import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { GameCard } from '../Components/Home/GameCard';
import { HeroBanner } from '../Components/Home/HeroBanner';

import StoreModal from '../Components/Modals/StoreModal';
import { JackpotWinModal } from '../Components/Modals/JackpotWinModal';
import AuthModal from '../Components/AuthModal';
import {
    Sparkles, Spade, Heart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
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

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(24);

    useEffect(() => {
        if (auth.user) {
            fetch('/api/favorites')
                .then(res => res.json())
                .then(data => {
                    if (data && Array.isArray(data.favorite_ids)) setFavoriteIds(data.favorite_ids);
                })
                .catch(() => {});
        }
    }, [auth.user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedProvider, currentCategory, showOnlyFavorites]);

    const handleFavToggle = (gameId, isFav) => {
        setFavoriteIds(prev => (isFav ? [...prev, gameId] : prev.filter(id => id !== gameId)));
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

        const matchesProvider = selectedProvider === 'ALL' ? true : (game.provider_code === selectedProvider);

        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (game.provider_code && game.provider_code.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFavorites && matchesCategory && matchesProvider && matchesSearch;
    });

    const totalGames = filteredGames.length;
    const totalPages = Math.max(1, Math.ceil(totalGames / perPage));
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalGames);
    const paginatedGames = filteredGames.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const el = document.getElementById('games-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
        return pages;
    };

    return (
        <MainLayout
            currentCategory={currentCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            <Head title="CROWDPLAY Social Casino — 3,200+ Slots & Live Tables" />

            {/* Flash */}
            {flash.success && (
                <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-jade-400/25 bg-jade-400/[0.07] px-4 py-3.5 text-[13px] font-medium text-jade-400">
                    <Sparkles className="h-4 w-4" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="mb-6 rounded-2xl border border-rose-500/25 bg-rose-500/[0.07] px-4 py-3.5 text-[13px] font-medium text-rose-300">
                    {flash.error}
                </div>
            )}

            <HeroBanner initialJackpot={jackpotAmount} onOpenStore={() => setIsStoreOpen(true)} />

            {/* ---------- Catalogue ---------- */}
            <div id="games-catalog" className="scroll-mt-24 sm:scroll-mt-28">
                {/* Section head */}
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="eyebrow">The collection</span>
                        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-light tracking-[-0.01em] text-white">
                            Browse the <em className="not-italic text-gold">full floor</em>
                        </h2>
                    </div>
                    <p className="font-mono num text-[11px] uppercase tracking-[0.18em] text-slate-600">
                        {totalGames.toLocaleString('en-US')} titles available
                    </p>
                </div>

                {/* Category rail */}
                <div className="no-scrollbar -mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-4">
                        {allCategories.map((cat) => {
                            const isActive = currentCategory === cat;
                            return (
                                <Link
                                    key={cat}
                                    href={route('home', { category: cat })}
                                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                                        isActive
                                            ? 'lux-btn-gold'
                                            : 'border border-white/[0.07] text-slate-500 hover:border-gold-400/30 hover:text-gold-200'
                                    }`}
                                >
                                    {cat === 'Favorites' && (
                                        <Heart className={`h-3 w-3 ${isActive ? 'fill-current' : 'text-gold-400/70'}`} />
                                    )}
                                    <span className="relative z-10">{cat}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Provider + per-page */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        <span className="shrink-0 pr-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                            Provider
                        </span>
                        {providers.map((prov) => {
                            const isSelected = selectedProvider === prov;
                            return (
                                <button
                                    key={prov}
                                    onClick={() => setSelectedProvider(prov)}
                                    className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                                        isSelected
                                            ? 'border-gold-400/40 bg-gold-400/10 text-gold-200'
                                            : 'border-white/[0.06] text-slate-600 hover:border-white/15 hover:text-slate-300'
                                    }`}
                                >
                                    {prov}
                                </button>
                            );
                        })}
                    </div>

                    {totalGames > 0 && (
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <span className="pr-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">Show</span>
                            {[16, 24, 32, 48].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setPerPage(size); setCurrentPage(1); }}
                                    className={`h-7 min-w-[2rem] rounded-full border px-2 font-mono num text-[10px] transition-all ${
                                        perPage === size
                                            ? 'border-gold-400/40 bg-gold-400/10 text-gold-200'
                                            : 'border-white/[0.06] text-slate-600 hover:border-white/15 hover:text-slate-300'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid */}
                {paginatedGames.length > 0 ? (
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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

                        {totalPages > 1 && (
                            <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.06] bg-obsidian-900/50 px-5 py-5 sm:flex-row sm:px-7">
                                <p className="font-mono num text-[11px] tracking-wide text-slate-600">
                                    <span className="text-slate-300">{startIndex + 1}</span>
                                    <span className="mx-1.5">—</span>
                                    <span className="text-slate-300">{endIndex}</span>
                                    <span className="mx-2 text-slate-700">of</span>
                                    <span className="text-gold-300">{totalGames.toLocaleString('en-US')}</span>
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-slate-500 transition-all hover:border-white/15 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-25"
                                        title="First page"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-slate-500 transition-all hover:border-white/15 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-25"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {getPageNumbers().map((page, i) => {
                                        if (page === '...') {
                                            return (
                                                <span key={`dots-${i}`} className="select-none px-1 text-slate-700">···</span>
                                            );
                                        }
                                        const isActive = currentPage === page;
                                        return (
                                            <button
                                                key={`page-${page}`}
                                                onClick={() => handlePageChange(page)}
                                                className={`h-9 min-w-[2.25rem] rounded-full font-mono num text-[11px] transition-all ${
                                                    isActive
                                                        ? 'lux-btn-gold'
                                                        : 'border border-white/[0.06] text-slate-500 hover:border-white/15 hover:text-slate-200'
                                                }`}
                                            >
                                                <span className="relative z-10">{page}</span>
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-slate-500 transition-all hover:border-white/15 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-25"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-slate-500 transition-all hover:border-white/15 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-25"
                                        title="Last page"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-white/[0.06] bg-obsidian-900/50 px-6 py-24 text-center">
                        <Spade className="mx-auto h-8 w-8 text-gold-400/40" />
                        <h3 className="mt-5 font-display text-2xl font-light text-white">Nothing on this table</h3>
                        <p className="mx-auto mt-3 max-w-sm text-[13px] font-light leading-relaxed text-slate-500">
                            No titles matched your filters. Reset them to browse all 3,200 games.
                        </p>
                        <div className="mt-7 flex justify-center">
                            <Button variant="glass" size="sm" onClick={() => { setSelectedProvider('ALL'); setSearchQuery(''); }}>
                                Reset filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                user={auth.user}
                onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
            />

            <JackpotWinModal
                isOpen={isJackpotOpen}
                onClose={() => setIsJackpotOpen(false)}
                winnerName={auth.user ? auth.user.name : 'Player'}
                amount={wonJackpotAmount}
            />

            <AuthModal
                isOpen={authModal.open}
                onClose={() => setAuthModal({ open: false, mode: 'login' })}
                mode={authModal.mode}
            />
        </MainLayout>
    );
}
