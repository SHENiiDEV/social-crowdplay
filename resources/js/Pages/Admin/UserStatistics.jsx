import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Download, ArrowLeft, Filter, FileSpreadsheet, Percent, Trophy, Dices } from 'lucide-react';
import { Button } from '../../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../Components/ui/card';
import { Badge } from '../../Components/ui/badge';

export default function UserStatistics({ userStats = { data: [] }, startDate = '', endDate = '' }) {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.statistics.users'), {
            start_date: start,
            end_date: end,
        });
    };

    const handleExportExcel = () => {
        window.location.href = route('admin.statistics.users.export', {
            start_date: start,
            end_date: end,
        });
    };

    const usersList = userStats.data || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
            <Head title="User Statistics - Admin Panel" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.dashboard')}>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Admin</span>
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-slate-800" />
                        <div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                <Users className="w-6 h-6 text-cyan-400" />
                                <span>User Statistics</span>
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">View bet summary and wagering metrics of users within a specified date range.</p>
                        </div>
                    </div>
                </div>

                {/* Date Filter Controls */}
                <form onSubmit={handleFilterSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Start Date:</span>
                            <input
                                type="date"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400/50"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">End Date:</span>
                            <input
                                type="date"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400/50"
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="gold" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Apply Filter</span>
                    </Button>
                </form>

                {/* Table Data Section with Top-Left Excel Export */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Top Left Export Buttons */}
                        <div className="flex items-center gap-3">
                            <Button variant="gold" size="sm" onClick={handleExportExcel} className="gap-2 shadow-lg">
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Export to Excel</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
                                <Download className="w-4 h-4" />
                                <span>Export to CSV</span>
                            </Button>
                        </div>

                        <span className="text-xs font-bold text-slate-400">{usersList.length} Players Listed</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6">User Code / ID</th>
                                        <th className="py-4 px-6">Player Name</th>
                                        <th className="py-4 px-6">Total Bets (SC)</th>
                                        <th className="py-4 px-6">Total Wins (SC)</th>
                                        <th className="py-4 px-6">Net GGR (SC)</th>
                                        <th className="py-4 px-6">Actual RTP %</th>
                                        <th className="py-4 px-6">Spin Count</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium">
                                    {usersList.map((u) => {
                                        const bets = Number(u.total_bets || 0);
                                        const wins = Number(u.total_wins || 0);
                                        const ggr = bets - wins;
                                        const rtp = bets > 0 ? ((wins / bets) * 100).toFixed(2) : '0.00';

                                        return (
                                            <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-6 font-mono text-slate-400">{u.user_code || `user_${u.id}`}</td>
                                                <td className="py-4 px-6 font-bold text-white">
                                                    {u.name}
                                                    <span className="text-[10px] text-slate-500 font-normal block">{u.email}</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono text-amber-400">{bets.toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                                <td className="py-4 px-6 font-mono text-emerald-400">{wins.toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                                <td className="py-4 px-6 font-mono font-black text-cyan-400">{ggr.toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                                <td className="py-4 px-6 font-mono">
                                                    <Badge variant={Number(rtp) > 97 ? 'gold' : 'muted'}>
                                                        {rtp}%
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 font-mono text-slate-300">{u.spin_count || 0}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
