import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Dices, CheckCircle, XCircle } from 'lucide-react';

export default function Games({ games }) {
    return (
        <MainLayout>
            <Head title="Games Management - Admin Panel" />

            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-3">
                        <Dices className="w-6 h-6 text-amber-400" />
                        <div>
                            <h1 className="text-xl font-black text-white">Games Catalog Management</h1>
                            <p className="text-xs text-slate-400">Toggle game visibility, view categories, and sorting</p>
                        </div>
                    </div>
                    <Link href={route('admin.dashboard')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((g) => (
                        <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <img src={g.cover_image} alt={g.title} className="w-16 h-16 rounded-2xl object-cover bg-slate-950" />
                                <div>
                                    <h4 className="font-extrabold text-white text-base">{g.title}</h4>
                                    <span className="text-xs font-bold text-purple-400 uppercase">{g.category}</span>
                                    <p className="text-[11px] text-slate-500">ID: {g.provider_game_id}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <span className={`text-xs font-bold ${g.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {g.is_active ? 'Active' : 'Disabled'}
                                </span>

                                <Link
                                    href={route('admin.games.toggle', { game: g.id })}
                                    method="post"
                                    as="button"
                                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                        g.is_active
                                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                    }`}
                                >
                                    {g.is_active ? 'Disable Game' : 'Enable Game'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
