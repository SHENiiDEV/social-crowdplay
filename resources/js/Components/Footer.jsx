import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from './Logo';
import { Sparkles, ShieldCheck, Mail, Phone, MapPin, Lock, FileText, Scale, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

export default function Footer() {
    const { company } = usePage().props;

    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-12 sm:pt-16 pb-12 px-4 sm:px-8 text-slate-400 relative overflow-hidden select-none">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Top Community Banner */}
                <div className="relative p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-slate-900/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-2 text-center md:text-left relative z-10">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-extrabold tracking-wider text-xs uppercase">CROWDPLAY COMMUNITY</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">Join the Ultimate Social Casino Crowd!</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Discover over 3,200+ authentic slots, live roulette, baccarat, and aviator crash games.</p>
                    </div>

                    <Link
                        href={route('home')}
                        className="relative z-10 w-full sm:w-auto text-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all shrink-0"
                    >
                        Explore Catalog
                    </Link>
                </div>

                {/* Main Legal & Links Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
                    {/* Column 1: Brand & Dynamic License */}
                    <div className="sm:col-span-2 lg:col-span-2 space-y-4">
                        <Logo />
                        <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
                            {company?.name} is a premier social entertainment platform offering authentic virtual casino games played with Social Coins powered by GGR Gold API. No real money gambling is involved.
                        </p>

                        <div className="text-xs text-slate-500 space-y-1 pt-1 font-mono">
                            <p><strong className="text-slate-400 font-sans">Reg No:</strong> {company?.reg_number}</p>
                            <p><strong className="text-slate-400 font-sans">License:</strong> {company?.license}</p>
                            <p className="flex items-start gap-1.5 pt-1 text-[11px] font-sans text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>{company?.address}</span>
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Quick Links & Games */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Explore</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-semibold">
                            <li><Link href={route('home')} className="hover:text-amber-400 transition-colors">Games Catalog</Link></li>
                            <li><Link href={route('home', { category: 'Recommended' })} className="hover:text-amber-400 transition-colors">Top Featured Games</Link></li>
                            <li><Link href={route('home', { category: 'Baccarat' })} className="hover:text-amber-400 transition-colors">Live Casino Tables</Link></li>
                            <li><Link href={route('info.categories')} className="hover:text-amber-400 transition-colors">Game Categories</Link></li>
                            <li><Link href={route('info.about')} className="hover:text-amber-400 transition-colors">About CROWDPLAY</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal Compliance */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-amber-400" />
                            <span>Legal &amp; Policy</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-semibold">
                            <li><Link href={route('legal.terms')} className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href={route('legal.privacy')} className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href={route('legal.sweeps-rules')} className="hover:text-amber-400 transition-colors">Sweepstakes Rules</Link></li>
                            <li><Link href={route('legal.refund')} className="hover:text-amber-400 transition-colors">Refund &amp; Cancellation</Link></li>
                            <li><Link href={route('legal.aml')} className="hover:text-amber-400 transition-colors">AML / CFT Policy</Link></li>
                            <li><Link href={route('legal.responsible-gaming')} className="hover:text-amber-400 transition-colors">Responsible Gaming</Link></li>
                            <li><Link href={route('legal.cookie-policy')} className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Security & Support */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Security &amp; Help</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs font-semibold mb-4">
                            <li><Link href={route('legal.security')} className="hover:text-amber-400 transition-colors">Security &amp; PCI DSS</Link></li>
                            <li><Link href={route('legal.security')} className="hover:text-amber-400 transition-colors">Certified RNG Fair Play</Link></li>
                            <li><Link href={route('info.faq')} className="hover:text-amber-400 transition-colors">FAQ &amp; Game Rules</Link></li>
                            <li><Link href={route('info.contact')} className="hover:text-amber-400 transition-colors">24/7 Support Center</Link></li>
                        </ul>

                        <div className="pt-3 border-t border-slate-900 text-xs space-y-2">
                            <a href={`mailto:${company?.email}`} className="flex items-center gap-2 text-amber-400 hover:underline font-bold">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{company?.email}</span>
                            </a>
                            <a href={`tel:${company?.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-white font-medium">
                                <Phone className="w-3.5 h-3.5 text-amber-400" />
                                <span>{company?.phone}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Payment Logos & Security Badges Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <span className="font-extrabold text-slate-400 text-xs uppercase tracking-wider">
                            Payment &amp; Security Partners:
                        </span>

                        <div className="flex items-center flex-wrap justify-center gap-3">
                            {/* VISA */}
                            <div className="h-10 px-4 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                                <img src="/images/visa.png" alt="VISA" className="h-6 w-auto object-contain" />
                            </div>

                            {/* Mastercard */}
                            <div className="h-10 px-4 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                                <img src="/images/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                            </div>

                            {/* PCI DSS Compliant */}
                            <div className="h-10 px-3 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                                <img src="/images/pci-dss.png" alt="PCI DSS Compliant" className="h-7 w-auto object-contain" />
                            </div>

                            {/* 18+ Badge */}
                            <div className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-amber-400 shadow-md">
                                <span>18+ ONLY</span>
                            </div>

                            {/* 256-bit SSL */}
                            <div className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400 shadow-md">
                                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                <span>256-BIT SSL</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-right font-semibold text-slate-400">
                        <p>© 2026 {company?.name}. All Rights Reserved.</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Licensed &amp; Operated under International Social Entertainment Standards.</p>
                    </div>
                </div>

                {/* Mandatory Disclaimer Note */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-900 text-[11px] text-slate-500 text-center leading-relaxed">
                    <p>
                        <strong className="text-slate-400">Disclaimer:</strong> {company?.name} is a free-to-play social casino gaming platform designed solely for entertainment and amusement purposes. Players must be at least 18 years of age (or legal age of majority in your jurisdiction) to participate. No real money gambling or opportunity to win real money or physical prizes is offered. Virtual currency (Social Coins) purchased or awarded has no monetary value and cannot be redeemed for cash or refunded once used. Void where prohibited by law.
                    </p>
                </div>
            </div>
        </footer>
    );
}
