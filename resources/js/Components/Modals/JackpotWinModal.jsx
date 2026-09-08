import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, X, Flame } from 'lucide-react';
import { Button } from '../ui/button';

import { soundFx } from '../../utils/soundFx';

export function JackpotWinModal({ isOpen, onClose, winnerName = 'Player', amount = 1284950.40 }) {
    useEffect(() => {
        if (isOpen) {
            try {
                soundFx.playJackpotSound();
                confetti({
                    particleCount: 200,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#fbbf24', '#f59e0b', '#d97706', '#06b6d4', '#10b981'],
                });
            } catch (e) {
                console.error('Jackpot sound & confetti error:', e);
            }
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-8 shadow-[0_0_80px_rgba(251,191,36,0.3)] text-center space-y-6 overflow-hidden"
                >
                    {/* Ambient Radial Background Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.25)_0,transparent_70%)] pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-amber-300 animate-bounce">
                            <Trophy className="w-10 h-10 text-slate-950" />
                        </div>

                        <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40">
                                <Sparkles className="w-4 h-4" />
                                <span>GRAND CASINO JACKPOT WINNER</span>
                            </span>
                            <h2 className="text-3xl font-black text-white pt-2">CONGRATULATIONS, {winnerName.toUpperCase()}!</h2>
                        </div>

                        <div className="py-4 bg-slate-950/80 rounded-2xl border border-amber-500/40 shadow-inner">
                            <span className="text-xs uppercase font-black text-slate-400 block mb-1">JACKPOT PRIZE PAYOUT</span>
                            <span className="text-4xl font-black font-mono text-amber-400 tracking-tight drop-shadow-[0_4px_20px_rgba(251,191,36,0.4)]">
                                +{Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC
                            </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            The Grand Progressive Jackpot was triggered! The prize has been credited directly to your SC wallet.
                        </p>


                        <Button
                            variant="gold"
                            size="lg"
                            onClick={onClose}
                            className="w-full shadow-2xl shadow-amber-500/30"
                        >
                            COLLECT JACKPOT PRIZE
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
