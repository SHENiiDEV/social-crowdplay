import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { HeartHandshake, ShieldCheck, Clock, Lock, Sparkles, AlertCircle } from 'lucide-react';

export default function ResponsibleGaming() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Responsible Social Gaming - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Player Protection & Entertainment First</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Responsible Social Gaming Center</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            {company?.name} is committed to providing a fun, healthy, and controlled social gaming environment for all players.
                        </p>
                    </div>
                </div>

                {/* Core Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <h3 className="font-bold text-white text-base">Pure Entertainment</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Remember that Social Coins (SC) have zero cash value. Play for fun and enjoyment rather than seeking financial gain.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Clock className="w-8 h-8 text-cyan-400" />
                        <h3 className="font-bold text-white text-base">Time Management</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Keep track of how much time you spend playing live baccarat or roulette. Take regular breaks away from the screen.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Lock className="w-8 h-8 text-emerald-400" />
                        <h3 className="font-bold text-white text-base">Self-Exclusion Tools</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Request temporary timeouts or permanent account blocking whenever you feel you need a break from social gaming.
                        </p>
                    </div>
                </div>

                {/* Self Exclusion Request Box */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-emerald-400" />
                        <span>Request Account Self-Exclusion</span>
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        If you would like to pause your access to {company?.name}, simply email our dedicated Player Safety team at <a href={`mailto:${company?.email}`} className="text-emerald-400 font-bold hover:underline">{company?.email}</a> with the subject line <strong>"Self-Exclusion Request"</strong>.
                        Your account will be instantly closed, and coin purchases will be blocked.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
