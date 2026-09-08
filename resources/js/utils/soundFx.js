// Web Audio API Sound Generator for Social Casino
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Sound 1: Coin Credit / Purchase Chime (Golden ding-ding-ding!)
     */
    playCoinSound() {
        if (this.isMuted) return;
        try {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const tones = [987.77, 1318.51, 1567.98, 1975.53]; // B5, E6, G6, B6

            tones.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0.3, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.35);
            });
        } catch (e) {
            console.error('Audio playCoinSound error:', e);
        }
    }

    /**
     * Sound 2: Wheel Spin Click Sound
     */
    playWheelTick() {
        if (this.isMuted) return;
        try {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    }

    /**
     * Sound 3: Jackpot Victory Fanfare (Arcade Brass + Coin Shower Cascade)
     */
    playJackpotSound() {
        if (this.isMuted) return;
        try {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const notes = [
                { f: 523.25, t: 0 },    // C5
                { f: 659.25, t: 0.12 }, // E5
                { f: 783.99, t: 0.24 }, // G5
                { f: 1046.50, t: 0.36 },// C6
                { f: 1318.51, t: 0.55 },// E6
                { f: 1567.98, t: 0.75 },// G6
                { f: 2093.00, t: 0.95 },// C7 (victory peak)
            ];

            notes.forEach(({ f, t }) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + t);

                const duration = t === 0.95 ? 1.6 : 0.25;
                gain.gain.setValueAtTime(0.4, now + t);
                gain.gain.exponentialRampToValueAtTime(0.001, now + t + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + t);
                osc.stop(now + t + duration + 0.1);
            });

            // Golden coin cascade chimes during jackpot celebration
            for (let i = 0; i < 14; i++) {
                const coinOsc = this.ctx.createOscillator();
                const coinGain = this.ctx.createGain();

                const coinFreq = 1200 + Math.random() * 900;
                const coinTime = 0.4 + i * 0.09;

                coinOsc.type = 'sine';
                coinOsc.frequency.setValueAtTime(coinFreq, now + coinTime);

                coinGain.gain.setValueAtTime(0.2, now + coinTime);
                coinGain.gain.exponentialRampToValueAtTime(0.001, now + coinTime + 0.18);

                coinOsc.connect(coinGain);
                coinGain.connect(this.ctx.destination);

                coinOsc.start(now + coinTime);
                coinOsc.stop(now + coinTime + 0.22);
            }
        } catch (e) {
            console.error('Audio playJackpotSound error:', e);
        }
    }
}

export const soundFx = new SoundEffects();
