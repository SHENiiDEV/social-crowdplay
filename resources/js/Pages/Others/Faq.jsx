import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Faq() {
    const { company } = usePage().props;
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "What is Social Coins (SC) and how does it work?",
            a: "Social Coins (SC) are the virtual entertainment currency used on Crowdplay Social Casino. Coins have no cash value and cannot be withdrawn or converted to real money."
        },
        {
            q: "How do I get free Social Coins?",
            a: "New players receive 100 free Social Coins upon account registration. You can also earn 50 bonus coins for every friend invited through your referral link."
        },
        {
            q: "How does the Cashier and EUR exchange work?",
            a: "You can top up your coin balance by purchasing Social Coin packages (e.g. 1 EUR = 10 SC) via Credit Card, Stripe, or Crypto."
        },
        {
            q: "Is GammaPlus Social Casino certified?",
            a: "Yes! All games are provided by GammaPlus API and operate with certified Random Number Generator (RNG) logic."
        },
        {
            q: "Who operates the platform?",
            a: `Crowdplay is operated by ${company?.name}, registered under Reg No ${company?.reg_number} with licensed address at ${company?.address}.`
        }
    ];

    return (
        <MainLayout>
            <Head title={`FAQ & Rules - ${company?.name}`} />

            <div className="max-w-4xl mx-auto space-y-8 py-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-2">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-amber-400" />
                        <div>
                            <h1 className="text-2xl font-black text-white">Frequently Asked Questions</h1>
                            <p className="text-xs text-slate-400">Everything you need to know about Social Coins and gameplay</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full p-6 text-left font-extrabold text-sm text-white flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                            >
                                <span>{item.q}</span>
                                {openIndex === idx ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>

                            {openIndex === idx && (
                                <div className="p-6 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
