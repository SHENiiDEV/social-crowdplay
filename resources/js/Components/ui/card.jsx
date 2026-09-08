import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden transition-all duration-300 hover:border-slate-700/80',
                className
            )}
            {...props}
        >
            {/* Liquid Glass Refraction Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
    return <h3 className={cn('text-xl font-black text-white tracking-tight', className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }) {
    return <p className={cn('text-xs text-slate-400 font-medium', className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
    return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
}
