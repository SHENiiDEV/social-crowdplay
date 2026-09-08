import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { FileText, Coins, CreditCard } from 'lucide-react';

export default function Logs({ transactions, deposits }) {
    const [tab, setTab] = useState('transactions');

    return (
        <MainLayout>
            <Head title="Transaction Logs - Admin Panel" />

            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-purple-400" />
                        <div>
                            <h1 className="text-xl font-black text-white">System Logs & Auditing</h1>
                            <p className="text-xs text-slate-400">Detailed records of bets, wins, rollbacks, and deposits</p>
                        </div>
                    </div>
                    <Link href={route('admin.dashboard')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
                    <button
                        onClick={() => setTab('transactions')}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                            tab === 'transactions'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                    >
                        <Coins className="w-4 h-4" />
                        <span>Bets / Wins Logs ({transactions.total || transactions.data.length})</span>
                    </button>

                    <button
                        onClick={() => setTab('deposits')}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                            tab === 'deposits'
                                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Fiat Deposits ({deposits.total || deposits.data.length})</span>
                    </button>
                </div>

                {/* Logs Content */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {tab === 'transactions' ? (
                            <table className="w-full text-left text-xs text-slate-400">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 uppercase">
                                        <th className="py-4 px-6">Tx ID</th>
                                        <th className="py-4 px-6">User</th>
                                        <th className="py-4 px-6">Type</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6">Before → After</th>
                                        <th className="py-4 px-6">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-800/40 hover:bg-slate-800/30">
                                            <td className="py-4 px-6 font-mono font-bold text-slate-300">{tx.provider_tx_id}</td>
                                            <td className="py-4 px-6 font-bold text-white">{tx.user?.name}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    tx.type === 'win' ? 'bg-amber-500/20 text-amber-300' :
                                                    tx.type === 'bet' ? 'bg-purple-500/20 text-purple-300' :
                                                    'bg-blue-500/20 text-blue-300'
                                                }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`py-4 px-6 font-extrabold text-sm ${tx.type === 'win' ? 'text-amber-400' : 'text-slate-200'}`}>
                                                {tx.type === 'win' ? '+' : '-'}{tx.amount} SC
                                            </td>
                                            <td className="py-4 px-6 font-mono text-slate-400">
                                                {tx.balance_before} → <span className="font-bold text-white">{tx.balance_after}</span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500">{new Date(tx.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left text-xs text-slate-400">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 uppercase">
                                        <th className="py-4 px-6">Order ID</th>
                                        <th className="py-4 px-6">User</th>
                                        <th className="py-4 px-6">USD Paid</th>
                                        <th className="py-4 px-6">Amount Credited</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.data.map((d) => (
                                        <tr key={d.id} className="border-b border-slate-800/40 hover:bg-slate-800/30">
                                            <td className="py-4 px-6 font-mono font-bold text-white">{d.order_id}</td>
                                            <td className="py-4 px-6 font-bold text-slate-300">{d.user?.name}</td>
                                            <td className="py-4 px-6 font-bold text-emerald-400">${d.amount_eur}</td>
                                            <td className="py-4 px-6 font-black text-amber-400">{d.coins_received} SC</td>

                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    d.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500">{new Date(d.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
