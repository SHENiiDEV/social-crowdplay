<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CrowdPlay</title>
    <style>
        body { margin: 0; padding: 0; background-color: #070a13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #070a13; padding: 30px 0; }
        .main { background: #0f172a; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #0b1120 0%, #1e1b4b 50%, #0b1120 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(245, 158, 11, 0.2); }
        .badge { display: inline-block; padding: 5px 14px; border-radius: 50px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
        .content { padding: 36px 30px; }
        .feature-box { background: #070b19; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin: 24px 0; }
        .feature-item { margin-bottom: 14px; }
        .feature-item:last-child { margin-bottom: 0; }
        .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); color: #020617 !important; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4); }
        .footer { background-color: #070b19; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" align="center">
            <!-- Header -->
            <tr>
                <td class="header">
                    <div class="badge">✨ Welcome to the Crowd</div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">CROWDPLAY CASINO</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Next-Gen Social Gaming Experience</p>
                </td>
            </tr>

            <!-- Content -->
            <tr>
                <td class="content">
                    <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">Hello, {{ $user->name }}! 👋</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
                        Welcome to <strong>CrowdPlay</strong>! Your social gaming account has been successfully created and is ready to play.
                    </p>

                    <!-- Highlights Box -->
                    <div class="feature-box">
                        <div class="feature-item">
                            <strong style="color: #38bdf8; font-size: 13px;">🎁 Daily Free Bonus:</strong>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Claim your free daily 1.00 SC every 24 hours directly from the lobby banner or store.</p>
                        </div>
                        <div class="feature-item" style="border-top: 1px solid #1e293b; padding-top: 12px;">
                            <strong style="color: #fbbf24; font-size: 13px;">🎰 150+ Verified Slots & Live Games:</strong>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Play Pragmatic Play, PG Soft, Hacksaw Gaming, Spribe Mini Games, and Evolution Live casino tables.</p>
                        </div>
                        <div class="feature-item" style="border-top: 1px solid #1e293b; padding-top: 12px;">
                            <strong style="color: #a855f7; font-size: 13px;">🎡 Daily Lucky Wheel:</strong>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Spin the Wheel of Fortune daily for a chance to win up to 10 SC extra prizes.</p>
                        </div>
                    </div>

                    <!-- Account Info -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 26px; background: #0b1021; border-radius: 12px; border: 1px solid #1e293b;">
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Account Name:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #f8fafc; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">{{ $user->name }} {{ $user->surname ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Email Address:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #f8fafc; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">{{ $user->email }}</td>
                        </tr>
                        @if(!empty($user->country))
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b; border-bottom: 1px solid #1e293b;">Country:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #f8fafc; font-weight: bold; border-bottom: 1px solid #1e293b; text-align: right;">{{ $user->country }}</td>
                        </tr>
                        @endif
                        <tr>
                            <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">Referral Code:</td>
                            <td style="padding: 12px 16px; font-size: 12px; color: #c084fc; font-family: monospace; font-weight: bold; text-align: right;">{{ $user->referral_code ?? 'N/A' }}</td>
                        </tr>
                    </table>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0 10px 0;">
                        <a href="{{ config('app.url') }}" class="cta-button">
                            🚀 Start Playing Now
                        </a>
                    </div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p style="margin: 0 0 6px 0;">CrowdPlay Casino &bull; Social Gaming Entertainment</p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
                        If you did not register for this account, please ignore this email or contact support.
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
