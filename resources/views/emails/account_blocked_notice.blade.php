<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OFFICIAL NOTICE</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #0f172a;
            color: #f1f5f9;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1e293b;
            border-radius: 12px;
            border: 1px solid #334155;
            padding: 32px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .header {
            border-bottom: 2px solid #ef4444;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .badge {
            display: inline-block;
            background: rgba(239, 68, 68, 0.2);
            color: #f87171;
            font-weight: 800;
            letter-spacing: 0.1em;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            text-transform: uppercase;
            border: 1px solid rgba(239, 68, 68, 0.4);
            margin-bottom: 12px;
        }
        .title {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
            letter-spacing: 0.05em;
        }
        .content {
            font-size: 15px;
            line-height: 1.6;
            color: #cbd5e1;
        }
        .case-box {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 24px 0;
        }
        .case-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .case-row:last-child {
            margin-bottom: 0;
        }
        .case-label {
            color: #94a3b8;
            font-weight: 600;
        }
        .case-value {
            color: #f8fafc;
            font-weight: 700;
            font-family: monospace;
        }
        .status-blocked {
            color: #ef4444;
            font-weight: 800;
        }
        .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #334155;
            font-size: 12px;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">Security & Compliance Department</div>
            <h1 class="title">OFFICIAL NOTICE</h1>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $user->name }}</strong>,</p>

            <p>Your account has been blocked due to suspicious activity identified during a security review, which may indicate fraudulent activity.</p>

            <div class="case-box">
                <div class="case-row">
                    <span class="case-label">Case No.:</span>
                    <span class="case-value">{{ $caseNumber }}</span>
                </div>
                <div class="case-row">
                    <span class="case-label">Status:</span>
                    <span class="case-value status-blocked">Blocked</span>
                </div>
                <div class="case-row">
                    <span class="case-label">Name:</span>
                    <span class="case-value">{{ $user->name }}</span>
                </div>
                <div class="case-row">
                    <span class="case-label">Account Email:</span>
                    <span class="case-value">{{ $user->email }}</span>
                </div>
                <div class="case-row">
                    <span class="case-label">User Code:</span>
                    <span class="case-value">{{ $user->user_code ?: 'user_' . $user->id }}</span>
                </div>
            </div>

            <p>All relevant information regarding this incident may be forwarded to the appropriate authorities for further review and any action deemed necessary under applicable law.</p>

            <p>Please retain all correspondence and documents related to this matter. You may be contacted by the relevant authorities if additional information is required.</p>
        </div>

        <div class="footer">
            Crowdplay Security & Risk Management &bull; Case ID: {{ $caseNumber }}<br>
            Official notice dispatched to compliance: renat@crowdplay.io
        </div>
    </div>
</body>
</html>
