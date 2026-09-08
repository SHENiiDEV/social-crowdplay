import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <MainLayout>
            <Head title="Reset Password - CrowdPlay Casino" />

            <div className="max-w-md mx-auto py-12 px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
                            <KeyRound className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Create New Password</h1>
                        <p className="text-sm text-slate-400 mt-2">
                            Enter your new password below to secure and recover your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                    placeholder="player@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5">New Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Minimum 8 characters"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Repeat new password"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs text-red-400 mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-purple py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                        >
                            <span>{processing ? 'Resetting Password...' : 'Save New Password & Sign In'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-center pt-3 text-xs text-slate-400">
                            Remember your password?{' '}
                            <Link href="/" className="text-purple-400 font-bold hover:underline">
                                Return to Casino Lobby
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
