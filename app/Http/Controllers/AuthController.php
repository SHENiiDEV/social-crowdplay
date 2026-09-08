<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Mail\WelcomeRegistrationMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::defaults()],
            'ref' => ['nullable', 'string'],
        ]);

        $referrer = null;
        if (!empty($validated['ref'])) {
            $referrer = User::where('referral_code', $validated['ref'])->first();
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'game_balance' => 0.00,
            'referred_by' => $referrer ? $referrer->id : null,
        ]);

        try {
            Mail::to($user->email)->send(new WelcomeRegistrationMail($user));
        } catch (\Throwable $e) {
            Log::error('Failed to send welcome registration email: ' . $e->getMessage());
        }

        Auth::login($user);

        return redirect()->back()->with('success', 'Account created successfully!');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials['email'] = strtolower(trim($credentials['email']));

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            if (Auth::user()->status === 'blocked' || Auth::user()->is_blocked) {
                $blockedUser = Auth::user();
                $caseNumber = 'CASE-' . date('Y') . '-' . str_pad((string)$blockedUser->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(substr(md5((string)$blockedUser->id), 0, 6));
                Auth::logout();
                return redirect()->back()
                    ->with('error', 'OFFICIAL NOTICE: Your account has been blocked due to suspicious activity identified during a security review.')
                    ->with('blocked_notice', [
                        'name' => $blockedUser->name,
                        'email' => $blockedUser->email,
                        'case_number' => $caseNumber,
                    ]);
            }

            return redirect()->back()->with('success', 'Welcome back!');
        }

        return redirect()->back()->with('error', 'The provided credentials do not match our records.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Logged out successfully.');
    }

    /**
     * Send password reset link to user's email
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower(trim($request->email));
        $user = User::where('email', $email)->first();

        if ($user && $user->status !== 'blocked') {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => hash('sha256', $token),
                    'created_at' => now(),
                ]
            );

            $resetUrl = route('password.reset', [
                'token' => $token,
                'email' => $user->email,
            ]);

            try {
                Mail::to($user->email)->send(new ResetPasswordMail($user, $resetUrl, 60));
            } catch (\Throwable $e) {
                Log::error('Failed to send password reset email: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'If an account exists for ' . $email . ', a password reset link has been sent to your inbox.');
    }

    /**
     * Display the password reset view
     */
    public function showResetForm(Request $request, string $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Handle the password reset submission
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $email = strtolower(trim($request->email));
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record || hash('sha256', $request->token) !== $record->token) {
            return redirect()->back()->withErrors([
                'email' => 'This password reset link is invalid.',
            ]);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return redirect()->back()->withErrors([
                'email' => 'This password reset link has expired. Please request a new one.',
            ]);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return redirect()->back()->withErrors([
                'email' => 'User not found.',
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        Auth::login($user);

        return redirect('/')->with('success', 'Your password has been successfully reset! You are now logged in.');
    }
}
