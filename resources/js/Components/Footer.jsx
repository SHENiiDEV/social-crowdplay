import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from './Logo';
import { Sparkles, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';

export default function Footer() {
    const { company } = usePage().props;

    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 px-8 text-slate-400 relative overflow-hidden select-none">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Top Community Banner */}
                <div className="relative p-8 rounded-3xl border border-amber-500/20 bg-slate-900/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-2 text-center md:text-left relative z-10">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-extrabold tracking-wider text-xs uppercase">CROWDPLAY COMMUNITY</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">Join the Ultimate Social Casino Crowd!</h3>
                        <p className="text-sm text-slate-400">Discover over 3,200+ authentic slots, live roulette, baccarat, and aviator crash games.</p>
                    </div>

                    <Link
                        href={route('home')}
                        className="relative z-10 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
                    >
                        Explore Catalog
                    </Link>
                </div>

                {/* Main Legal & Links Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                    {/* Brand & Dynamic License */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {company?.name} is a social entertainment platform offering virtual casino games played with Social Coins powered by GGR Gold API. No real money gambling is involved.
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

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-xs font-semibold">
                            <li><Link href={route('home')} className="hover:text-amber-400 transition-colors">Games Catalog</Link></li>
                            <li><Link href={route('info.about')} className="hover:text-amber-400 transition-colors">About CROWDPLAY</Link></li>
                            <li><Link href={route('home', { category: 'Recommended' })} className="hover:text-amber-400 transition-colors">Top Featured Games</Link></li>
                            <li><Link href={route('info.categories')} className="hover:text-amber-400 transition-colors">All Game Categories</Link></li>
                        </ul>
                    </div>

                    {/* Legal Pages */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4">Legal Compliance</h4>
                        <ul className="space-y-2.5 text-xs font-semibold">
                            <li><Link href={route('legal.terms')} className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href={route('legal.privacy')} className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href={route('legal.aml')} className="hover:text-amber-400 transition-colors">AML / CFT Compliance</Link></li>
                            <li><Link href={route('legal.responsible-gaming')} className="hover:text-amber-400 transition-colors">Responsible Gaming</Link></li>
                        </ul>
                    </div>

                    {/* Support & Contacts */}
                    <div>
                        <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-4">Support & Contact</h4>
                        <ul className="space-y-2.5 text-xs font-semibold mb-4">
                            <li><Link href={route('info.contact')} className="hover:text-amber-400 transition-colors">Contact Support</Link></li>
                            <li><Link href={route('info.faq')} className="hover:text-amber-400 transition-colors">FAQ & Rules</Link></li>
                        </ul>

                        <div className="pt-4 border-t border-slate-900 text-xs space-y-2">
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

                {/* Payment Logos Footer */}
                <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="font-extrabold text-slate-400 text-xs">Accepted Payment Methods:</span>
                        <div className="flex items-center gap-3">
                            <div className="h-10 px-3.5 py-1.5 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                                <img src="/images/visa.png" alt="VISA" className="h-full w-auto object-contain" />
                            </div>

                            <div className="h-10 px-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-md">
                                <svg className="h-5 w-auto" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="42" cy="35" r="25" fill="#EB001B" />
                                    <circle cx="78" cy="35" r="25" fill="#F79E1B" />
                                    <path d="M60 18.67A24.93 24.93 0 0 0 50.8 35A24.93 24.93 0 0 0 60 51.33A24.93 24.93 0 0 0 69.2 35A24.93 24.93 0 0 0 60 18.67Z" fill="#FF5F00" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="font-semibold">© 2026 {company?.name}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
