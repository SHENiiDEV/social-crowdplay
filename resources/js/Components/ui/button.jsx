import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]',
    {
        variants: {
            variant: {
                gold: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 border border-amber-300/40',
                cyan: 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-300/30',
                glass: 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white border border-slate-700/60 backdrop-blur-xl shadow-md hover:border-slate-600',
                outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
                ghost: 'bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white',
                danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/20',
            },
            size: {
                sm: 'h-9 px-3.5 text-xs rounded-lg',
                md: 'h-11 px-5 text-sm rounded-xl',
                lg: 'h-13 px-7 text-base rounded-2xl',
                icon: 'h-10 w-10 p-0 rounded-xl',
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
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </button>
    );
}
