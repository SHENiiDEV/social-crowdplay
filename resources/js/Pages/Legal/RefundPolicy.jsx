import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldCheck, RefreshCw, CreditCard, AlertTriangle, CheckCircle2, HelpCircle, FileText, ArrowRight, Lock } from 'lucide-react';

export default function RefundPolicy() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Refund & Cancellation Policy - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                            <span>Payment & Transaction Transparency</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Refund, Cancellation & Dispute Policy</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            Standard operating policy regarding digital purchases of Social Coins (SC), payment processing via VISA, Mastercard, and cancellation requests on {company?.name}.
                        </p>
                    </div>
                </div>

                {/* Quick Policy Summary Notice */}
                <div className="p-6 rounded-3xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                    <div className="flex items-center gap-2.5 text-cyan-400 font-extrabold text-sm uppercase tracking-wider">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <span>Executive Summary: Virtual Good Purchases</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        All transactions on {company?.name} represent the acquisition of a limited, non-transferable license to access virtual gameplay tokens (<strong className="text-amber-400">Social Coins / SC</strong>) for entertainment purposes. Once virtual coins have been credited to the customer account and partially or fully utilized, all purchases are final. Please review our dispute resolution procedure below.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-amber-400" />
                                <span>1. Digital Coin Purchases & Delivery</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    Social Coin bundles purchased through our Cashier / Store are delivered <strong className="text-white">instantly</strong> upon successful authorization by the payment processor (VISA, Mastercard, or approved gateway).
                                </p>
                                <p>
                                    As digital goods delivered immediately upon checkout, customer rights to cancellation under statutory distance selling provisions expire as soon as the virtual service begins (i.e. coins are added to your balance).
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-cyan-400" />
                                <span>2. Refund Eligibility & Exceptional Circumstances</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    While standard purchases are non-refundable, {company?.name} will evaluate refund requests under the following verified conditions:
                                </p>
                                <ul className="space-y-2 pl-4 list-disc text-slate-400">
                                    <li><strong className="text-slate-200">Technical Billing Errors:</strong> Duplicate billing or accidental multiple charges caused by communication errors between payment gateways.</li>
                                    <li><strong className="text-slate-200">Non-Delivery:</strong> Instances where funds were deducted from your bank or card, but virtual coins failed to credit within 2 hours after contacting support.</li>
                                    <li><strong className="text-slate-200">Unauthorized Fraudulent Activity:</strong> Verified unauthorized card usage prior to any coin spending, subject to banking investigation and identity verification.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                <span>3. Chargebacks & Payment Inquiries</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    We encourage players to contact our 24/7 Customer Support team directly before initiating a chargeback or dispute with their financial institution.
                                </p>
                                <p>
                                    In the event of an unjustified chargeback or payment reversal on an account where coins have been wagered or consumed, {company?.name} reserves the right to suspend the associated account and blacklist payment details across our gaming network.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-purple-400" />
                                <span>4. How to Request a Refund / Dispute Resolution</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    To submit a refund inquiry, please email our billing department at <strong className="text-amber-400">{company?.email}</strong> with the following details:
                                </p>
                                <ol className="space-y-1.5 pl-4 list-decimal text-slate-400">
                                    <li>Your registered username and account email address.</li>
                                    <li>Transaction date, order ID, and transaction amount ($ / EUR).</li>
                                    <li>The last 4 digits of the payment card used.</li>
                                    <li>A brief description of the technical issue or reason for request.</li>
                                </ol>
                                <p className="pt-2 text-slate-400">
                                    Our billing team reviews all claims within <strong>24 to 48 business hours</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Trust Card */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                <Lock className="w-4 h-4 text-emerald-400" />
                                <span>PCI DSS Compliance</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                All payment transactions are processed through Level 1 PCI DSS certified gateways with 256-bit SSL encryption. We never store raw credit card numbers or CVV codes on our servers.
                            </p>
                            <div className="pt-2 border-t border-slate-800/80">
                                <Link
                                    href={route('info.contact')}
                                    className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                                >
                                    <span>Contact Billing Support</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Related Legal Links</h3>
                            <ul className="space-y-2 text-xs">
                                <li><Link href={route('legal.terms')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Terms of Service</Link></li>
                                <li><Link href={route('legal.privacy')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Privacy Policy</Link></li>
                                <li><Link href={route('legal.sweeps-rules')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Official Sweepstakes Rules</Link></li>
                                <li><Link href={route('legal.security')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Security & Fair Play</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
