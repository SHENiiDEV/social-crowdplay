<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'game_balance' => (float) ($user->game_balance ?? 0),
                    'referral_code' => $user->referral_code,
                    'is_admin' => (bool) ($user->is_admin ?? false),
                    'status' => $user->status ?? 'active',
                    'is_blocked' => (bool) ($user->is_blocked ?? false),
                ] : null,
            ],
            'company' => [
                'name' => env('FRONT_COMPANY_NAME', 'Crowdplay Entertainment N.V.'),
                'phone' => env('FRONT_COMPANY_PHONE', '+357 22 123 456'),
                'email' => env('FRONT_COMPANY_EMAIL', 'support@crowdplaycasino.com'),
                'address' => env('FRONT_COMPANY_ADDR', 'Heelsumstraat 51, Willemstad, Curaçao'),
                'reg_number' => env('FRONT_COMPANY_REG_NUMBER', '164829'),
                'license' => env('FRONT_COMPANY_LICENSE', 'OGL/2026/184/0129'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'blocked_notice' => fn () => $request->session()->get('blocked_notice'),
            ],
            'settings' => [
                'exchange_rate' => Setting::get('exchange_rate', 10),
                'promo_multiplier' => Setting::get('promo_multiplier', 1.0),
            ],
        ]);
    }
}
