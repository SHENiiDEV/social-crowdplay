import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Users, DollarSign, Coins, TrendingUp, Shield, Settings, Activity, ArrowLeft } from 'lucide-react';

export default function Dashboard({ stats, recentUsers = [], recentDeposits = [], exchangeRate, promoMultiplier }) {
    const rateForm = useForm({
        exchange_rate: exchangeRate,
        promo_multiplier: promoMultiplier,
    });

    const handleRateSubmit = (e) => {
        e.preventDefault();
        rateForm.post(route('admin.settings.exchange-rate'));
    };

    return (
        <MainLayout>
            <Head title="Admin Dashboard - GammaPlus Social Casino" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Navigation bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">Admin Management Console</h1>
                            <p className="text-xs text-slate-400">Real-time platform statistics & exchange rate controls</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Link href={route('admin.statistics.agents')} className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 rounded-xl text-xs font-bold text-amber-300 transition-all">
                            Agent Statistics
                        </Link>
                        <Link href={route('admin.statistics.users')} className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 transition-all">
                            User Statistics
                        </Link>
                        <Link href={route('admin.control-rtp')} className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 rounded-xl text-xs font-bold text-purple-300 transition-all">
                            Control RTP
                        </Link>

                        <Link href={route('admin.users')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                            Users
                        </Link>
                        <Link href={route('admin.games')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                            Games
                        </Link>
                        <Link href={route('admin.logs')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                            Logs
                        </Link>
                    </div>

                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                            <span>Total Users</span>
                            <Users className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{stats.total_users}</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                            <span>Total Deposits (USD)</span>
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-3xl font-black text-emerald-400">${stats.total_deposits_eur.toFixed(2)}</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                            <span>Total Issued (SC)</span>
                            <Coins className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-amber-400">{stats.total_coins_distributed.toFixed(2)} SC</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                            <span>GGR (Bets - Wins)</span>
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="text-3xl font-black text-purple-300">{stats.ggr.toFixed(2)} SC</div>
                    </div>

                </div>

                {/* Exchange Rate Config & Recent Deposits */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Financial Rate Settings */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Settings className="w-5 h-5 text-amber-400" />
                            <h3 className="font-extrabold text-white text-base">Exchange Rate & Promotions</h3>
                        </div>

                        <form onSubmit={handleRateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Base Rate (1 USD = X SC)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={rateForm.data.exchange_rate}
                                    onChange={(e) => rateForm.setData('exchange_rate', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Promo Multiplier (e.g. 1.5 = +50% Coins)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.5"
                                    max="10"
                                    value={rateForm.data.promo_multiplier}
                                    onChange={(e) => rateForm.setData('promo_multiplier', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={rateForm.processing}
                                className="w-full btn-gold py-3 rounded-xl text-xs font-extrabold shadow-lg"
                            >
                                {rateForm.processing ? 'Saving Settings...' : 'Update Financial Config'}
                            </button>
                        </form>
                    </div>

                    {/* Recent Deposits Table */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Activity className="w-5 h-5 text-purple-400" />
                            <span>Recent Fiat Deposits</span>
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-400">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 uppercase">
                                        <th className="py-2.5 px-3">Order ID</th>
                                        <th className="py-2.5 px-3">User</th>
                                        <th className="py-2.5 px-3">USD</th>
                                        <th className="py-2.5 px-3">Coins</th>
                                        <th className="py-2.5 px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDeposits.map((dep) => (
                                        <tr key={dep.id} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                                            <td className="py-2.5 px-3 font-mono font-bold text-white">{dep.order_id}</td>
                                            <td className="py-2.5 px-3 font-medium text-slate-300">{dep.user?.name}</td>
                                            <td className="py-2.5 px-3 font-bold text-emerald-400">${dep.amount_eur}</td>
                                            <td className="py-2.5 px-3 font-bold text-amber-400">{dep.coins_received} SC</td>
                                            <td className="py-2.5 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    dep.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                    {dep.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
