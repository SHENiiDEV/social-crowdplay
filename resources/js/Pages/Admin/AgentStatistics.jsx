import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, ArrowLeft, Filter, ShieldCheck, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Button } from '../../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../Components/ui/card';
import { Badge } from '../../Components/ui/badge';

export default function AgentStatistics({ statsData = [], grouping = 'daily', startDate = '', endDate = '', agentBalance = 0 }) {
    const [selectedGrouping, setSelectedGrouping] = useState(grouping);
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.statistics.agents'), {
            grouping: selectedGrouping,
            start_date: start,
            end_date: end,
        });
    };

    const handleExportExcel = () => {
        window.location.href = route('admin.statistics.agents.export', {
            grouping: selectedGrouping,
            start_date: start,
            end_date: end,
        });
    };

    // Calculate chart dimensions & max value
    const maxGgr = Math.max(...statsData.map(d => Math.abs(Number(d.net_ggr || 0))), 100);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
            <Head title="Agent Statistics - Admin Panel" />

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
                                <BarChart3 className="w-6 h-6 text-amber-400" />
                                <span>Agent Statistics</span>
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">View API balance consumption and GGR breakdown of direct agents in chart format.</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <div>
                            <span className="text-[10px] uppercase font-black text-slate-400 block leading-none">Agent API Balance</span>
                            <span className="text-sm font-mono font-black text-amber-400">{agentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} EUR</span>
                        </div>
                    </div>
                </div>

                {/* Date Filter & Grouping Controls */}
                <form onSubmit={handleFilterSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Grouping:</span>
                            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSelectedGrouping('daily')}
                                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${selectedGrouping === 'daily' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Daily
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedGrouping('hourly')}
                                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${selectedGrouping === 'hourly' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Hourly
                                </button>
                            </div>
                        </div>

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

                {/* Visual Chart Card */}
                <Card className="p-6">
                    <CardHeader className="mb-4">
                        <CardTitle>API Balance Consumption Chart ({selectedGrouping.toUpperCase()})</CardTitle>
                        <CardDescription>Visualizing Net GGR and consumption volume over the selected timeframe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {statsData.length > 0 ? (
                            <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800 overflow-x-auto">
                                {statsData.map((d, i) => {
                                    const heightPercent = Math.min(100, Math.max(10, (Math.abs(Number(d.net_ggr || 0)) / maxGgr) * 100));
                                    return (
                                        <div key={i} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group">
                                            <div className="relative w-full flex items-end justify-center h-48 bg-slate-950 rounded-xl overflow-hidden p-1">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPercent}%` }}
                                                    transition={{ duration: 0.5, delay: i * 0.03 }}
                                                    className="w-full bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 rounded-lg shadow-md group-hover:from-cyan-500 group-hover:to-cyan-300 transition-colors"
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-full group-hover:text-white transition-colors">
                                                {d.time_key}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-slate-400 text-xs">
                                No consumption data recorded for the selected date range.
                            </div>
                        )}
                    </CardContent>
                </Card>

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

                        <span className="text-xs font-bold text-slate-400">{statsData.length} Records Found</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6">{selectedGrouping === 'hourly' ? 'Date & Hour' : 'Date'}</th>
                                        <th className="py-4 px-6">Total Bets (SC)</th>
                                        <th className="py-4 px-6">Total Wins (SC)</th>
                                        <th className="py-4 px-6">Net GGR (SC)</th>
                                        <th className="py-4 px-6">Total Spins</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium">
                                    {statsData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-white">{row.time_key}</td>
                                            <td className="py-4 px-6 font-mono text-amber-400">{Number(row.total_bets).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                            <td className="py-4 px-6 font-mono text-emerald-400">{Number(row.total_wins).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                            <td className="py-4 px-6 font-mono font-black text-cyan-400">{Number(row.net_ggr).toLocaleString('en-US', { minimumFractionDigits: 2 })} SC</td>
                                            <td className="py-4 px-6 font-mono text-slate-300">{row.total_spins}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
