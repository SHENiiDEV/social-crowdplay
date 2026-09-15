import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldCheck, Lock, Server, Cpu, CheckCircle2, KeyRound, Award, ArrowRight } from 'lucide-react';

export default function Security() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Security, PCI DSS & Fair Play - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Bank-Grade Security Architecture</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Security, PCI DSS & Fair Gaming Certification</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            How {company?.name} protects player account data, enforces PCI DSS Level 1 payment compliance, and ensures mathematical game fairness.
                        </p>
                    </div>
                </div>

                {/* 3 Pillars of Security Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-white">PCI DSS Level 1</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Card payment transactions are tokenized and processed via certified PCI DSS Tier 1 gateways. Card numbers are never stored in plain text.
                        </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Server className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-white">256-Bit SSL Encryption</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            End-to-end Transport Layer Security (TLS 1.3) protects all data transferred between your browser and our high-availability cloud servers.
                        </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-white">Certified RNG Fair Play</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            All 3,200+ games use laboratory-certified Random Number Generators provided by licensed software studios via GGR Gold API.
                        </p>
                    </div>
                </div>

                {/* Main Clauses */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <KeyRound className="w-5 h-5 text-emerald-400" />
                                <span>1. Account Protection & Password Hashing</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>
                                    Player credentials are protected using industry-standard <strong>Argon2id / Bcrypt</strong> cryptographic hashing algorithms with high-entropy salt. We employ strict brute-force rate-limiting on login endpoints.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-400" />
                                <span>2. Independent Game Auditing</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>
                                    All game titles hosted on {company?.name} (Pragmatic Play, Evolution, PG Soft, Hacksaw, Spribe, etc.) undergo rigorous mathematical auditing by accredited international testing labs (eCOGRA, iTech Labs, BMM Testlabs).
                                </p>
                                <p className="text-slate-400">
                                    Return-to-Player (RTP) percentages are calibrated to official factory specifications and verified against real-world game sessions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Trust Badges */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Payment Partners</h3>
                            <div className="flex items-center gap-3">
                                <div className="h-10 px-3.5 bg-white rounded-xl flex items-center justify-center shadow-md">
                                    <img src="/images/visa.png" alt="VISA" className="h-6 w-auto object-contain" />
                                </div>
                                <div className="h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shadow-md">
                                    <img src="/images/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                                </div>
                                <div className="h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shadow-md">
                                    <img src="/images/pci-dss.png" alt="PCI DSS" className="h-6 w-auto object-contain" />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">
                                Official partner gateways with tokenized 3D Secure authentication.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Legal Overview</h3>
                            <ul className="space-y-2 text-xs">
                                <li><Link href={route('legal.terms')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Terms of Service</Link></li>
                                <li><Link href={route('legal.refund')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Refund & Cancellation Policy</Link></li>
                                <li><Link href={route('legal.privacy')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Privacy Policy</Link></li>
                                <li><Link href={route('info.faq')} className="text-slate-400 hover:text-amber-400 transition-colors">→ FAQ & Rules</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
