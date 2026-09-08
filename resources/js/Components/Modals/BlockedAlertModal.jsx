import React from 'react';
import { ShieldAlert, Copy, X, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlockedAlertModal({ isOpen, onClose, noticeData }) {
    if (!isOpen) return null;

    const caseNo = noticeData?.case_number || 'CASE-2026-0849-8F92D1';
    const userName = noticeData?.name || 'First Name Last Name';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 25 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 25 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.35)] text-slate-100 overflow-hidden"
                >
                    {/* Glowing Danger Ambient Backdrop */}
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-500/20 blur-3xl pointer-events-none rounded-full" />

                    {/* Top Security Header */}
                    <div className="flex items-center justify-between border-b border-red-500/30 pb-4 mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20 shrink-0">
                                <ShieldAlert className="w-7 h-7 animate-pulse text-red-400" />
                            </div>
                            <div>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30">
                                    Security & Compliance Department
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white flex items-center gap-2 mt-0.5">
                                    OFFICIAL NOTICE
                                </h2>
                            </div>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Notice Text Content */}
                    <div className="space-y-4 text-sm leading-relaxed text-slate-300 relative z-10">
                        <p className="font-semibold text-slate-100">
                            Dear <span className="text-amber-300 font-bold">{userName}</span>,
                        </p>

                        <p className="text-slate-300">
                            Your account has been blocked due to suspicious activity identified during a security review, which may indicate fraudulent activity.
                        </p>

                        {/* Official Case Box */}
                        <div className="bg-slate-950/90 border border-red-500/40 rounded-2xl p-4 sm:p-5 my-4 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-slate-400 font-semibold">Case No.:</span>
                                <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                                    {caseNo}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-slate-400 font-semibold">Status:</span>
                                <span className="font-black text-red-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                                    Blocked
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-slate-400 font-semibold">Name:</span>
                                <span className="font-bold text-white">{userName}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            All relevant information regarding this incident may be forwarded to the appropriate authorities for further review and any action deemed necessary under applicable law.
                        </p>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            Please retain all correspondence and documents related to this matter. You may be contacted by the relevant authorities if additional information is required.
                        </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 relative z-10">
                        <span>Compliance: <strong className="text-slate-400">renat@crowdplay.io</strong></span>
                        <button
                            onClick={() => {
                                navigator.clipboard?.writeText(caseNo);
                                alert('Case number copied to clipboard: ' + caseNo);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 underline"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            Copy Case Number
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
