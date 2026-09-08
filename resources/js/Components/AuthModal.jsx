import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Mail, Lock, User, Gift, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
    if (!isOpen) return null;

    const [authMode, setAuthMode] = useState(mode);

    useEffect(() => {
        setAuthMode(mode);
    }, [mode]);

    // Read ref query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || '';

    const loginForm = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        ref: refCode,
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => onClose(),
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {authMode === 'login' ? <LogIn className="w-5 h-5 text-purple-400" /> : <UserPlus className="w-5 h-5 text-amber-400" />}
                        <h3 className="text-lg font-black text-white">
                            {authMode === 'login' ? 'Welcome Back' : 'Create Social Casino Account'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    {authMode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={loginForm.data.email}
                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                        placeholder="player@example.com"
                                    />
                                </div>
                                {loginForm.errors.email && <p className="text-xs text-red-400 mt-1">{loginForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        required
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className="w-full btn-purple py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loginForm.processing ? 'Signing In...' : 'Sign In'}
                            </button>

                            <div className="text-center pt-2 text-xs text-slate-400">
                                Don't have an account?{' '}
                                <button type="button" onClick={() => setAuthMode('register')} className="text-purple-400 font-bold hover:underline">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                        placeholder="Alex Player"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                        placeholder="player@example.com"
                                    />
                                </div>
                                {registerForm.errors.email && <p className="text-xs text-red-400 mt-1">{registerForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        required
                                        value={registerForm.data.password}
                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Referral Code (Optional)</label>
                                <div className="relative">
                                    <Gift className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={registerForm.data.ref}
                                        onChange={(e) => registerForm.setData('ref', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                                        placeholder="ALEX2026"
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-[11px] text-amber-300">
                                🎁 Instant Bonus: Get 100 free Social Coins upon registration!
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {registerForm.processing ? 'Creating Account...' : 'Claim 100 Coins & Sign Up'}
                            </button>

                            <div className="text-center pt-2 text-xs text-slate-400">
                                Already have an account?{' '}
                                <button type="button" onClick={() => setAuthMode('login')} className="text-amber-400 font-bold hover:underline">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
