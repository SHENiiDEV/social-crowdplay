import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Coins, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Zap, Clock, ArrowRight, Sliders } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { soundFx } from '../../utils/soundFx';

const COIN_PACKAGES = [
    { id: 'pack_micro', name: 'Micro', eur: 10, coins: 10, bonus: '0%', bonusLabel: 'Standard', popular: false, tag: null },
    { id: 'pack_basic', name: 'Basic', eur: 25, coins: 26, bonus: '+4%', bonusLabel: '+4% BONUS', popular: false, tag: null },
    { id: 'pack_popular', name: 'Popular', eur: 50, coins: 53, bonus: '+6%', bonusLabel: '+6% EXTRA', popular: true, tag: 'MOST POPULAR' },
    { id: 'pack_advanced', name: 'Advanced', eur: 100, coins: 108, bonus: '+8%', bonusLabel: '+8% BOOST', popular: false, tag: 'BEST VALUE' },
    { id: 'pack_vip', name: 'VIP', eur: 250, coins: 280, bonus: '+12%', bonusLabel: '+12% VIP', popular: false, tag: 'VIP LEVEL' },
    { id: 'pack_whale', name: 'Whale', eur: 500, coins: 575, bonus: '+15%', bonusLabel: '+15% MEGA', popular: false, tag: 'WHALE HIGH ROLLER' },
];

export default function StoreModal({ isOpen, onClose, user, onBalanceUpdate, onOpenAuth }) {
    const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'custom'
    const [selectedPack, setSelectedPack] = useState(COIN_PACKAGES[2]); // Default 50 EUR / 53 SC
    const [customSc, setCustomSc] = useState('100');
    const [paymentMethod, setPaymentMethod] = useState('visa_mastercard');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Daily 1 SC Free Bonus State
    const [dailyStatus, setDailyStatus] = useState({
        can_claim: false,
        cooldown_seconds: 0,
        loading: true,
    });

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

    // Fetch Daily Bonus status on mount / open
    const fetchDailyBonusStatus = async () => {
        try {
            const res = await fetch('/api/daily-bonus/status');
            if (res.ok) {
                const data = await res.json();
                setDailyStatus({
                    can_claim: !!data.can_claim,
                    cooldown_seconds: Number(data.cooldown_seconds || 0),
                    loading: false,
                });
            }
        } catch (e) {
            setDailyStatus(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDailyBonusStatus();
        }
    }, [isOpen, user]);

    // Live countdown timer for 24-hour daily bonus cooldown
    useEffect(() => {
        if (!isOpen || dailyStatus.cooldown_seconds <= 0) return;

        const interval = setInterval(() => {
            setDailyStatus(prev => {
                if (prev.cooldown_seconds <= 1) {
                    return { ...prev, cooldown_seconds: 0, can_claim: true };
                }
                return { ...prev, cooldown_seconds: prev.cooldown_seconds - 1 };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, dailyStatus.cooldown_seconds]);

    if (!isOpen) return null;

    const formatCooldown = (totalSec) => {
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Calculate Custom SC conversion & bonus
    const numCustomSc = Math.max(1, Number(customSc) || 0);
    const getBonusPercent = (sc) => {
        if (sc >= 500) return 15;
        if (sc >= 250) return 12;
        if (sc >= 100) return 8;
        if (sc >= 50) return 6;
        if (sc >= 25) return 4;
        return 0;
    };
    const customBonusPercent = getBonusPercent(numCustomSc);
    const customEffectiveCoins = numCustomSc * (1 + customBonusPercent / 100);
    const customUsdPrice = numCustomSc; // 1 USD = 1 Base SC

    // Claim Daily Free 1 SC (Strict 1x per 24h)
    const handleDailyClaim = async () => {
        if (!user) {
            onClose();
            if (onOpenAuth) onOpenAuth('register');
            return;
        }

        if (!dailyStatus.can_claim) return;

        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/daily-bonus/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                triggerConfetti();
                setSuccessMessage('🎁 Free Daily 1.00 SC Claimed! Balance updated.');
                setDailyStatus({
                    can_claim: false,
                    cooldown_seconds: 86400,
                    loading: false,
                });

                if (onBalanceUpdate && typeof data.new_balance === 'number') {
                    onBalanceUpdate(data.new_balance);
                }

                // Dispatch event so global balance updates instantly
                window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { balance: data.new_balance } }));

                setTimeout(() => {
                    setSuccessMessage(null);
                }, 4000);
            } else {
                setErrorMessage(data.message || 'Could not claim bonus.');
                if (data.cooldown_seconds) {
                    setDailyStatus({
                        can_claim: false,
                        cooldown_seconds: Number(data.cooldown_seconds),
                        loading: false,
                    });
                }
            }
        } catch (e) {
            setErrorMessage('Network error while claiming daily bonus.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Paid Purchase / Checkout
    const handlePurchase = async () => {
        if (!user) {
            onClose();
            if (onOpenAuth) onOpenAuth('register');
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const amountEur = activeTab === 'custom' ? customUsdPrice : selectedPack.eur;
        const amountSc = activeTab === 'custom' ? customEffectiveCoins : selectedPack.coins;

        try {
            const response = await fetch(route('cashier.checkout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    amount_eur: amountEur,
                    amount_sc: amountSc,
                    payment_method: paymentMethod,
                }),
            });

            const data = await response.json();

            if (data.status === 'success' && data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                setErrorMessage(data.message || 'Error initializing checkout');
            }
        } catch (err) {
            setErrorMessage('Payment error. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden my-auto"
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
                        <p className="text-xs text-slate-400">Claim your free 1.00 SC once per day or deposit custom SC amounts with instant delivery.</p>
                    </div>

                    {/* 1. Free 1 SC Daily Claim Banner Card (Strict 24h Cooldown) */}
                    <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 shrink-0">
                                🎁
                            </div>
                            <div className="space-y-0.5 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">DAILY FREE REWARD</span>
                                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">1x PER 24H</span>
                                </div>
                                <h4 className="text-base font-black text-white">Claim +1.00 SC Free Daily Bonus</h4>
                                <p className="text-[11px] text-slate-400">
                                    {dailyStatus.cooldown_seconds > 0 ? (
                                        <span className="text-amber-400 font-bold flex items-center gap-1">
                                            <Clock className="w-3 h-3 inline" /> Claimed today. Next reward in: <span className="font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{formatCooldown(dailyStatus.cooldown_seconds)}</span>
                                        </span>
                                    ) : (
                                        'Instantly top up your balance with 1.00 SC once every 24 hours without purchase.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="emerald"
                            size="md"
                            disabled={loading || (dailyStatus.cooldown_seconds > 0 && !!user)}
                            onClick={handleDailyClaim}
                            className={`w-full sm:w-auto px-6 font-black shrink-0 cursor-pointer ${
                                dailyStatus.cooldown_seconds > 0 && !!user
                                    ? 'opacity-60 bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20'
                            }`}
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : !user ? (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>LOG IN TO CLAIM 1.00 SC</span>
                                </>
                            ) : dailyStatus.cooldown_seconds > 0 ? (
                                <>
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="font-mono">{formatCooldown(dailyStatus.cooldown_seconds)}</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>CLAIM 1.00 SC FREE</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Navigation Tabs: Packages vs Custom SC Deposit */}
                    <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <button
                            type="button"
                            onClick={() => setActiveTab('packages')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'packages'
                                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Coins className="w-4 h-4" />
                            <span>COIN PACKAGES</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('custom')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'custom'
                                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Sliders className="w-4 h-4" />
                            <span>CUSTOM SC DEPOSIT</span>
                        </button>
                    </div>

                    {/* Tab 1: Preset Package Cards Grid */}
                    {activeTab === 'packages' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {COIN_PACKAGES.map((pack) => {
                                const isSelected = selectedPack.id === pack.id;

                                return (
                                    <div
                                        key={pack.id}
                                        onClick={() => setSelectedPack(pack)}
                                        className={`relative cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02]'
                                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                                        }`}
                                    >
                                        {pack.tag && (
                                            <div className="absolute -top-2.5 right-2 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-md bg-gradient-to-r from-amber-400 to-amber-600">
                                                {pack.tag}
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{pack.name} ({pack.bonusLabel})</span>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                                            </div>

                                            <div className="text-xl font-black font-mono text-amber-400">
                                                {pack.coins.toLocaleString()} <span className="text-xs font-sans text-amber-300">SC</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-medium">Price</span>
                                            <span className="text-sm font-black text-white">
                                                ${pack.eur}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Tab 2: Custom SC Deposit Input & Calculator */}
                    {activeTab === 'custom' && (
                        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-300">Enter Custom SC Amount</label>
                                {customBonusPercent > 0 && (
                                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                        +{customBonusPercent}% BONUS ACTIVE
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative flex-1 w-full">
                                    <input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={customSc}
                                        onChange={(e) => setCustomSc(e.target.value)}
                                        placeholder="Enter SC (e.g. 100)"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-mono font-black text-xl focus:outline-none focus:border-amber-400"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-amber-400 text-sm">
                                        SC
                                    </span>
                                </div>

                                <ArrowRight className="w-5 h-5 text-slate-600 hidden sm:block" />

                                <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">You Receive</p>
                                        <p className="text-lg font-black text-amber-400 font-mono">
                                            {customEffectiveCoins.toLocaleString()} SC
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cost</p>
                                        <p className="text-lg font-black text-white font-mono">
                                            ${customUsdPrice}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Select Chips */}
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                                <span className="text-[11px] font-bold text-slate-500">Quick amounts:</span>
                                {[25, 50, 100, 250, 500, 1000].map((scAmount) => (
                                    <button
                                        key={scAmount}
                                        type="button"
                                        onClick={() => setCustomSc(scAmount.toString())}
                                        className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
                                            Number(customSc) === scAmount
                                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                                                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                                        }`}
                                    >
                                        +{scAmount} SC
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-extrabold flex items-center gap-2">
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>256-Bit Encrypted Instant Checkout</span>
                        </div>

                        <Button
                            variant="gold"
                            size="lg"
                            disabled={loading}
                            onClick={handlePurchase}
                            className="w-full sm:w-auto px-8 font-black"
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : activeTab === 'custom' ? (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    <span>DEPOSIT {customEffectiveCoins.toLocaleString()} SC (${customUsdPrice})</span>
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



