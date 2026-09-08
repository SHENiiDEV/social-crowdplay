import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Users as UsersIcon, Ban, CheckCircle, PlusCircle, MinusCircle, Shield, ShieldAlert, Eye } from 'lucide-react';
import BlockedAlertModal from '../../Components/Modals/BlockedAlertModal';

export default function Users({ users }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [previewNoticeUser, setPreviewNoticeUser] = useState(null);
    const adjustForm = useForm({
        amount: 100,
        reason: 'Admin Bonus',
    });

    const handleAdjustSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        adjustForm.post(route('admin.users.adjust-balance', { user: selectedUser.id }), {
            onSuccess: () => {
                setSelectedUser(null);
                adjustForm.reset();
            }
        });
    };

    return (
        <MainLayout>
            <Head title="User Management - Admin Panel" />

            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-6 h-6 text-purple-400" />
                        <div>
                            <h1 className="text-xl font-black text-white">User Management</h1>
                            <p className="text-xs text-slate-400">View players, block accounts, and inspect compliance notices</p>
                        </div>
                    </div>
                    <Link href={route('admin.dashboard')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/50 text-xs uppercase font-extrabold text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Player</th>
                                    <th className="py-4 px-6">Role</th>
                                    <th className="py-4 px-6">Balance</th>
                                    <th className="py-4 px-6">Referral Code</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-white">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {u.is_admin ? (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                    ADMIN
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700">
                                                    PLAYER
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 font-mono font-bold text-amber-400">
                                            {Number(u.game_balance).toLocaleString()} SC
                                        </td>
                                        <td className="py-4 px-6 font-mono font-bold text-purple-300">{u.referral_code}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => setSelectedUser(u)}
                                                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl font-bold text-xs"
                                            >
                                                Adjust Balance
                                            </button>

                                            {u.status === 'blocked' && (
                                                <button
                                                    onClick={() => setPreviewNoticeUser(u)}
                                                    className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 rounded-xl font-bold text-xs inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Notice
                                                </button>
                                            )}

                                            <Link
                                                href={route('admin.users.toggle', { user: u.id })}
                                                method="post"
                                                as="button"
                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                                                    u.status === 'active'
                                                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                                                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                                                }`}
                                            >
                                                {u.status === 'active' ? 'Block' : 'Unblock'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Adjust Balance Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
                        <h3 className="font-extrabold text-white text-lg">Adjust Balance for {selectedUser.name}</h3>
                        <p className="text-xs text-slate-400">Current Balance: <span className="text-amber-400 font-bold">{selectedUser.game_balance} SC</span></p>

                        <form onSubmit={handleAdjustSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Amount (+ for add, - for deduct)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={adjustForm.data.amount}
                                    onChange={(e) => adjustForm.setData('amount', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Reason / Note</label>
                                <input
                                    type="text"
                                    value={adjustForm.data.reason}
                                    onChange={(e) => adjustForm.setData('reason', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adjustForm.processing}
                                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20"
                                >
                                    Confirm Adjustment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blocked Alert Preview Modal */}
            {previewNoticeUser && (
                <BlockedAlertModal
                    isOpen={!!previewNoticeUser}
                    onClose={() => setPreviewNoticeUser(null)}
                    noticeData={{
                        name: previewNoticeUser.name,
                        email: previewNoticeUser.email,
                        case_number: 'CASE-2026-' + String(previewNoticeUser.id).padStart(4, '0') + '-SEC89A',
                    }}
                />
            )}
        </MainLayout>
    );
}
