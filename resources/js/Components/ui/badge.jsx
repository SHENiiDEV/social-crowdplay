import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all',
    {
        variants: {
            variant: {
                gold: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
                cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
                purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
                emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
                danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
                muted: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
            },
        },
        defaultVariants: {
            variant: 'gold',
        },
    }
);

export function Badge({ className, variant, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant, className }))} {...props}>
            {children}
        </span>
    );
}
