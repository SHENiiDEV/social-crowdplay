import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Settings, Percent, ArrowLeft, Shield, Sliders, Sparkles, AlertCircle, CheckCircle2, Zap, Layers, HelpCircle, Trophy, Flame, Crown } from 'lucide-react';
import { Button } from '../../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../Components/ui/card';
import { Badge } from '../../Components/ui/badge';

const RTP_PRESETS = [
    { label: '85% (Low)', value: 85, badge: 'muted', desc: 'Lower return' },
    { label: '90% (Standard Default)', value: 90, badge: 'muted', desc: 'Standard player' },
    { label: '95% (Agent Benchmark)', value: 95, badge: 'gold', desc: 'Agent baseline' },
    { label: '100% (Fair Play)', value: 100, badge: 'gold', desc: 'Break-even' },
    { label: '150% (VIP Boost)', value: 150, badge: 'cyan', desc: '2x-20x wins' },
    { label: '300% (Streamer Boost)', value: 300, badge: 'purple', desc: '15x-50x wins' },
    { label: '500% (High Roller Заносы)', value: 500, badge: 'gold', desc: '50x-150x wins' },
    { label: '🚀 999% (Бешеные Заносы / God Mode)', value: 999, badge: 'danger', desc: '500x-2500x Max Win!' },
];

export default function ControlRtp({ users = { data: [] }, slotProviders = [], agentRtpBenchmark = 95, globalDefaultRtp = 90 }) {
    const { flash } = usePage().props;
    const [selectedProvider, setSelectedProvider] = useState('PRAGMATIC');
    const [globalRtpInput, setGlobalRtpInput] = useState(globalDefaultRtp);
    const [customRtpMap, setCustomRtpMap] = useState({});

    const rtpForm = useForm({
        rtp: 90,
        provider_code: 'PRAGMATIC',
    });

    const globalForm = useForm({
        global_default_rtp: globalDefaultRtp,
    });

    const handleUpdateRtp = (user, rtpValue) => {
        rtpForm.setData({
            rtp: rtpValue,
            provider_code: selectedProvider,
        });
        rtpForm.post(route('admin.control-rtp.update', { user: user.id }), {
            preserveScroll: true,
        });
    };

    const handleUpdateGlobalRtp = (e) => {
        e.preventDefault();
        globalForm.setData({ global_default_rtp: globalRtpInput });
        globalForm.post(route('admin.control-rtp.global-update'), {
            preserveScroll: true,
        });
    };

    const usersList = users.data || [];

    const getRtpBadge = (rtp) => {
        if (rtp >= 999) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/20 animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    🚀 999% БЕШЕНЫЕ ЗАНОСЫ
                </span>
            );
        }
        if (rtp >= 500) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    🔥 {rtp}% High Roller
                </span>
            );
        }
        if (rtp >= 300) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Crown className="w-3.5 h-3.5 text-purple-400" />
                    ⚡ {rtp}% Streamer Boost
                </span>
            );
        }
        if (rtp > 100) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    💎 {rtp}% VIP Boost
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                {rtp}% Standard
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
            <Head title="Control RTP & Agent Jackpot - Admin Panel" />

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
                                <Sliders className="w-6 h-6 text-amber-400" />
                                <span>Control RTP &amp; Agent Jackpot (1 ~ 999%)</span>
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">Manage Agent-Oriented RTP Benchmarks, Jackpot Distribution &amp; Player Insane Wins (Бешеные Заносы).</p>
                        </div>
                    </div>
                </div>

                {/* Top Bar Config: Agent Benchmark vs Global Default User RTP */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Agent Benchmark Card */}
                    <div className="md:col-span-6 bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Agent Benchmark RTP</span>
                                <span className="text-3xl font-black text-amber-400 font-mono">{agentRtpBenchmark}%</span>
                                <span className="text-[11px] text-slate-400 font-medium block">Expected GGR Margin: ~5% Turnover Benchmark</span>
                            </div>
                        </div>
                        <Badge variant="gold">FIXED BENCHMARK</Badge>
                    </div>

                    {/* Global Default User RTP Control */}
                    <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Global Default RTP for All Users</span>
                                <span className="text-3xl font-black text-cyan-400 font-mono">{globalDefaultRtp}%</span>
                                <span className="text-[11px] text-slate-400 font-medium block">Standard for unassigned regular players (&lt; 95%)</span>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateGlobalRtp} className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={globalRtpInput}
                                onChange={(e) => setGlobalRtpInput(Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-400"
                            />
                            <Button type="submit" variant="outline" size="sm">Save</Button>
                        </form>
                    </div>
                </div>

                {/* Agent Jackpot Mechanism Architecture Card */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-slate-300 text-xs space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            <span>AGENT JACKPOT MECHANISM &amp; DYNAMIC RTP DISTRIBUTION (1 ~ 999%)</span>
                        </div>
                        <Badge variant="gold">OFFICIAL SPECIFICATION</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium pt-1">
                        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                            <strong className="text-amber-400 block mb-1">1. Agent Benchmark (95%)</strong>
                            Strictly maintains agent turnover. If user betting reaches $1M, expected platform retention is ~5% ($50K).
                        </div>
                        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                            <strong className="text-cyan-400 block mb-1">2. Default Player Base (&le; 90%)</strong>
                            Maintains regular traffic below 95%, ensuring the house generates steady volume and retained balance.
                        </div>
                        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                            <strong className="text-purple-400 block mb-1">3. Agent Jackpot Balancing</strong>
                            Distributes surplus pool to selected players, creating massive jackpot drops and enabling showcase withdrawals.
                        </div>
                        <div className="bg-slate-950 p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
                            <strong className="text-rose-400 block mb-1">4. Бешеные Заносы (999%)</strong>
                            God Mode: overrides spins with massive multipliers (50x ~ 2,500x Max Win) for streamer showcases and VIP tests.
                        </div>
                    </div>
                </div>

                {/* Flash Notifications */}
                {flash.success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Slot Provider Selector Tabs */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase block">Select Target Slot Provider for API:</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {slotProviders.map((prov) => (
                            <button
                                key={prov.code}
                                onClick={() => setSelectedProvider(prov.code)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                                    selectedProvider === prov.code
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-105'
                                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {prov.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User RTP Control Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>PLAYER CUSTOM RTP &amp; ЗАНОСЫ CONFIGURATION ({selectedProvider})</span>
                        </h3>
                        <span className="text-xs font-bold text-slate-400">{usersList.length} Registered Accounts</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6">User Code / ID</th>
                                        <th className="py-4 px-6">Player Name</th>
                                        <th className="py-4 px-6">Status / Mode</th>
                                        <th className="py-4 px-6">RTP Presets (1 to 999)</th>
                                        <th className="py-4 px-6 text-right">Custom RTP Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium">
                                    {usersList.map((u) => {
                                        const currentRtp = u.target_rtp || globalDefaultRtp;
                                        const userCustomValue = customRtpMap[u.id] !== undefined ? customRtpMap[u.id] : currentRtp;

                                        return (
                                            <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-6 font-mono text-slate-400">{u.user_code || `user_${u.id}`}</td>
                                                <td className="py-4 px-6 font-bold text-white">
                                                    {u.name}
                                                    <span className="text-[10px] text-slate-500 font-normal block">{u.email}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {getRtpBadge(currentRtp)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {RTP_PRESETS.map((preset) => {
                                                            const isSelected = currentRtp === preset.value;
                                                            return (
                                                                <button
                                                                    key={preset.value}
                                                                    onClick={() => handleUpdateRtp(u, preset.value)}
                                                                    title={preset.desc}
                                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                                                                        isSelected
                                                                            ? (preset.value >= 999
                                                                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105'
                                                                                : 'bg-amber-400 text-slate-950 shadow-md scale-105')
                                                                            : (preset.value >= 999
                                                                                ? 'bg-rose-950/40 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white'
                                                                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700')
                                                                    }`}
                                                                >
                                                                    {preset.value === 999 ? '🚀 999% ЗАНОСЫ' : `${preset.value}%`}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="999"
                                                            value={userCustomValue}
                                                            onChange={(e) => setCustomRtpMap({ ...customRtpMap, [u.id]: Number(e.target.value) })}
                                                            className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-400/50"
                                                        />
                                                        <Button
                                                            variant="gold"
                                                            size="sm"
                                                            onClick={() => handleUpdateRtp(u, userCustomValue)}
                                                            className="px-3 text-xs"
                                                        >
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </td>
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
