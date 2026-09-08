import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Sparkles, Trophy, Clock, Coins, Star, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { soundFx } from '../../utils/soundFx';

const SLICES = [
    { id: 0, amount: 1,  label: '1 SC',  color1: '#1e3a8a', color2: '#3b82f6', accent: '#60a5fa', text: '#ffffff', icon: '🪙' },
    { id: 1, amount: 2,  label: '2 SC',  color1: '#064e3b', color2: '#10b981', accent: '#34d399', text: '#ffffff', icon: '🪙' },
    { id: 2, amount: 3,  label: '3 SC',  color1: '#4c1d95', color2: '#8b5cf6', accent: '#a78bfa', text: '#ffffff', icon: '💎' },
    { id: 3, amount: 4,  label: '4 SC',  color1: '#78350f', color2: '#f59e0b', accent: '#fbbf24', text: '#ffffff', icon: '🪙' },
    { id: 4, amount: 5,  label: '5 SC',  color1: '#831843', color2: '#ec4899', accent: '#f472b6', text: '#ffffff', icon: '💎' },
    { id: 5, amount: 6,  label: '6 SC',  color1: '#164e63', color2: '#06b6d4', accent: '#22d3ee', text: '#ffffff', icon: '🪙' },
    { id: 6, amount: 8,  label: '8 SC',  color1: '#581c87', color2: '#a855f7', accent: '#c084fc', text: '#ffffff', icon: '💎' },
    { id: 7, amount: 10, label: '10 SC', color1: '#78350f', color2: '#fbbf24', accent: '#fde68a', text: '#0f172a', icon: '⭐' },
];


const NUM_LEDS = 24;
const SPARK_COUNT = 35;

/* ─── Sparkle Canvas Overlay ─── */
function SparkleCanvas({ active }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        if (!active) {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width = canvas.offsetWidth * 2;
        const H = canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        const sparkColors = ['#fbbf24', '#f59e0b', '#fde68a', '#ffffff', '#06b6d4', '#a855f7', '#ec4899'];

        // Initialize sparkle particles
        particlesRef.current = Array.from({ length: SPARK_COUNT }, () => ({
            x: Math.random() * (W / 2),
            y: Math.random() * (H / 2),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            r: Math.random() * 2.5 + 0.5,
            alpha: Math.random(),
            color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            life: Math.random() * 100,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W / 2, H / 2);
            particlesRef.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life += 1;
                p.alpha = 0.3 + Math.sin(p.life * 0.08) * 0.7;

                if (p.x < 0 || p.x > W / 2) p.vx *= -1;
                if (p.y < 0 || p.y > H / 2) { p.y = H / 2; p.vy = -(Math.random() * 2 + 1); }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Star sparkle effect
                if (p.r > 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.r * 2, p.y);
                    ctx.lineTo(p.x + p.r * 2, p.y);
                    ctx.moveTo(p.x, p.y - p.r * 2);
                    ctx.lineTo(p.x, p.y + p.r * 2);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = p.alpha * 0.4;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
            animRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-40"
            style={{ opacity: active ? 1 : 0, transition: 'opacity 0.5s' }}
        />
    );
}

/* ─── Animated LED Ring ─── */
function LedRing({ spinning }) {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, spinning ? 60 : 400);
        return () => clearInterval(interval);
    }, [spinning]);

    return (
        <div className="absolute inset-[-8px] rounded-full pointer-events-none">
            {[...Array(NUM_LEDS)].map((_, i) => {
                const angle = (360 / NUM_LEDS) * i;
                const rad = angle * (Math.PI / 180);
                const radius = 50;
                const x = 50 + radius * Math.cos(rad);
                const y = 50 + radius * Math.sin(rad);

                // Sequential chase pattern
                const phase = spinning
                    ? (tick * 3 + i) % NUM_LEDS
                    : (tick + i) % NUM_LEDS;
                const isLit = spinning
                    ? phase < 8
                    : phase < 4 || (phase > NUM_LEDS / 2 && phase < NUM_LEDS / 2 + 4);

                const colors = ['#fbbf24', '#ef4444', '#06b6d4', '#10b981', '#a855f7', '#ec4899'];
                const color = isLit ? colors[i % colors.length] : '#334155';

                return (
                    <div
                        key={i}
                        className="absolute rounded-full transition-all duration-100"
                        style={{
                            width: '10px',
                            height: '10px',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: color,
                            boxShadow: isLit ? `0 0 8px 3px ${color}80, 0 0 16px 4px ${color}40` : 'none',
                            opacity: isLit ? 1 : 0.3,
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ─── Floating Coin Particles (Win celebration) ─── */
function FloatingCoins({ show }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${20 + Math.random() * 60}%`,
                        y: '110%',
                        opacity: 0,
                        scale: 0.5,
                        rotate: Math.random() * 360,
                    }}
                    animate={{
                        y: '-10%',
                        opacity: [0, 1, 1, 0],
                        scale: [0.5, 1.2, 1, 0.8],
                        rotate: Math.random() * 720,
                    }}
                    transition={{
                        duration: 2.5 + Math.random(),
                        delay: i * 0.12,
                        ease: 'easeOut',
                    }}
                    className="absolute text-2xl"
                >
                    {i % 3 === 0 ? '🪙' : i % 3 === 1 ? '💰' : '✨'}
                </motion.div>
            ))}
        </div>
    );
}

/* ─── Main Wheel Modal ─── */
export function DailyWheelModal({ isOpen, onClose, onBalanceUpdate }) {
    const [canSpin, setCanSpin] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winReward, setWinReward] = useState(null);
    const [winAmount, setWinAmount] = useState(0);
    const [cooldownText, setCooldownText] = useState('');
    const [showCoins, setShowCoins] = useState(false);
    const [displayedWin, setDisplayedWin] = useState(0);
    const tickIntervalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setWinReward(null);
            setShowCoins(false);
            setDisplayedWin(0);
            fetch('/api/wheel/status')
                .then(res => res.json())
                .then(data => {
                    setCanSpin(data.can_spin);
                    if (!data.can_spin && data.cooldown_seconds) {
                        startCooldownTimer(data.cooldown_seconds);
                    }
                })
                .catch(() => {});
        }
        return () => {
            if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
        };
    }, [isOpen]);

    const startCooldownTimer = (seconds) => {
        let remaining = seconds;
        const format = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            return `${h}h ${m}m ${sec}s`;
        };
        setCooldownText(format(remaining));
        const timer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(timer);
                setCanSpin(true);
                setCooldownText('');
            } else {
                setCooldownText(format(remaining));
            }
        }, 1000);
    };

    // Animated counting effect for win display
    const animateWinCount = useCallback((target) => {
        let current = 0;
        const steps = 20;
        const increment = target / steps;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            setDisplayedWin(Math.round(current));
        }, 50);
    }, []);

    const fireConfettiBurst = () => {
        const defaults = { startVelocity: 30, ticks: 80, zIndex: 9999 };

        // Center burst
        confetti({
            ...defaults,
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.45 },
            colors: ['#fbbf24', '#f59e0b', '#fde68a', '#ef4444', '#06b6d4'],
        });

        // Side bursts with delay
        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: ['#a855f7', '#ec4899', '#fbbf24'],
            });
            confetti({
                ...defaults,
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#10b981', '#06b6d4', '#fbbf24'],
            });
        }, 300);

        // Gold star burst
        setTimeout(() => {
            confetti({
                particleCount: 30,
                spread: 360,
                startVelocity: 15,
                ticks: 100,
                zIndex: 9999,
                origin: { x: 0.5, y: 0.4 },
                shapes: ['star'],
                colors: ['#fbbf24', '#fde68a', '#f59e0b'],
            });
        }, 600);
    };

    const handleSpin = async () => {
        if (!canSpin || isSpinning) return;
        setIsSpinning(true);
        setWinReward(null);
        setShowCoins(false);
        setDisplayedWin(0);

        try {
            const response = await fetch('/api/wheel/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();

            if (data.status === 'success') {
                const targetSliceIndex = data.winning_slice;
                const sliceAngle = 360 / SLICES.length;
                // More rotations for dramatic effect
                const totalRotations = 360 * 8;
                const targetAngle = totalRotations + (360 - targetSliceIndex * sliceAngle - sliceAngle / 2);

                // Progressive tick sound — starts fast, slows down
                let tickCount = 0;
                const maxTicks = 40;
                const playTick = () => {
                    if (tickCount >= maxTicks) return;
                    soundFx.playWheelTick();
                    tickCount++;
                    // Exponential slowdown
                    const delay = 80 + tickCount * tickCount * 1.8;
                    tickIntervalRef.current = setTimeout(playTick, delay);
                };
                playTick();

                setRotation(prev => prev + targetAngle);

                // Reveal win after spin completes
                setTimeout(() => {
                    if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);

                    // Jackpot sound for 10 SC, coin sound for others
                    if (data.reward_amount >= 8) {
                        soundFx.playJackpotSound();
                    } else {
                        soundFx.playCoinSound();
                    }

                    fireConfettiBurst();
                    setShowCoins(true);
                    setWinReward(data.reward_label);
                    setWinAmount(data.reward_amount);
                    animateWinCount(data.reward_amount);
                    setCanSpin(false);
                    setIsSpinning(false);

                    if (onBalanceUpdate) {
                        onBalanceUpdate(data.new_balance);
                    }
                }, 5500);
            } else {
                alert(data.message || 'Spin unavailable');
                setIsSpinning(false);
            }
        } catch (e) {
            setIsSpinning(false);
        }
    };

    if (!isOpen) return null;

    // SVG Arc Path Generator
    const getSlicePath = (index, total, radius = 145) => {
        const angle = 360 / total;
        const startAngle = (index * angle - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180);

        const x1 = 150 + radius * Math.cos(startAngle);
        const y1 = 150 + radius * Math.sin(startAngle);
        const x2 = 150 + radius * Math.cos(endAngle);
        const y2 = 150 + radius * Math.sin(endAngle);

        return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    const getSliceTextPos = (index, total, textRadius = 95) => {
        const angle = 360 / total;
        const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);

        const x = 150 + textRadius * Math.cos(midAngle);
        const y = 150 + textRadius * Math.sin(midAngle);
        const rotationDeg = index * angle + angle / 2;

        return { x, y, rotationDeg };
    };

    const getIconPos = (index, total) => {
        const angle = 360 / total;
        const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
        const iconRadius = 120;

        return {
            x: 150 + iconRadius * Math.cos(midAngle),
            y: 150 + iconRadius * Math.sin(midAngle),
            rotationDeg: index * angle + angle / 2,
        };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop with animated gradient */}
                <motion.div
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={!isSpinning ? onClose : undefined}
                />

                {/* Animated background rays */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent, rgba(251,191,36,0.03), transparent, rgba(6,182,212,0.03), transparent, rgba(168,85,247,0.03), transparent, rgba(236,72,153,0.03), transparent)',
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 40 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 16 }}
                    className="relative w-full max-w-md bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-900/95 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_100px_rgba(251,191,36,0.15),0_0_40px_rgba(6,182,212,0.1)] text-center overflow-hidden"
                >
                    {/* Ambient glow orbs */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

                    {/* Sparkle overlay during spin */}
                    <SparkleCanvas active={isSpinning} />

                    {/* Floating coins on win */}
                    <FloatingCoins show={showCoins} />

                    {/* Close button */}
                    <button
                        onClick={!isSpinning ? onClose : undefined}
                        disabled={isSpinning}
                        className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-all z-50 backdrop-blur-sm disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative z-10 space-y-1.5 mb-4"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Gift className="w-5 h-5 text-amber-400" />
                            </motion.div>
                            <Badge variant="gold" className="px-3 py-1 text-[10px] shadow-lg shadow-amber-500/20">
                                <Sparkles className="w-3 h-3" />
                                <span>DAILY REWARD</span>
                            </Badge>
                            <motion.div
                                animate={{ rotate: [0, -15, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Gift className="w-5 h-5 text-amber-400" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent tracking-tight">
                            WHEEL OF FORTUNE
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Spin daily for free Euro bonuses! 🎰
                        </p>

                    </motion.div>

                    {/* Wheel Stage */}
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center mb-4">
                        {/* LED ring */}
                        <LedRing spinning={isSpinning} />

                        {/* Outer metallic ring */}
                        <div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: 'conic-gradient(from 0deg, #78350f, #fbbf24, #78350f, #fde68a, #78350f, #fbbf24, #78350f, #fde68a, #78350f)',
                                padding: '4px',
                                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
                                mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
                            }}
                        />

                        {/* Pointer / Needle */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                            <motion.div
                                animate={isSpinning ? { y: [0, -3, 0] } : {}}
                                transition={{ duration: 0.15, repeat: Infinity }}
                            >
                                <svg width="32" height="40" viewBox="0 0 32 40">
                                    <defs>
                                        <linearGradient id="needle-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#fde68a" />
                                            <stop offset="50%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#78350f" />
                                        </linearGradient>
                                        <filter id="needle-shadow">
                                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
                                        </filter>
                                    </defs>
                                    <path
                                        d="M16 38 L4 8 Q4 2 16 2 Q28 2 28 8 Z"
                                        fill="url(#needle-grad)"
                                        stroke="#fde68a"
                                        strokeWidth="1"
                                        filter="url(#needle-shadow)"
                                    />
                                    <circle cx="16" cy="8" r="4" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Spinning Wheel */}
                        <motion.div
                            animate={{ rotate: rotation }}
                            transition={{
                                duration: 5.5,
                                ease: [0.15, 0.85, 0.12, 1.0],
                            }}
                            className="w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full overflow-hidden relative flex items-center justify-center"
                            style={{
                                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.15)',
                            }}
                        >
                            <svg viewBox="0 0 300 300" className="w-full h-full">
                                <defs>
                                    {SLICES.map((slice) => (
                                        <linearGradient key={`grad-${slice.id}`} id={`slice-grad-${slice.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={slice.color2} />
                                            <stop offset="60%" stopColor={slice.color1} />
                                        </linearGradient>
                                    ))}
                                    {/* Inner glow filter */}
                                    <filter id="inner-glow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    {/* Center hub gradient */}
                                    <radialGradient id="hub-grad" cx="50%" cy="35%" r="50%">
                                        <stop offset="0%" stopColor="#fef9c3" />
                                        <stop offset="40%" stopColor="#fbbf24" />
                                        <stop offset="80%" stopColor="#b45309" />
                                        <stop offset="100%" stopColor="#78350f" />
                                    </radialGradient>
                                    <radialGradient id="hub-inner-grad" cx="50%" cy="40%" r="50%">
                                        <stop offset="0%" stopColor="#fef08a" />
                                        <stop offset="100%" stopColor="#eab308" />
                                    </radialGradient>
                                </defs>

                                {/* Wheel slices */}
                                {SLICES.map((slice, index) => {
                                    const path = getSlicePath(index, SLICES.length);
                                    const { x, y, rotationDeg } = getSliceTextPos(index, SLICES.length);
                                    const iconPos = getIconPos(index, SLICES.length);

                                    return (
                                        <g key={slice.id}>
                                            {/* Slice fill */}
                                            <path
                                                d={path}
                                                fill={`url(#slice-grad-${slice.id})`}
                                                stroke="rgba(0,0,0,0.4)"
                                                strokeWidth="1.5"
                                            />
                                            {/* Accent inner border line */}
                                            <path
                                                d={getSlicePath(index, SLICES.length, 142)}
                                                fill="none"
                                                stroke={slice.accent}
                                                strokeWidth="0.5"
                                                opacity="0.3"
                                            />
                                            {/* Icon */}
                                            <text
                                                x={iconPos.x}
                                                y={iconPos.y}
                                                fontSize="14"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                transform={`rotate(${iconPos.rotationDeg}, ${iconPos.x}, ${iconPos.y})`}
                                            >
                                                {slice.icon}
                                            </text>
                                            {/* Label */}
                                            <text
                                                x={x}
                                                y={y}
                                                fill={slice.text}
                                                fontSize="14"
                                                fontWeight="900"
                                                fontFamily="'Inter', system-ui, sans-serif"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                transform={`rotate(${rotationDeg}, ${x}, ${y})`}
                                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                                            >
                                                {slice.label}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Inner shadow ring for 3D depth */}
                                <circle
                                    cx="150" cy="150" r="144"
                                    fill="none"
                                    stroke="rgba(0,0,0,0.3)"
                                    strokeWidth="4"
                                />

                                {/* Golden center hub - outer ring */}
                                <circle cx="150" cy="150" r="30" fill="url(#hub-grad)" stroke="#78350f" strokeWidth="2" />
                                {/* Golden center hub - inner circle */}
                                <circle cx="150" cy="150" r="22" fill="url(#hub-inner-grad)" stroke="#b45309" strokeWidth="1" />
                                {/* Highlight dot */}
                                <circle cx="145" cy="143" r="6" fill="rgba(255,255,255,0.25)" />
                            </svg>

                            {/* 3D Center Hub overlay with Trophy icon */}
                            <div className="absolute w-14 h-14 rounded-full flex items-center justify-center z-20">
                                <motion.div
                                    animate={isSpinning ? { rotate: [0, 360] } : { scale: [1, 1.05, 1] }}
                                    transition={isSpinning
                                        ? { duration: 2, repeat: Infinity, ease: 'linear' }
                                        : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                    }
                                >
                                    <Trophy className="w-6 h-6 text-amber-900 drop-shadow-sm" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Win Victory Banner */}
                    <AnimatePresence>
                        {winReward && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
                                className="relative mb-3"
                            >
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 border border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-400" />
                                            <span className="text-xs font-bold text-amber-400/80 uppercase tracking-wider">Congratulations!</span>
                                            <Star className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-6 h-6 text-amber-300 animate-bounce" />
                                            <span className="text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                                                +{displayedWin} SC
                                            </span>

                                            <Coins className="w-6 h-6 text-amber-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            Added to your balance!
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Spin Button or Cooldown */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        {canSpin ? (
                            <button
                                disabled={isSpinning}
                                onClick={handleSpin}
                                className="group relative w-full py-3.5 rounded-2xl font-black text-base tracking-wide text-slate-950 overflow-hidden transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: isSpinning
                                        ? 'linear-gradient(135deg, #78350f, #92400e)'
                                        : 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
                                    boxShadow: isSpinning
                                        ? '0 4px 20px rgba(120,53,15,0.4)'
                                        : '0 4px 30px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)',
                                }}
                            >
                                {/* Shimmer sweep animation */}
                                {!isSpinning && (
                                    <motion.div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)',
                                        }}
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSpinning ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </motion.div>
                                            SPINNING...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            SPIN THE WHEEL
                                            <Sparkles className="w-5 h-5" />
                                        </>
                                    )}
                                </span>
                            </button>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                    <Clock className="w-4 h-4 text-amber-500/70" />
                                    <span className="text-xs font-bold">
                                        {winReward
                                            ? `Come back tomorrow! ${cooldownText}`
                                            : `Next spin in ${cooldownText}`
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Footer note */}
                    <p className="text-[10px] text-slate-600 mt-2 relative z-10">
                        Free daily spin • No purchase required • Rewards credited instantly
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
