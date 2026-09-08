import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock } from 'lucide-react';

export default function Contact() {
    const { company } = usePage().props;
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <MainLayout>
            <Head title={`Contact Us - ${company?.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 py-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-2">
                    <h1 className="text-3xl font-black text-white">Contact Support</h1>
                    <p className="text-xs text-slate-400">Have questions about your account, coins, or games? Get in touch with our team.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Company Info Box */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                        <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-3">Corporate Contacts</h3>

                        <div className="space-y-5 text-xs text-slate-300">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white block">Headquarters Address</span>
                                    <span className="text-slate-400">{company?.address}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white block">Support Email</span>
                                    <a href={`mailto:${company?.email}`} className="text-cyan-400 font-semibold hover:underline">
                                        {company?.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white block">Phone Line</span>
                                    <a href={`tel:${company?.phone}`} className="text-slate-300 font-semibold hover:text-white">
                                        {company?.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white block">Working Hours</span>
                                    <span className="text-slate-400">24/7 Live Support Response</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                            <p><strong className="text-white">Company:</strong> {company?.name}</p>
                            <p><strong className="text-white">Reg Number:</strong> {company?.reg_number}</p>
                            <p><strong className="text-white">License:</strong> {company?.license}</p>
                        </div>
                    </div>

                    {/* Interactive Contact Form */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                        <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-3">Send a Message</h3>

                        {submitted ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-3">
                                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                                <h4 className="text-lg font-black text-emerald-300">Message Received!</h4>
                                <p className="text-xs text-slate-400">Thank you for reaching out. Our support agent will respond to your email within 1 hour.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Alex Player"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="player@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Account inquiry / Deposit issue"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Message</label>
                                    <textarea
                                        rows="5"
                                        required
                                        placeholder="Describe your inquiry here..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-crowdplay py-3.5 px-8 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Submit Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
