<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - CrowdPlay</title>
    <style>
        body { margin: 0; padding: 0; background-color: #070a13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #070a13; padding: 30px 0; }
        .main { background: #0f172a; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #311042 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(168, 85, 247, 0.25); }
        .badge { display: inline-block; padding: 5px 14px; border-radius: 50px; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #c084fc; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
        .content { padding: 36px 30px; }
        .notice-box { background: #070b19; border: 1px solid #1e293b; border-radius: 14px; padding: 18px 20px; margin: 22px 0; }
        .cta-button { display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.4); }
        .footer { background-color: #070b19; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        .url-box { word-break: break-all; font-family: monospace; font-size: 11px; color: #94a3b8; background: #0b1021; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; margin-top: 14px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" align="center">
            <!-- Header -->
            <tr>
                <td class="header">
                    <div class="badge">🔒 Security Assistance</div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">CROWDPLAY CASINO</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Password Reset Request</p>
                </td>
            </tr>

            <!-- Content -->
            <tr>
                <td class="content">
                    <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">Hello, {{ $user->name }}! 👋</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 16px;">
                        We received a request to reset the password for your CrowdPlay Casino account. Click the button below to choose a new password.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ $resetUrl }}" class="cta-button">
                            🔑 Reset Password
                        </a>
                    </div>

                    <!-- Notice Box -->
                    <div class="notice-box">
                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #fbbf24; font-weight: bold;">
                            ⏳ Expiration Notice:
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                            This password reset link will expire in <strong>{{ $expiresInMinutes }} minutes</strong>. If you did not request a password reset, no further action is required — your password will remain unchanged.
                        </p>
                    </div>

                    <!-- Fallback Link -->
                    <div style="margin-top: 24px;">
                        <p style="margin: 0; font-size: 12px; color: #64748b;">
                            If you are having trouble clicking the button, copy and paste the URL below into your web browser:
                        </p>
                        <div class="url-box">
                            {{ $resetUrl }}
                        </div>
                    </div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p style="margin: 0 0 6px 0;">CrowdPlay Casino &bull; Social Gaming Entertainment</p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
                        For security reasons, never forward this email to anyone.
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
