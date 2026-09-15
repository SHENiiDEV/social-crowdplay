RESET YOUR CROWDPLAY PASSWORD
==============================

Hello, {{ $user->name }}!

We received a request to reset the password for your CrowdPlay Casino account.

To reset your password, visit the following link:
{{ $resetUrl }}

This password reset link is valid for {{ $expiresInMinutes }} minutes.

If you did not request a password reset, no further action is required and your account remains secure.

---
{{ config('company.name') }} (Reg No: {{ config('company.number') }})
{{ config('company.address') }}
Support: {{ config('company.email') }}
