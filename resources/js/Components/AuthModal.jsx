import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    X, Mail, Lock, User, Gift, LogIn, UserPlus, KeyRound, CheckCircle2, 
    ArrowLeft, Phone, Calendar, MapPin, Building, Globe, Hash as HashIcon, ShieldCheck
} from 'lucide-react';
import { ALLOWED_COUNTRIES } from '../constants/countries';

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
        surname: '',
        email: '',
        password: '',
        phone: '',
        date_of_birth: '',
        street_address: '',
        city: '',
        country: 'United States',
        postal_code: '',
        terms: false,
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
        if (authMode === 'register') return 'Create Player Account';
        return 'Reset Password';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className={`bg-slate-900 border border-slate-800 rounded-3xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] ${
                authMode === 'register' ? 'max-w-2xl' : 'max-w-md'
            }`}>
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 sticky top-0 z-10">
                    <div className="flex items-center gap-2.5">
                        {getHeaderIcon()}
                        <div>
                            <h3 className="text-lg font-black text-white leading-tight">
                                {getHeaderTitle()}
                            </h3>
                            {authMode === 'register' && (
                                <p className="text-xs text-slate-400 mt-0.5">Please provide your legal details for identity and payment verification</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all ml-3 shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar">
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
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            {/* Section 1: Personal Details */}
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                                    <User className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">1. Personal Information</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">First Name *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={registerForm.data.name}
                                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="Alex"
                                            />
                                        </div>
                                        {registerForm.errors.name && <p className="text-xs text-red-400 mt-1">{registerForm.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Surname / Last Name *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={registerForm.data.surname}
                                                onChange={(e) => registerForm.setData('surname', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="Smith"
                                            />
                                        </div>
                                        {registerForm.errors.surname && <p className="text-xs text-red-400 mt-1">{registerForm.errors.surname}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="email"
                                                required
                                                value={registerForm.data.email}
                                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="player@example.com"
                                            />
                                        </div>
                                        {registerForm.errors.email && <p className="text-xs text-red-400 mt-1">{registerForm.errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Password *</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="password"
                                                required
                                                value={registerForm.data.password}
                                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {registerForm.errors.password && <p className="text-xs text-red-400 mt-1">{registerForm.errors.password}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="tel"
                                                required
                                                value={registerForm.data.phone}
                                                onChange={(e) => registerForm.setData('phone', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        {registerForm.errors.phone && <p className="text-xs text-red-400 mt-1">{registerForm.errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Date of Birth *</label>
                                        <div className="relative">
                                            <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="date"
                                                required
                                                value={registerForm.data.date_of_birth}
                                                onChange={(e) => registerForm.setData('date_of_birth', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 [color-scheme:dark]"
                                            />
                                        </div>
                                        {registerForm.errors.date_of_birth && <p className="text-xs text-red-400 mt-1">{registerForm.errors.date_of_birth}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Residential Address */}
                            <div className="space-y-3.5 pt-2">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                                    <MapPin className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">2. Residential Address</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Street, House Number, Apartment... *</label>
                                    <div className="relative">
                                        <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            value={registerForm.data.street_address}
                                            onChange={(e) => registerForm.setData('street_address', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                            placeholder="124 Grand Avenue, Apt 4B"
                                        />
                                    </div>
                                    {registerForm.errors.street_address && <p className="text-xs text-red-400 mt-1">{registerForm.errors.street_address}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">City *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={registerForm.data.city}
                                                onChange={(e) => registerForm.setData('city', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="New York"
                                            />
                                        </div>
                                        {registerForm.errors.city && <p className="text-xs text-red-400 mt-1">{registerForm.errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Post Code / Zip *</label>
                                        <div className="relative">
                                            <HashIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                required
                                                value={registerForm.data.postal_code}
                                                onChange={(e) => registerForm.setData('postal_code', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                placeholder="10001"
                                            />
                                        </div>
                                        {registerForm.errors.postal_code && <p className="text-xs text-red-400 mt-1">{registerForm.errors.postal_code}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Country *</label>
                                    <div className="relative">
                                        <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <select
                                            required
                                            value={registerForm.data.country}
                                            onChange={(e) => registerForm.setData('country', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                                        >
                                            {ALLOWED_COUNTRIES.map((c) => (
                                                <option key={c} value={c} className="bg-slate-900 text-white">
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {registerForm.errors.country && <p className="text-xs text-red-400 mt-1">{registerForm.errors.country}</p>}
                                </div>
                            </div>

                            {/* Section 3: Referral Code (Optional) */}
                            <div className="pt-1">
                                <label className="block text-xs font-bold text-slate-400 mb-1">Referral Code (Optional)</label>
                                <div className="relative">
                                    <Gift className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={registerForm.data.ref}
                                        onChange={(e) => registerForm.setData('ref', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                                        placeholder="ALEX2026"
                                    />
                                </div>
                            </div>

                            {/* Section 4: Terms & Conditions Checkbox */}
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={registerForm.data.terms}
                                        onChange={(e) => registerForm.setData('terms', e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-300 leading-relaxed">
                                        I confirm that I am at least 18 years old and I agree to the{' '}
                                        <a
                                            href="/legal/terms"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-400 font-bold hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Terms &amp; Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            href="/legal/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-400 font-bold hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Privacy Policy
                                        </a>.
                                    </span>
                                </label>
                                {registerForm.errors.terms && (
                                    <p className="text-xs text-red-400 mt-1 pl-7">{registerForm.errors.terms}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                            >
                                {registerForm.processing ? 'Creating Player Account...' : 'Complete Registration'}
                            </button>

                            <div className="text-center pt-1 text-xs text-slate-400">
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
