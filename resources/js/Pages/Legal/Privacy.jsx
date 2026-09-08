import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Lock, ShieldCheck, Database, Key, Server, FileText, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Privacy Policy - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                            <Lock className="w-3.5 h-3.5 text-purple-400" />
                            <span>Privacy & Data Protection Standards</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Privacy Policy</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            At {company?.name}, protecting your personal privacy and maintaining transparent data handling for our Social Casino platform is a core commitment.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Database className="w-8 h-8 text-cyan-400" />
                        <h3 className="font-bold text-white text-base">1. Data Collection</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            We collect account identifiers (email, name), IP addresses, and game transaction logs required to operate Social Coin balances and provider sessions.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Server className="w-8 h-8 text-purple-400" />
                        <h3 className="font-bold text-white text-base">2. Provider Integration</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Game sessions are communicated via encrypted HMAC-SHA256 tokens with GammaPlus API to verify live Social Coin bets and wins securely.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <Key className="w-8 h-8 text-amber-400" />
                        <h3 className="font-bold text-white text-base">3. GDPR Rights</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            You have the right to request access, correction, or deletion of your personal data stored by {company?.name} at any time.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-xs text-slate-300 leading-relaxed">
                    <h2 className="text-lg font-black text-white">Full Privacy Disclosure</h2>
                    
                    <p>
                        This Privacy Policy describes how <strong>{company?.name}</strong> (Registration No: {company?.reg_number}) handles data collected during your interaction with our Social Casino platform.
                    </p>

                    <div className="space-y-4 pt-2">
                        <h3 className="font-extrabold text-sm text-cyan-400 uppercase tracking-wider">Cookies & Local Storage</h3>
                        <p>
                            We use essential session cookies to remember your login state, maintain your virtual Social Coin balance display, and prevent session hijacking.
                        </p>

                        <h3 className="font-extrabold text-sm text-purple-400 uppercase tracking-wider">Third-Party Payment Processors</h3>
                        <p>
                            When you purchase Social Coin packages in our Store / Cashier, payment information (credit card numbers, payment tokens) is processed directly by PCI-DSS compliant providers (e.g. Stripe). {company?.name} does not store full credit card numbers on its servers.
                        </p>
                    </div>

                    <div className="border-t border-slate-800 pt-6 text-xs text-slate-400">
                        For data protection inquiries or GDPR requests, email our privacy team at <a href={`mailto:${company?.email}`} className="text-cyan-400 font-bold hover:underline">{company?.email}</a>.
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
