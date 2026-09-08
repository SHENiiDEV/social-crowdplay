import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Mail, Lock, User, Gift, LogIn, UserPlus, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
    if (!isOpen) return null;

    const [authMode, setAuthMode] = useState(mode);
    const [forgotSuccess, setForgotSuccess] = useState(false);

    useEffect(() => {
        setAuthMode(mode);
        setForgotSuccess(false);
    }, [mode, isOpen]);

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

    const forgotForm = useForm({
        email: '',
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

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        forgotForm.post(route('password.email'), {
            onSuccess: () => {
                setForgotSuccess(true);
            },
        });
    };

    const getHeaderIcon = () => {
        if (authMode === 'login') return <LogIn className="w-5 h-5 text-purple-400" />;
        if (authMode === 'register') return <UserPlus className="w-5 h-5 text-amber-400" />;
        return <KeyRound className="w-5 h-5 text-purple-400" />;
    };

    const getHeaderTitle = () => {
        if (authMode === 'login') return 'Welcome Back';
        if (authMode === 'register') return 'Create Social Casino Account';
        return 'Reset Password';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getHeaderIcon()}
                        <h3 className="text-lg font-black text-white">
                            {getHeaderTitle()}
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
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-400">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotSuccess(false);
                                            setAuthMode('forgot');
                                        }}
                                        className="text-xs text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
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
                    ) : authMode === 'register' ? (
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

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {registerForm.processing ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <div className="text-center pt-2 text-xs text-slate-400">
                                Already have an account?{' '}
                                <button type="button" onClick={() => setAuthMode('login')} className="text-amber-400 font-bold hover:underline">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Enter the email address associated with your account and we'll send you a secure link to reset your password.
                            </p>

                            {forgotSuccess ? (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div className="text-xs text-emerald-300 leading-relaxed">
                                        <p className="font-bold text-emerald-200 mb-0.5">Reset link sent!</p>
                                        Please check your email inbox (and spam folder) for instructions to reset your password.
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            required
                                            value={forgotForm.data.email}
                                            onChange={(e) => forgotForm.setData('email', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                            placeholder="player@example.com"
                                        />
                                    </div>
                                    {forgotForm.errors.email && <p className="text-xs text-red-400 mt-1">{forgotForm.errors.email}</p>}
                                </div>
                            )}

                            {!forgotSuccess && (
                                <button
                                    type="submit"
                                    disabled={forgotForm.processing}
                                    className="w-full btn-purple py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {forgotForm.processing ? 'Sending Reset Link...' : 'Send Reset Link'}
                                </button>
                            )}

                            <div className="text-center pt-2 text-xs text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => setAuthMode('login')}
                                    className="inline-flex items-center gap-1.5 text-purple-400 font-bold hover:underline"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
