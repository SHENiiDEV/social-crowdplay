<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

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
}
