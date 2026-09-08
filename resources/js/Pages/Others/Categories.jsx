import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ArrowRight, Dices } from 'lucide-react';

export default function Categories({ categories = [] }) {
    return (
        <MainLayout>
            <Head title="Game Categories - Crowdplay Social Casino" />

            <div className="max-w-5xl mx-auto space-y-8 py-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-2">
                    <h1 className="text-3xl font-black text-white">Game Categories</h1>
                    <p className="text-xs text-slate-400">Explore live table games, baccarat squeeze, roulette, and video slots.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.name} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                            <div className="space-y-2">
                                <div className="text-4xl">{cat.icon}</div>
                                <h3 className="text-xl font-black text-white">{cat.name}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-cyan-400">{cat.count} Games Available</span>
                                <Link
                                    href={route('home', { category: cat.name })}
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 transition-all"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
