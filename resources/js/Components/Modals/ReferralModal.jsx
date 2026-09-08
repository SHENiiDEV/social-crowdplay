import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check, Users, Sparkles, Share2, Send, MessageSquare } from 'lucide-react';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function ReferralModal({ isOpen, onClose, user }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const referralCode = user?.referral_code || 'CROWD2026';
    const referralUrl = `${window.location.origin}/?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    const shareTelegram = () => {
        const text = encodeURIComponent(`Join CROWDPLAY Social Casino and claim 10,000 FREE Social Coins! Play 3,200+ slots risk-free: ${referralUrl}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`, '_blank');
    };

    const shareWhatsApp = () => {
        const text = encodeURIComponent(`Join CROWDPLAY Social Casino and claim 10,000 FREE Social Coins! ${referralUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    const shareTwitter = () => {
        const text = encodeURIComponent(`Spin 3,200+ authentic slots on CROWDPLAY Social Casino with 10,000 FREE Social Coins! 🎰 ${referralUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden"
                >
                    {/* Liquid Glass Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="space-y-2 pr-10">
                        <div className="flex items-center gap-2">
                            <Badge variant="gold">
                                <Gift className="w-3.5 h-3.5" />
                                <span>CROWD REFERRAL PROGRAM</span>
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-black text-white">EARN FREE SC BONUSES WITH FRIENDS</h2>
                        <p className="text-xs text-slate-400">Invite your gaming crowd. Get instant rewards for every active player who joins.</p>
                    </div>

                    {/* Rewards Highlight Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 space-y-1">
                            <span className="text-[10px] font-black uppercase text-amber-400 block">INSTANT SIGNUP REWARD</span>
                            <div className="text-2xl font-black font-mono text-white">+100 SC</div>
                            <p className="text-[11px] text-slate-400 font-medium">Added to your wallet per invited friend</p>
                        </div>


                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 space-y-1">
                            <span className="text-[10px] font-black uppercase text-cyan-400 block">COMMUNITY COMMISSION</span>
                            <div className="text-2xl font-black font-mono text-white">5% PERPETUAL</div>
                            <p className="text-[11px] text-slate-400 font-medium">Bonus on all referred friend spins</p>
                        </div>
                    </div>

                    {/* Copy Link Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Your Unique Referral Link</label>
                        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shadow-inner">
                            <input
                                type="text"
                                readOnly
                                value={referralUrl}
                                className="bg-transparent w-full text-xs font-mono text-slate-200 focus:outline-none px-2 select-all"
                            />
                            <Button variant="gold" size="sm" onClick={handleCopy} className="shrink-0">
                                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'COPIED!' : 'COPY'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Share Buttons */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase text-slate-400 block">Share Directly To:</span>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={shareTelegram}
                                className="py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-black flex items-center justify-center gap-2 transition-all"
                            >
                                <Send className="w-4 h-4" />
                                <span>Telegram</span>
                            </button>

                            <button
                                onClick={shareWhatsApp}
                                className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center justify-center gap-2 transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </button>

                            <button
                                onClick={shareTwitter}
                                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-black flex items-center justify-center gap-2 transition-all"
                            >
                                <Share2 className="w-4 h-4 text-cyan-400" />
                                <span>Share Link</span>

                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
