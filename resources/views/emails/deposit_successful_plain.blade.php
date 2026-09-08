PAYMENT CONFIRMED - CROWDPLAY CASINO
====================================

Hello, {{ $user->name }}!

Your payment has been processed successfully and your CrowdPlay coins balance has been updated!

RECEIPT DETAILS:
- Coins Credited: +{{ number_format((float)$deposit->coins_received, 2) }} SC
- Amount Paid: ${{ number_format((float)($deposit->amount_eur ?? $deposit->amount ?? 0), 2) }} USD
- Order ID: {{ $deposit->order_id }}
- Payment Method: {{ ucfirst($deposit->payment_method ?? 'Card / Crypto') }}
- Status: COMPLETED
- Date: {{ $deposit->created_at ? $deposit->created_at->format('Y-m-d H:i:s T') : now()->format('Y-m-d H:i:s T') }}
- Updated Balance: {{ number_format((float)$newBalance, 2) }} SC

Jump back into the games: {{ config('app.url') }}

---
CrowdPlay Casino • Social Gaming Entertainment
If you have any questions regarding this order, please contact support.
