import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '../Layouts/MainLayout';
import { User as UserIcon, Coins, Trophy, Flame, Gift, Copy, Check, ShieldCheck, History, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Components/ui/card';

const getVipRank = (totalBet = 0) => {
    if (totalBet >= 100000) return { rank: 'DIAMOND VIP', color: 'purple', nextXp: 250000, currentXp: totalBet, percent: 100 };
    if (totalBet >= 25000) return { rank: 'PLATINUM VIP', color: 'cyan', nextXp: 100000, currentXp: totalBet, percent: Math.min(100, (totalBet / 100000) * 100) };
    if (totalBet >= 5000) return { rank: 'GOLD VIP', color: 'gold', nextXp: 25000, currentXp: totalBet, percent: Math.min(100, (totalBet / 25000) * 100) };
    if (totalBet >= 1000) return { rank: 'SILVER VIP', color: 'emerald', nextXp: 5000, currentXp: totalBet, percent: Math.min(100, (totalBet / 5000) * 100) };
    return { rank: 'BRONZE PLAYER', color: 'muted', nextXp: 1000, currentXp: totalBet, percent: Math.min(100, (totalBet / 1000) * 100) };
};

export default function Profile({ stats = {}, recentTransactions = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [copied, setCopied] = useState(false);
    const [nameInput, setNameInput] = useState(user ? user.name : '');

    const referralUrl = `${window.location.origin}/?ref=${user?.referral_code || ''}`;
    const vipInfo = getVipRank(stats.total_bet || 0);

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <MainLayout>
            <Head title={`${user ? user.name : 'Player'} Profile - CROWDPLAY Social Casino`} />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* User Header Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-amber-500/20">
                                {user ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div className="space-y-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h1 className="text-2xl font-black text-white">{user ? user.name : 'Player Profile'}</h1>
                                    <Badge variant={vipInfo.color}>{vipInfo.rank}</Badge>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">
                                    User Code: <strong className="text-slate-300">{user?.user_code || 'user_1'}</strong> • Email: <strong className="text-slate-300">{user?.email}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Balance Widget Card */}
                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shadow-inner">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <Coins className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block leading-none">SC Balance</span>
                                <span className="text-2xl font-black text-amber-400 font-mono leading-none">
                                    {Number(user ? user.game_balance : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* VIP Rank Progress Bar Bar */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-400" />
                                <span>VIP LOYALTY PROGRESS ({vipInfo.rank})</span>
                            </span>
                            <span className="text-amber-400 font-mono">
                                {Number(stats.total_bet || 0).toLocaleString()} / {Number(vipInfo.nextXp).toLocaleString()} XP
                            </span>
                        </div>

                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${vipInfo.percent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-md"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="mb-2">
                            <CardDescription>TOTAL SPINS PLAYED</CardDescription>
                            <CardTitle className="text-2xl font-mono text-cyan-400">{stats.total_spins || 0}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="mb-2">
                            <CardDescription>TOTAL WAGERED (SC)</CardDescription>
                            <CardTitle className="text-2xl font-mono text-amber-400">
                                {Number(stats.total_bet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="mb-2">
                            <CardDescription>TOTAL WON (SC)</CardDescription>
                            <CardTitle className="text-2xl font-mono text-emerald-400">
                                {Number(stats.total_win || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="mb-2">
                            <CardDescription>BIGGEST SINGLE WIN</CardDescription>
                            <CardTitle className="text-2xl font-mono text-purple-400">
                                {Number(stats.biggest_win || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>


                {/* Referral Link & Profile Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Referral Box */}
                    <div className="md:col-span-6">
                        <Card className="h-full space-y-4">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-amber-400" />
                                    <CardTitle>Referral Program</CardTitle>
                                </div>
                                <CardDescription>Share your unique referral link to earn +100 free Social Coins per invited friend.</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                                    <input
                                        type="text"
                                        readOnly
                                        value={referralUrl}
                                        className="bg-transparent w-full text-xs font-mono text-slate-300 focus:outline-none px-2"
                                    />
                                    <Button variant="gold" size="sm" onClick={handleCopyReferral}>
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Account Settings */}
                    <div className="md:col-span-6">
                        <Card className="h-full space-y-4">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-cyan-400" />
                                    <CardTitle>Account Details</CardTitle>
                                </div>
                                <CardDescription>Manage your public username and account identifier.</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Username</label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Spin & Transaction History */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-amber-400" />
                            <span>RECENT SPIN & TRANSACTION HISTORY</span>
                        </h3>
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-300">
                                    <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                                        <tr>
                                            <th className="py-4 px-6">ID / Txn Key</th>
                                            <th className="py-4 px-6">Game / Provider</th>
                                            <th className="py-4 px-6">Type</th>
                                            <th className="py-4 px-6">Bet (SC)</th>
                                            <th className="py-4 px-6">Win (SC)</th>
                                            <th className="py-4 px-6">Balance After</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 font-medium">
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-6 font-mono text-slate-400">{tx.txn_id ? tx.txn_id.slice(0, 14) : tx.id}...</td>
                                                <td className="py-4 px-6 font-bold text-white">
                                                    {tx.game ? tx.game.title : (tx.game_code || 'The Dog House')}
                                                    <span className="text-[10px] text-slate-500 font-normal block font-mono">{tx.provider_code || 'PRAGMATIC'}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge variant={tx.win_money > 0 ? 'emerald' : 'muted'}>
                                                         {tx.txn_type || (tx.win_money > 0 ? 'WIN' : 'BET')}
                                                     </Badge>
                                                </td>
                                                <td className="py-4 px-6 font-mono text-rose-400">-{Number(tx.bet_money || 0).toFixed(2)} SC</td>
                                                <td className="py-4 px-6 font-mono text-emerald-400">+{Number(tx.win_money || 0).toFixed(2)} SC</td>
                                                <td className="py-4 px-6 font-mono text-amber-400 font-bold">{Number(tx.balance_after || 0).toFixed(2)} SC</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                            No recent spin transactions logged yet. Start playing slots to see your history!
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
