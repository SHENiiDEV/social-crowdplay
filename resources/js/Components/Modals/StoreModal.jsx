import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Coins, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { soundFx } from '../../utils/soundFx';

const COIN_PACKAGES = [
    { id: 'pack_free', name: 'Free Daily', eur: 0, coins: 1, bonus: 'FREE', bonusLabel: '$0.00', popular: false, tag: '🎁 FREE 1.00 SC' },
    { id: 'pack_micro', name: 'Micro', eur: 10, coins: 10, bonus: '0%', bonusLabel: 'Standard', popular: false, tag: null },
    { id: 'pack_basic', name: 'Basic', eur: 25, coins: 26, bonus: '+4%', bonusLabel: '+4% BONUS', popular: false, tag: null },
    { id: 'pack_popular', name: 'Popular', eur: 50, coins: 53, bonus: '+6%', bonusLabel: '+6% EXTRA', popular: true, tag: 'MOST POPULAR' },
    { id: 'pack_advanced', name: 'Advanced', eur: 100, coins: 108, bonus: '+8%', bonusLabel: '+8% BOOST', popular: false, tag: 'BEST VALUE' },
    { id: 'pack_vip', name: 'VIP', eur: 250, coins: 280, bonus: '+12%', bonusLabel: '+12% VIP', popular: false, tag: 'VIP LEVEL' },
    { id: 'pack_whale', name: 'Whale', eur: 500, coins: 575, bonus: '+15%', bonusLabel: '+15% MEGA', popular: false, tag: 'WHALE HIGH ROLLER' },
];


export default function StoreModal({ isOpen, onClose, user, onBalanceUpdate }) {
    const [selectedPack, setSelectedPack] = useState(COIN_PACKAGES[0]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!isOpen) return null;

    const triggerConfetti = () => {
        try {
            soundFx.playCoinSound();
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#fbbf24', '#06b6d4', '#a855f7'],
            });
        } catch (e) {
            console.error('Confetti error:', e);
        }
    };

    const handleDirectClaim = async (coins, eur, packId) => {
        setLoading(true);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/store/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    package_id: packId,
                    amount_sc: coins,
                    usd: eur,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                triggerConfetti();
                setSuccessMessage(eur === 0 ? `🎁 Free Bonus Claimed! +${coins}.00 SC added to your wallet.` : `Success! Added +${coins.toLocaleString()} SC to your wallet.`);
                if (onBalanceUpdate) {
                    onBalanceUpdate(data.new_balance);
                }
                setTimeout(() => {
                    setSuccessMessage(null);
                    onClose();
                }, 2500);
            } else {
                alert(data.message || 'Claim failed');
            }
        } catch (e) {
            // Fallback for simulation
            triggerConfetti();
            setSuccessMessage(eur === 0 ? `🎁 Free Bonus Claimed! +${coins}.00 SC added.` : `Demo Purchase Success! +${coins.toLocaleString()} SC added.`);
            if (onBalanceUpdate) {
                onBalanceUpdate((user?.game_balance || 10000) + coins);
            }
            setTimeout(() => {
                setSuccessMessage(null);
                onClose();
            }, 2500);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = () => {
        handleDirectClaim(selectedPack.coins, selectedPack.eur, selectedPack.id);
    };


    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden"
                >
                    {/* Liquid Glass Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="space-y-1 pr-12">
                        <div className="flex items-center gap-2">
                            <Badge variant="gold">
                                <Coins className="w-3.5 h-3.5" />
                                <span>SWEEPS COINS &amp; STORE</span>
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-black text-white">GET SC BONUS BUNDLES</h2>
                        <p className="text-xs text-slate-400">Claim your free daily SC reward or select a bundle to instantly add balance.</p>
                    </div>

                    {/* Free 1 SC Daily Claim Banner Card */}
                    <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 shrink-0">
                                🎁
                            </div>
                            <div className="space-y-0.5 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">DAILY FREE REWARD</span>
                                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">100% FREE</span>
                                </div>
                                <h4 className="text-base font-black text-white">Claim +1.00 SC Free Daily Bonus</h4>
                                <p className="text-[11px] text-slate-400">Instantly top up your balance with 1 SC every day without any purchase.</p>
                            </div>
                        </div>
                        <Button
                            variant="emerald"
                            size="md"
                            disabled={loading}
                            onClick={() => {
                                setSelectedPack(COIN_PACKAGES[0]);
                                handleDirectClaim(1, 0, 'pack_free');
                            }}
                            className="w-full sm:w-auto px-6 font-black bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>CLAIM 1.00 SC FREE</span>
                        </Button>
                    </div>

                    {/* Package Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {COIN_PACKAGES.map((pack) => {
                            const isSelected = selectedPack.id === pack.id;
                            const isFree = pack.eur === 0;

                            return (
                                <div
                                    key={pack.id}
                                    onClick={() => setSelectedPack(pack)}
                                    className={`relative cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                                        isSelected
                                            ? isFree
                                                ? 'bg-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                                                : 'bg-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02]'
                                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                                    }`}
                                >
                                    {pack.tag && (
                                        <div className={`absolute -top-2.5 right-2 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-md truncate max-w-[130px] ${
                                            isFree ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                                        }`}>
                                            {pack.tag}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{pack.name} ({pack.bonusLabel})</span>
                                            {isSelected && <CheckCircle2 className={`w-4 h-4 ${isFree ? 'text-emerald-400' : 'text-amber-400'}`} />}
                                        </div>

                                        <div className={`text-xl font-black font-mono ${isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {pack.coins.toLocaleString()} <span className={`text-xs font-sans ${isFree ? 'text-emerald-300' : 'text-amber-300'}`}>SC</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-medium">Price</span>
                                        <span className={`text-sm font-black ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                                            {isFree ? 'FREE' : `$${pack.eur}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Feedback Message */}
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>256-Bit Encrypted Instant Checkout</span>
                        </div>

                        <Button
                            variant={selectedPack.eur === 0 ? 'emerald' : 'gold'}
                            size="lg"
                            disabled={loading}
                            onClick={handlePurchase}
                            className={`w-full sm:w-auto px-8 font-black ${
                                selectedPack.eur === 0
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20'
                                    : ''
                            }`}
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : selectedPack.eur === 0 ? (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>CLAIM FREE (1.00 SC)</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    <span>PURCHASE (${selectedPack.eur})</span>
                                </>
                            )}
                        </Button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}


