import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
    'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap',
    {
        variants: {
            variant: {
                gold: 'lux-btn-gold',
                cyan: 'lux-btn-gold',
                glass: 'lux-btn-ghost',
                outline: 'border border-white/12 bg-transparent text-slate-300 hover:text-gold-100 hover:border-gold-400/40 hover:bg-white/[0.04]',
                ghost: 'bg-transparent text-slate-400 hover:text-gold-200 hover:bg-white/[0.05]',
                danger: 'bg-gradient-to-b from-rose-500/90 to-rose-700 text-white border border-rose-300/30 shadow-[0_14px_34px_-16px_rgba(244,63,94,0.7)]',
            },
            size: {
                sm: 'h-9 px-4 text-[11px] uppercase tracking-[0.12em]',
                md: 'h-11 px-6 text-xs uppercase tracking-[0.12em]',
                lg: 'h-14 px-8 text-[13px] uppercase tracking-[0.16em]',
                icon: 'h-10 w-10 p-0',
            },
        },
        defaultVariants: {
            variant: 'gold',
            size: 'md',
        },
    }
);

export function Button({ className, variant, size, children, ...props }) {
    return (
        <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
            <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        </button>
    );
}
