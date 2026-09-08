import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import Logo from '../../Components/Logo';
import { ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';

export default function About() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`About Us - ${company?.name}`} />

            <div className="max-w-4xl mx-auto space-y-8 py-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <Logo />
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {company?.name} is a next-generation Social Casino platform delivering high-stakes casino entertainment, live baccarat, and lightning roulette with zero financial risk.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <Users className="w-8 h-8 text-cyan-400" />
                        <h3 className="font-bold text-white text-base">Community Driven</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">Built for social players to compete, share referral bonuses, and enjoy risk-free gaming.</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                        <h3 className="font-bold text-white text-base">GammaPlus API</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">Powered by GammaPlus Seamless Wallet API for instant live balance synchronization.</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <ShieldCheck className="w-8 h-8 text-amber-400" />
                        <h3 className="font-bold text-white text-base">Full Licensing</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">Operated under License {company?.license} by {company?.name}.</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
