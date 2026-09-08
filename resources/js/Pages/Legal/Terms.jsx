import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Coins, Sparkles, UserCheck, RefreshCw, Scale } from 'lucide-react';

export default function Terms() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Terms of Service - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>100% Free Social Casino Platform</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Terms of Service & Social Gaming Policy</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            Please review the rules governing your use of {company?.name}. By creating an account or playing our games, you agree to these binding legal terms.
                        </p>
                    </div>
                </div>

                {/* CRITICAL SOCIAL CASINO NOTICE ALERT */}
                <div className="glass-card p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>IMPORTANT NOTICE: NO REAL MONEY GAMBLING</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {company?.name} is strictly a <strong className="text-amber-400">Social Casino for entertainment purposes only</strong>.
                        Virtual Social Coins (SC) used within the platform have <strong className="text-white">no real-world cash value</strong>, cannot be redeemed, transferred, or exchanged for real currency, goods, or prizes under any circumstances. Purchases of Social Coin packages provide access to virtual entertainment gameplay only.
                    </p>
                </div>

                {/* Main Terms Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Clauses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Coins className="w-5 h-5 text-amber-400" />
                                <span>1. Social Currency & Virtual Items</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    All games on {company?.name} utilize virtual currency known as <strong>Social Coins (SC)</strong>. Users receive free initial Social Coins upon registration, daily login bonuses, and referral rewards.
                                </p>
                                <ul className="space-y-2 pl-4 list-disc text-slate-400">
                                    <li>Social Coins are not real money and cannot be cashed out.</li>
                                    <li>Social Coins do not accrue interest and represent a limited, non-exclusive license to play games on the platform.</li>
                                    <li>{company?.name} reserves the right to manage, adjust, or reset virtual coin balances in case of system errors or breach of terms.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-cyan-400" />
                                <span>2. User Eligibility & Account Registration</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    To participate on {company?.name}, you must satisfy the following criteria:
                                </p>
                                <ul className="space-y-2 pl-4 list-disc text-slate-400">
                                    <li>Be at least 18 years of age (or the legal age in your jurisdiction).</li>
                                    <li>Maintain only one registered account per individual. Duplicate accounts will be suspended.</li>
                                    <li>Provide true, accurate registration details.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-purple-400" />
                                <span>3. Store Purchases & Payment Terms</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    Players may optionally purchase additional Social Coin packages in our Store / Cashier using accepted payment methods (Credit Cards, Stripe, Crypto).
                                </p>
                                <p className="text-slate-400">
                                    All purchases are final and non-refundable once virtual Social Coins have been credited to your account.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Scale className="w-4 h-4 text-emerald-400" />
                                <span>4. Fair Play & Prohibited Conduct</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>The following activities are strictly prohibited and will result in immediate account termination:</p>
                                <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                                    <li>Using automated bots, scripts, or exploits to gain coins unfairly.</li>
                                    <li>Engaging in harassment or abusive behavior towards support or other players.</li>
                                    <li>Attempting to sell or trade Social Coins outside the platform.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Corporate Information Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 sticky top-24">
                            <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                                <span>Corporate Details</span>
                            </h3>

                            <div className="space-y-3 text-xs text-slate-400">
                                <div>
                                    <span className="font-bold text-slate-300 block">Operating Entity:</span>
                                    <span>{company?.name}</span>
                                </div>

                                <div>
                                    <span className="font-bold text-slate-300 block">Registration Number:</span>
                                    <span className="font-mono text-cyan-400 font-bold">{company?.reg_number}</span>
                                </div>

                                <div>
                                    <span className="font-bold text-slate-300 block">License Reference:</span>
                                    <span className="font-mono text-amber-400 font-bold">{company?.license}</span>
                                </div>

                                <div>
                                    <span className="font-bold text-slate-300 block">Registered Address:</span>
                                    <span>{company?.address}</span>
                                </div>

                                <div>
                                    <span className="font-bold text-slate-300 block">Customer Inquiries:</span>
                                    <a href={`mailto:${company?.email}`} className="text-cyan-400 font-semibold hover:underline">
                                        {company?.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
