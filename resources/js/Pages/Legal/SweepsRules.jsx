import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Trophy, Gift, Sparkles, CheckCircle2, ShieldAlert, FileCheck, Mail, ArrowRight, HelpCircle } from 'lucide-react';

export default function SweepsRules() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Official Sweepstakes Rules - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>NO PURCHASE NECESSARY TO PLAY OR WIN</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Official Sweepstakes & Free Entry Rules</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            These Official Sweepstakes Rules govern the free participation, coin distribution, and promotional prize mechanisms operated by {company?.name}.
                        </p>
                    </div>
                </div>

                {/* Core Sweepstakes Rule Notice */}
                <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
                        <Gift className="w-5 h-5 shrink-0" />
                        <span>Core Sweepstakes Principle: No Purchase Required</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white">NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN.</strong> A purchase does not increase your chances of winning. Sweepstakes entries (Social Coins / SC) are freely available via standard daily login bonuses, the Daily Fortune Wheel, referral rewards, and written mail-in request.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-amber-400" />
                                <span>1. Sponsor & Administrator</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>
                                    The sweepstakes promotions on this website are operated and sponsored by <strong>{company?.name}</strong>, Reg No: {company?.reg_number}, Address: {company?.address}.
                                </p>
                                <p className="text-slate-400">
                                    Promotions are open exclusively to legal residents where social sweepstakes gameplay is legally permitted, aged 18 years or older.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                <span>2. Methods of Obtaining Free Social Coins (SC)</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    Eligible participants can collect free Social Coins through multiple daily free entry avenues:
                                </p>
                                <ul className="space-y-2 pl-4 list-disc text-slate-400">
                                    <li><strong className="text-slate-200">Welcome Bonus:</strong> Free complimentary Social Coins awarded immediately upon verifying a new player account.</li>
                                    <li><strong className="text-slate-200">Daily Login Reward:</strong> Claim 1.00 SC for free once every 24 hours via the Store / Daily Bonus widget without making any purchase.</li>
                                    <li><strong className="text-slate-200">Daily Wheel of Fortune:</strong> Spin the lucky wheel every 24 hours to win between 1.00 SC and 10.00 SC completely free.</li>
                                    <li><strong className="text-slate-200">Referral Program:</strong> Earn +100 Social Coins when an invited friend registers and activates their account.</li>
                                    <li><strong className="text-slate-200">Alternative Method of Entry (AMOE / Mail-in):</strong> Send a handwritten standard index card with your account details to our corporate address to receive complimentary promotional coins.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-emerald-400" />
                                <span>3. Game Fairness & Certified RNG</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    All spin outcomes, card distributions, and jackpot awards are determined by cryptographically secure, internationally tested <strong>Random Number Generators (RNG)</strong> delivered through the GGR Gold API network.
                                </p>
                                <p>
                                    Neither player balance, purchase history, nor VIP level influence the algorithmic mathematical odds of any slot or casino game.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-400" />
                                <span>4. Void Where Prohibited & Jurisdiction</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    These promotions are void wherever prohibited or restricted by applicable national or state law. It is the responsibility of each player to ensure their participation complies with their local legislation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                <Gift className="w-4 h-4 text-amber-400" />
                                <span>Free Daily 1.00 SC</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Don't forget to collect your daily free reward every 24 hours directly from the lobby or store!
                            </p>
                            <Link
                                href={route('home')}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                            >
                                <span>Play Free Games Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Related Legal Documents</h3>
                            <ul className="space-y-2 text-xs">
                                <li><Link href={route('legal.terms')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Terms of Service</Link></li>
                                <li><Link href={route('legal.refund')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Refund & Cancellation Policy</Link></li>
                                <li><Link href={route('legal.responsible-gaming')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Responsible Gaming</Link></li>
                                <li><Link href={route('legal.privacy')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
