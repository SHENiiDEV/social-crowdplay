<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GGR Gold API Player - {{ $title }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #070a13; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen select-none">

    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <!-- Background Ambient Glow -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3 text-left">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-black text-slate-950 shadow-md">
                    🎰
                </div>
                <div>
                    <h2 class="text-base font-extrabold text-white">{{ $title }}</h2>
                    <p class="text-xs text-slate-400 font-mono">{{ $providerCode }} • {{ $gameCode }}</p>
                </div>
            </div>
            <div class="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider">
                GGR Seamless API
            </div>
        </div>

        <!-- Balance Card -->
        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Player Balance</span>
            <div id="player-balance" class="text-3xl font-black text-amber-400">
                {{ number_format($user ? $user->balance : 0, 2) }} SC
            </div>
        </div>

        <!-- Bet Controls -->
        <div class="space-y-3 pt-2">
            <div class="grid grid-cols-2 gap-3">
                <button onclick="triggerSpin(10, 0)" class="py-3.5 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95">
                    Spin (10 SC Bet)
                </button>

                <button onclick="triggerSpin(20, 100)" class="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95">
                    🎉 Big Win (5x)
                </button>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <button onclick="triggerSpin(50, 0)" class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                    🚀 БЕШЕНЫЙ ЗАНОС! (50 SC)
                </button>

                <button onclick="triggerSpin(100, 0)" class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-rose-500/30 transition-all active:scale-95 animate-pulse">
                    👑 MAX WIN JACKPOT! (100 SC)
                </button>
            </div>
        </div>



        <!-- Console Log Box -->
        <div class="text-left space-y-1.5">
            <span class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Live Webhook Log (/gold_api)</span>
            <div id="log-box" class="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 max-h-36 overflow-y-auto space-y-1">
                <div>> Connected to GGR Seamless Wallet endpoint. Ready to spin!</div>
            </div>
        </div>
    </div>

    <script>
        const userCode = "{{ $userCode }}";
        const providerCode = "{{ $providerCode }}";
        const gameCode = "{{ $gameCode }}";
        const agentCode = "crowdplay";
        const agentSecret = "7e49159d19c1db28e7f70966b1242606";

        function log(msg) {
            const box = document.getElementById('log-box');
            box.innerHTML += `<div>> ${msg}</div>`;
            box.scrollTop = box.scrollHeight;
        }

        async function triggerSpin(betAmount, winAmount) {
            if (!userCode) return alert('Please login to play with live balance!');
            
            const txnId = 'tx_ggr_' + Date.now();
            const roundId = Date.now().toString();

            log(`POST /gold_api (bet: ${betAmount} SC, win: ${winAmount} SC)...`);

            try {
                const response = await fetch('/gold_api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        method: 'transaction',
                        agent_code: agentCode,
                        agent_secret: agentSecret,
                        user_code: userCode,
                        game_type: 'slot',
                        slot: {
                            provider_code: providerCode,
                            game_code: gameCode,
                            type: 'BASE',
                            bet_money: betAmount,
                            win_money: winAmount,
                            round_id: roundId,
                            txn_id: txnId,
                            txn_type: 'debit_credit'
                        }
                    })
                });

                const data = await response.json();

                if (data.status === 1) {
                    document.getElementById('player-balance').innerText = `${data.user_balance.toFixed(2)} SC`;
                    log(`OK! User Balance Updated: ${data.user_balance.toFixed(2)} SC`);
                } else {

                    log(`Error: ${data.msg || 'Transaction Failed'}`);
                }
            } catch (err) {
                log(`Network Exception: ${err.message}`);
            }
        }
    </script>
</body>
</html>
