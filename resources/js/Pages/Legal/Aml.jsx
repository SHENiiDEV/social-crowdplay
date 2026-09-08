import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldAlert, CheckCircle2, Lock, Eye, AlertTriangle, Building2 } from 'lucide-react';

export default function Aml() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`AML & Anti-Fraud Policy - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Financial Compliance & Anti-Fraud</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">AML & Anti-Fraud Policy</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            How {company?.name} prevents credit card abuse, account takeovers, and fraudulent activity across our Social Casino.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-xs text-slate-300 leading-relaxed">
                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-amber-400" />
                            <span>1. Social Casino Security Monitoring</span>
                        </h2>
                        <p>
                            Although {company?.name} is a <strong>Social Casino platform operating with virtual Social Coins (SC)</strong> and does not offer real money payouts, we strictly monitor all payment transactions for fraudulent activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                            <h3 className="font-extrabold text-white text-sm text-amber-400">Payment Verification</h3>
                            <p className="text-slate-400">
                                Automated checks monitor for stolen credit cards, chargeback abuse, or unauthorized payment method usage during Store coin purchases.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                            <h3 className="font-extrabold text-white text-sm text-cyan-400">Account Security</h3>
                            <p className="text-slate-400">
                                Multi-factor session checks prevent automated bot creation, referral abuse, and unauthorized access to player coin balances.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6 space-y-2">
                        <h2 className="text-base font-bold text-white">Compliance Inquiries & Escalation</h2>
                        <p className="text-slate-400">
                            Our Anti-Money Laundering & Compliance Officer can be reached directly at <a href={`mailto:${company?.email}`} className="text-amber-400 font-bold hover:underline">{company?.email}</a>.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
