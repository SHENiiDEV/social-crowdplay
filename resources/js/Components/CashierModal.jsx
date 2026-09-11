import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { X, Coins, CreditCard, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CashierModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const { settings, auth } = usePage().props;
    const rate = Number(settings.exchange_rate || 10);
    const promo = Number(settings.promo_multiplier || 1.0);
    const effectiveRate = rate * promo;

    const [selectedPackage, setSelectedPackage] = useState(10);
    const [customEur, setCustomEur] = useState('10');
    const [customSc, setCustomSc] = useState((10 * effectiveRate).toString());
    const [paymentMethod, setPaymentMethod] = useState('visa_mastercard');
    const [loading, setLoading] = useState(false);

    const packages = [
        { eur: 1, coins: 1 * effectiveRate, popular: false },
        { eur: 5, coins: 5 * effectiveRate, popular: false },
        { eur: 10, coins: 10 * effectiveRate, popular: true },
        { eur: 50, coins: 50 * effectiveRate, popular: false },
    ];

    const handleEurChange = (val) => {
        setCustomEur(val);
        setSelectedPackage(null);
        const eurNum = Number(val) || 0;
        setCustomSc(Math.round(eurNum * effectiveRate).toString());
    };

    const handleScChange = (val) => {
        setCustomSc(val);
        setSelectedPackage(null);
        const scNum = Number(val) || 0;
        setCustomEur((scNum / effectiveRate).toFixed(2));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        const currentEur = Number(customEur) || 0;
        const currentSc = Number(customSc) || 0;
        if (currentEur < 1 && currentSc < 1) return alert('Minimum deposit is $1.00 USD / 1 SC');

        setLoading(true);
        try {
            const response = await fetch(route('cashier.checkout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    amount_eur: currentEur,
                    amount_sc: currentSc,
                    payment_method: paymentMethod,
                })
            });
            const data = await response.json();
            setLoading(false);

            if (data.status === 'success' && data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                alert(data.message || 'Error creating checkout');
            }
        } catch (err) {
            setLoading(false);
            alert('Payment checkout error. Please check your network connection.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-amber-950/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Social Coin Store</h3>
                            <p className="text-xs text-slate-400">Rate: 1 EUR = <span className="text-amber-400 font-bold">{effectiveRate} SC</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout} className="p-6 space-y-6">
                    {/* Preset Packages */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Coin Package</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {packages.map((pkg) => (
                                <button
                                    key={pkg.eur}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPackage(pkg.eur);
                                        setCustomEur(pkg.eur.toString());
                                    }}
                                    className={`p-4 rounded-2xl border text-center transition-all relative ${
                                        selectedPackage === pkg.eur
                                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-105'
                                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    {pkg.popular && (
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    <div className="font-black text-lg">{pkg.eur} EUR</div>
                                    <div className="text-xs text-amber-400 font-bold flex items-center justify-center gap-1 mt-1">
                                        <Coins className="w-3.5 h-3.5" />
                                        <span>{pkg.coins} SC</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom EUR / SC Input Calculator */}
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>Custom SC Deposit Calculator</span>
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5" /> Instant Delivery
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="50000"
                                    value={customEur}
                                    onChange={(e) => handleEurChange(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                                    placeholder="USD Amount"
                                />
                                <span className="text-[10px] text-slate-500 font-semibold absolute right-3 top-1/2 -translate-y-1/2">USD</span>
                            </div>

                            <ArrowRight className="w-5 h-5 text-slate-600 hidden sm:block" />

                            <div className="relative flex-1 w-full">
                                <Coins className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="number"
                                    min="1"
                                    max="500000"
                                    value={customSc}
                                    onChange={(e) => handleScChange(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                                    placeholder="SC Amount"
                                />
                                <span className="text-[10px] text-amber-400 font-black absolute right-3 top-1/2 -translate-y-1/2">SC</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector (Visa / Mastercard) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accepted Cards</label>
                        <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-cyan-400" />
                                <div>
                                    <span className="text-xs font-bold text-white block">Credit & Debit Cards</span>
                                    <span className="text-[11px] text-slate-400">Visa & Mastercard Authorized</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-xs text-blue-400">VISA</span>
                                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-xs text-amber-500">Mastercard</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || currentEur < 1}
                        className="w-full btn-gold py-4 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl shadow-amber-500/20 disabled:opacity-50"
                    >
                        <CreditCard className="w-5 h-5" />
                        <span>{loading ? 'Processing...' : `Pay $${currentEur} with Visa/Mastercard (${calculatedCoins} SC)`}</span>
                    </button>

                    <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Secure 256-bit Encrypted Card Checkout</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
