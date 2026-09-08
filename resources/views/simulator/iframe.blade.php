<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GammaPlus Game Simulator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="p-6 flex flex-col items-center justify-center min-h-screen">

    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        <!-- Logo Header -->
        <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-400 flex items-center justify-center font-black text-slate-950">G</div>
            <h2 className="text-xl font-extrabold tracking-wide text-white">GAMMAPLUS <span className="text-amber-400">PROVIDER</span></h2>
        </div>

        <p className="text-xs text-slate-400">Seamless Wallet Interactive Game Engine</p>

        <!-- Balance Card -->
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/20">
            <span className="text-xs uppercase font-bold text-slate-500 block">Live Player Balance</span>
            <span id="player-balance" className="text-2xl font-black text-amber-400">Loading...</span>
        </div>

        <!-- Action Simulator Controls -->
        <div className="space-y-3">
            <button id="btn-bet" onclick="triggerBet()" className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-sm text-white shadow-lg transition-all">
                🎰 Place Bet (10.00 SC)
            </button>
            
            <button id="btn-win" onclick="triggerWin()" className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-sm text-slate-950 shadow-lg transition-all">
                🎉 Big Win! (+25.00 SC)
            </button>
            
            <button id="btn-rollback" onclick="triggerRollback()" className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-400 transition-all">
                ↩️ Test Transaction Rollback
            </button>
        </div>

        <div id="log-box" className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto space-y-1">
            <div>Ready to simulate Seamless Wallet calls...</div>
        </div>
    </div>

    <script>
        const token = "{{ $token }}";
        const userId = "{{ optional($session)->user_id }}";
        let lastTxId = '';

        function log(msg) {
            const box = document.getElementById('log-box');
            box.innerHTML += `<div>> ${msg}</div>`;
            box.scrollTop = box.scrollHeight;
        }

        async function fetchBalance() {
            try {
                const res = await fetch(`/api/gammaplus/authenticate?token=${token}`);
                const data = await res.json();
                if (data.status === 'success') {
                    document.getElementById('player-balance').innerText = `${data.balance.toFixed(2)} SC`;
                    log(`Authenticated player ${data.username} (Balance: ${data.balance})`);
                } else {
                    document.getElementById('player-balance').innerText = `Demo Mode`;
                    log(`Demo Mode Active`);
                }
            } catch (e) {
                log(`Auth Error: ${e.message}`);
            }
        }

        async function triggerBet() {
            if (!userId) return alert('Please login to place bets with real balance!');
            const txId = 'GP-BET-' + Date.now();
            lastTxId = txId;
            log(`Sending Bet request (-10 SC)...`);
            
            const res = await fetch('/api/gammaplus/bet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount: 10.00, provider_tx_id: txId, game_id: 'gp_baccarat_vip' })
            });
            const data = await res.json();
            if (data.status === 'success') {
                document.getElementById('player-balance').innerText = `${data.balance.toFixed(2)} SC`;
                log(`Bet OK! New Balance: ${data.balance.toFixed(2)} SC`);
            } else {
                log(`Bet Failed: ${data.message || data.error_code}`);
            }
        }

        async function triggerWin() {
            if (!userId) return alert('Please login!');
            const txId = 'GP-WIN-' + Date.now();
            log(`Sending Win request (+25 SC)...`);
            
            const res = await fetch('/api/gammaplus/win', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount: 25.00, provider_tx_id: txId, game_id: 'gp_baccarat_vip' })
            });
            const data = await res.json();
            if (data.status === 'success') {
                document.getElementById('player-balance').innerText = `${data.balance.toFixed(2)} SC`;
                log(`Win OK! New Balance: ${data.balance.toFixed(2)} SC`);
            } else {
                log(`Win Failed: ${data.message}`);
            }
        }

        async function triggerRollback() {
            if (!lastTxId) return alert('No recent bet to rollback');
            const rollbackTxId = 'GP-RB-' + Date.now();
            log(`Sending Rollback request...`);
            
            const res = await fetch('/api/gammaplus/rollback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, provider_tx_id: rollbackTxId, original_tx_id: lastTxId })
            });
            const data = await res.json();
            if (data.status === 'success') {
                document.getElementById('player-balance').innerText = `${data.balance.toFixed(2)} SC`;
                log(`Rollback OK! Restored Balance: ${data.balance.toFixed(2)} SC`);
            }
        }

        fetchBalance();
    </script>
</body>
</html>
