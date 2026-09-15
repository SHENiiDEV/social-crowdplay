import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from './Logo';
import { Sparkles, ShieldCheck, Mail, Phone, MapPin, Lock, FileText, Scale, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

export default function Footer() {
    const { company } = usePage().props;

    return (
        <footer className="relative select-none overflow-hidden border-t border-white/[0.06] bg-obsidian-950/60 px-4 pb-14 pt-16 text-slate-400 sm:px-8">
            <div className="mx-auto max-w-[86rem] space-y-14">
                {/* Top Community Banner */}
                <div className="relative overflow-hidden rounded-3xl lux-gold-surface lux-topline p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-gold-400/[0.06] blur-[110px]" />

                    <div className="relative z-10 text-center md:text-left">
                        <span className="eyebrow">Crowdplay Community</span>
                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-light tracking-[-0.01em] text-white">
                            Take your seat at the <em className="not-italic text-gold">big table</em>
                        </h3>
                        <p className="mt-3 max-w-md text-[13px] font-light leading-relaxed text-slate-500">
                            3,200 authentic slots, live roulette, baccarat and crash games — all on the house.
                        </p>
                    </div>

                    <Link
                        href={route('home')}
                        className="lux-btn-gold relative z-10 w-full shrink-0 rounded-full px-9 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] sm:w-auto"
                    >
                        <span className="relative z-10">Explore Catalogue</span>
                    </Link>
                </div>

                {/* Main Legal & Links Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
                    {/* Column 1: Brand & Dynamic License */}
                    <div className="sm:col-span-2 lg:col-span-2 space-y-4">
                        <Logo />
                        <p className="max-w-sm text-[12px] font-light leading-relaxed text-slate-500">
                            {company?.name} is a premier social entertainment platform offering authentic virtual casino games played with Social Coins powered by GGR Gold API. No real money gambling is involved.
                        </p>

                        <div className="text-xs text-slate-500 space-y-1 pt-1 font-mono">
                            <p><strong className="text-slate-400 font-sans">Reg No:</strong> {company?.number || company?.reg_number}</p>
                            {company?.license && <p><strong className="text-slate-400 font-sans">License:</strong> {company?.license}</p>}
                            <p className="flex items-start gap-1.5 pt-1 text-[11px] font-sans text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-gold-400/80 shrink-0 mt-0.5" />
                                <span>{company?.address}</span>
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Quick Links & Games */}
                    <div>
                        <h4 className="mb-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            <Sparkles className="w-3.5 h-3.5 text-gold-400/80" />
                            <span>Explore</span>
                        </h4>
                        <ul className="space-y-3 text-[12px] font-light text-slate-500">
                            <li><Link href={route('home')} className="transition-colors hover:text-gold-200">Games Catalog</Link></li>
                            <li><Link href={route('home', { category: 'Recommended' })} className="transition-colors hover:text-gold-200">Top Featured Games</Link></li>
                            <li><Link href={route('home', { category: 'Baccarat' })} className="transition-colors hover:text-gold-200">Live Casino Tables</Link></li>
                            <li><Link href={route('info.categories')} className="transition-colors hover:text-gold-200">Game Categories</Link></li>
                            <li><Link href={route('info.about')} className="transition-colors hover:text-gold-200">About CROWDPLAY</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal Compliance */}
                    <div>
                        <h4 className="mb-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            <Scale className="w-3.5 h-3.5 text-gold-400/80" />
                            <span>Legal &amp; Policy</span>
                        </h4>
                        <ul className="space-y-3 text-[12px] font-light text-slate-500">
                            <li><Link href={route('legal.terms')} className="transition-colors hover:text-gold-200">Terms of Service</Link></li>
                            <li><Link href={route('legal.privacy')} className="transition-colors hover:text-gold-200">Privacy Policy</Link></li>
                            <li><Link href={route('legal.sweeps-rules')} className="transition-colors hover:text-gold-200">Sweepstakes Rules</Link></li>
                            <li><Link href={route('legal.refund')} className="transition-colors hover:text-gold-200">Refund &amp; Cancellation</Link></li>
                            <li><Link href={route('legal.aml')} className="transition-colors hover:text-gold-200">AML / CFT Policy</Link></li>
                            <li><Link href={route('legal.responsible-gaming')} className="transition-colors hover:text-gold-200">Responsible Gaming</Link></li>
                            <li><Link href={route('legal.cookie-policy')} className="transition-colors hover:text-gold-200">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Security & Support */}
                    <div>
                        <h4 className="mb-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-400/80" />
                            <span>Security &amp; Help</span>
                        </h4>
                        <ul className="space-y-3 text-[12px] font-light text-slate-500 mb-4">
                            <li><Link href={route('legal.security')} className="transition-colors hover:text-gold-200">Security &amp; PCI DSS</Link></li>
                            <li><Link href={route('legal.security')} className="transition-colors hover:text-gold-200">Certified RNG Fair Play</Link></li>
                            <li><Link href={route('info.faq')} className="transition-colors hover:text-gold-200">FAQ &amp; Game Rules</Link></li>
                            <li><Link href={route('info.contact')} className="transition-colors hover:text-gold-200">24/7 Support Center</Link></li>
                        </ul>

                        <div className="pt-3 border-t border-white/[0.06] text-xs space-y-2">
                            <a href={`mailto:${company?.email}`} className="flex items-center gap-2 text-gold-400/80 hover:underline font-bold">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{company?.email}</span>
                            </a>
                            <a href={`tel:${company?.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-white font-medium">
                                <Phone className="w-3.5 h-3.5 text-gold-400/80" />
                                <span>{company?.phone}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Payment Logos & Security Badges Bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-600">
                            Payment &amp; Security Partners:
                        </span>

                        <div className="flex items-center flex-wrap justify-center gap-3">
                            {/* VISA */}
                            <div className="h-10 px-4 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                <img src="/images/visa.png" alt="VISA" className="h-6 w-auto object-contain" />
                            </div>

                            {/* Mastercard */}
                            <div className="h-10 px-4 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                <img src="/images/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                            </div>

                            {/* PCI DSS Compliant */}
                            <div className="h-10 px-3 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                <img src="/images/pci-dss.png" alt="PCI DSS Compliant" className="h-7 w-auto object-contain" />
                            </div>

                            {/* 18+ Badge */}
                            <div className="h-10 px-3 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center text-xs font-black text-gold-400/80 shadow-md">
                                <span>18+ ONLY</span>
                            </div>

                            {/* 256-bit SSL */}
                            <div className="h-10 px-3 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400 shadow-md">
                                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                <span>256-BIT SSL</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-right text-[11px] font-light text-slate-500">
                        <p>© 2026 {company?.name}. All Rights Reserved.</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Licensed &amp; Operated under International Social Entertainment Standards.</p>
                    </div>
                </div>

                {/* Mandatory Disclaimer Note */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-500 text-center leading-relaxed">
                    <p>
                        <strong className="text-slate-400">Disclaimer:</strong> {company?.name} is a free-to-play social casino gaming platform designed solely for entertainment and amusement purposes. Players must be at least 18 years of age (or legal age of majority in your jurisdiction) to participate. No real money gambling or opportunity to win real money or physical prizes is offered. Virtual currency (Social Coins) purchased or awarded has no monetary value and cannot be redeemed for cash or refunded once used. Void where prohibited by law.
                    </p>
                </div>
            </div>
        </footer>
    );
}
