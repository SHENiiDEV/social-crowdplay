import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '../Layouts/MainLayout';
import { ArrowLeft, Maximize2, ShieldCheck, Coins, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';

export default function GamePlay({ game, iframeUrl, sessionToken, isDemo }) {
    const { auth } = usePage().props;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [liveBalance, setLiveBalance] = useState(auth.user ? Number(auth.user.game_balance) : 0);

    // Live balance polling every 3 seconds while playing
    useEffect(() => {
        if (!auth.user) return;

        const interval = setInterval(() => {
            fetch('/user/balance')
                .then(res => res.json())
                .then(data => {
                    if (data && typeof data.balance === 'number') {
                        setLiveBalance(data.balance);
                    }
                })
                .catch(err => console.error('Balance polling error:', err));
        }, 3000);

        return () => clearInterval(interval);
    }, [auth.user]);

    const toggleFullscreen = () => {
        const elem = document.getElementById('game-iframe-container');
        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch(err => alert(err.message));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <MainLayout>
            <Head title={`Playing ${game.title} - CROWDPLAY Social Casino`} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="space-y-6 max-w-7xl mx-auto"
            >
                {/* Top Action Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <Link href={route('home')}>
                            <Button variant="glass" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>

                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-white">{game.title}</h2>
                                {isDemo && <Badge variant="gold">DEMO MODE</Badge>}
                            </div>
                            <p className="text-xs text-slate-400 font-semibold">
                                Category: {game.category} • Provider: {game.provider_code || 'GGR Gold API'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user && (
                            <div className="flex items-center gap-2.5 bg-slate-950 px-4 py-2 rounded-2xl border border-amber-500/30 shadow-inner">
                                <Coins className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                                <span className="font-black text-amber-400 text-base font-mono">
                                    {liveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-sans text-amber-300">SC</span>
                                </span>
                            </div>
                        )}


                        <Button variant="glass" size="sm" onClick={toggleFullscreen}>
                            <Maximize2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Fullscreen</span>
                        </Button>
                    </div>
                </div>

                {/* Game Iframe Container */}
                <div
                    id="game-iframe-container"
                    className="relative w-full aspect-[16/9] min-h-[580px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
                >
                    <iframe
                        src={iframeUrl}
                        title={game.title}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                    />
                </div>

                {/* Info Footer */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-400 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Seamless Wallet Sync Active (GGR Gold API Encrypted)</span>
                    </div>
                    <div className="font-mono text-slate-400">
                        Session: <span className="text-white font-bold">{sessionToken.slice(0, 8)}...</span>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
