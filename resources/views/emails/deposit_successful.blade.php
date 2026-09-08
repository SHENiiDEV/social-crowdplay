<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit Confirmed - CrowdPlay</title>
    <style>
        body { margin: 0; padding: 0; background-color: #070a13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #070a13; padding: 30px 0; }
        .main { background: #0f172a; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #064e3b 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(16, 185, 129, 0.3); }
        .badge { display: inline-block; padding: 5px 14px; border-radius: 50px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
        .content { padding: 36px 30px; }
        .amount-card { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 20px 0 24px 0; }
        .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); }
        .footer { background-color: #070b19; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" align="center">
            <!-- Header -->
            <tr>
                <td class="header">
                    <div class="badge">✓ Payment Confirmed</div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">CROWDPLAY CASINO</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Receipt &amp; Balance Update</p>
                </td>
            </tr>

            <!-- Content -->
            <tr>
                <td class="content">
                    <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">Hello, {{ $user->name }}! ⚡</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
                        Your payment has been processed successfully. Your CrowdPlay balance has been updated and is ready to play!
                    </p>

                    <!-- Amount Box -->
                    <div class="amount-card">
                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px;">Coins Credited</div>
                        <div style="font-size: 32px; font-weight: 900; color: #34d399; letter-spacing: -0.5px;">
                            +{{ number_format((float)$deposit->coins_received, 2) }} SC
                        </div>
                        <div style="margin-top: 8px; font-size: 13px; color: #cbd5e1;">
                            Amount Paid: <strong>${{ number_format((float)($deposit->amount_eur ?? $deposit->amount ?? 0), 2) }} USD</strong>
                        </div>
                    </div>

                    <!-- Receipt Details Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 26px; background: #0b1021; border-radius: 12px; border: 1px solid #1e293b;">
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Transaction ID / Order:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #f8fafc; font-family: monospace; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">{{ $deposit->order_id }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Payment Method:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #f8fafc; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">{{ ucfirst($deposit->payment_method ?? 'Card / Crypto') }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Status:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #34d399; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">COMPLETED</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Date &amp; Time:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #1e293b; text-align: right;">{{ $deposit->created_at ? $deposit->created_at->format('Y-m-d H:i:s T') : now()->format('Y-m-d H:i:s T') }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">Updated Balance:</td>
                            <td style="padding: 12px 16px; font-size: 13px; color: #fbbf24; font-weight: 900; text-align: right;">{{ number_format((float)$newBalance, 2) }} SC</td>
                        </tr>
                    </table>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0 10px 0;">
                        <a href="{{ config('app.url') }}" class="cta-button">
                            🎰 Jump Back into Action
                        </a>
                    </div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p style="margin: 0 0 6px 0;">CrowdPlay Casino &bull; Social Gaming Entertainment</p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
                        If you have any questions regarding this order, please contact our 24/7 support.
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
