import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Cookie, ShieldCheck, CheckCircle2, Lock, Sliders, ArrowRight, Info } from 'lucide-react';

export default function CookiePolicy() {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title={`Cookie Policy - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                            <Cookie className="w-3.5 h-3.5 text-amber-400" />
                            <span>Privacy & Browser Storage</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Cookie & Web Storage Policy</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                            How {company?.name} uses cookies, local storage, and related technologies to deliver secure gameplay and improve your user experience.
                        </p>
                    </div>
                </div>

                {/* Notice */}
                <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm uppercase">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>What Are Cookies?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Cookies and browser local storage are small text files and cryptographic tokens stored on your device that enable our platform to recognize your session, remember your login state, maintain your favorite games, and securely communicate with game provider servers.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-emerald-400" />
                                <span>1. Strictly Necessary Cookies</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>
                                    These cookies are essential for the operation of {company?.name}. Without them, critical services such as authentication, anti-CSRF token verification, and session management cannot function.
                                </p>
                                <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                                    <li><strong className="text-slate-200">XSRF-TOKEN:</strong> Prevents Cross-Site Request Forgery attacks.</li>
                                    <li><strong className="text-slate-200">crowdplay_session:</strong> Encrypted identifier for your active logged-in session.</li>
                                    <li><strong className="text-slate-200">Wallet Sync State:</strong> Keeps your real-time virtual SC balance synced during slot gameplay.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-amber-400" />
                                <span>2. Performance & Preference Cookies</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                                <p>
                                    These cookies allow us to remember the choices you make (such as audio preferences, sound effects on/off, and your pinned favorite games list) to provide a smoother personalized experience.
                                </p>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                                <span>3. Managing Your Cookie Preferences</span>
                            </h2>
                            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                <p>
                                    Most modern web browsers allow you to manage or block cookies through their settings. Please note that disabling essential cookies may impact your ability to log in or launch games.
                                </p>
                                <p className="text-slate-400">
                                    For detailed instructions on managing cookies in Chrome, Safari, Firefox, or Edge, consult your browser's official support documentation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Privacy Resources</h3>
                            <ul className="space-y-2 text-xs">
                                <li><Link href={route('legal.privacy')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Full Privacy Policy</Link></li>
                                <li><Link href={route('legal.terms')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Terms of Service</Link></li>
                                <li><Link href={route('legal.security')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Security & Encryption</Link></li>
                                <li><Link href={route('info.contact')} className="text-slate-400 hover:text-amber-400 transition-colors">→ Contact Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
