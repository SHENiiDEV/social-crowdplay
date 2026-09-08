import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CreditCard, CheckCircle, XCircle, Shield, Coins, ArrowLeft } from 'lucide-react';

export default function Payment({ deposit }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(deposit.status);

    const triggerPaymentWebhook = async (paymentStatus) => {
        setLoading(true);
        try {
            const res = await fetch('/api/webhooks/stripe-mock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: deposit.order_id,
                    status: paymentStatus,
                    provider_tx_id: 'STRIPE-SIM-' + Date.now(),
                })
            });
            const data = await res.json();
            setLoading(false);

            if (data.status === 'success' || data.status === 'already_processed') {
                setStatus('success');
            } else if (data.status === 'declined') {
                setStatus('declined');
            }
        } catch (e) {
            setLoading(false);
            alert('Webhook Error: ' + e.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
            <Head title="Stripe Payment Simulator - Social Casino" />

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-black text-white">Payment Checkout Gateway</h2>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full">
                        Sandbox Simulator
                    </span>
                </div>

                {/* Order Details */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Order Reference</span>
                        <span className="font-mono font-bold text-white">{deposit.order_id}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Amount Paid (USD)</span>
                        <span className="font-bold text-white">${deposit.amount_eur}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Social Coins to Credit</span>
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            {deposit.coins_received} SC
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Payment Method</span>
                        <span className="font-semibold text-purple-300 uppercase">{deposit.payment_method}</span>
                    </div>
                </div>

                {/* Status Indicator */}
                {status === 'success' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h3 className="text-lg font-black text-emerald-300">Payment Successful!</h3>
                        <p className="text-xs text-slate-400">Your balance has been atomically credited with {deposit.coins_received} Social Coins.</p>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-xl text-xs font-bold shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Social Casino</span>
                        </Link>
                    </div>
                ) : status === 'declined' ? (
                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center space-y-3">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <h3 className="text-lg font-black text-red-300">Payment Declined</h3>
                        <p className="text-xs text-slate-400">The simulated card authorization was declined.</p>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-xs font-bold text-slate-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Store</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-400 text-center">Click a button below to simulate payment processor response:</p>

                        <button
                            onClick={() => triggerPaymentWebhook('success')}
                            disabled={loading}
                            className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>{loading ? 'Processing...' : 'Simulate Payment Success (Success Webhook)'}</span>
                        </button>

                        <button
                            onClick={() => triggerPaymentWebhook('declined')}
                            disabled={loading}
                            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <XCircle className="w-4 h-4" />
                            <span>Simulate Payment Error / Decline</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
