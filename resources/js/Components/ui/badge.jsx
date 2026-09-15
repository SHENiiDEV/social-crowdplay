import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] transition-all backdrop-blur-md',
    {
        variants: {
            variant: {
                gold: 'bg-gold-400/10 text-gold-200 border border-gold-400/28',
                solid: 'bg-gradient-to-b from-gold-200 to-gold-500 text-obsidian-950 border border-gold-100/60 shadow-[0_8px_20px_-10px_rgba(201,159,63,0.8)]',
                cyan: 'bg-white/[0.05] text-pearl-400 border border-white/10',
                purple: 'bg-white/[0.05] text-pearl-400 border border-white/10',
                emerald: 'bg-jade-400/10 text-jade-400 border border-jade-400/25',
                danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/25',
                muted: 'bg-black/45 text-slate-300 border border-white/10',
            },
        },
        defaultVariants: { variant: 'gold' },
    }
);

export function Badge({ className, variant, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant, className }))} {...props}>
            {children}
        </span>
    );
}
