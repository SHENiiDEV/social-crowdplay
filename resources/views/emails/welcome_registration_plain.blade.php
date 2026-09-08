WELCOME TO CROWDPLAY CASINO
============================

Hello, {{ $user->name }}!

Welcome to CrowdPlay! Your social gaming account has been successfully created and is ready to play.

YOUR ACCOUNT DETAILS:
- Name: {{ $user->name }} {{ $user->surname ?? '' }}
- Email: {{ $user->email }}
@if(!empty($user->country))- Country: {{ $user->country }}
@endif
- Referral Code: {{ $user->referral_code ?? 'N/A' }}

WHAT TO EXPLORE:
* Daily Free Bonus: Claim your free daily 1.00 SC every 24 hours in the lobby or store.
* 150+ Top Games: Pragmatic Play, PG Soft, Hacksaw Gaming, Spribe, and Live Dealers.
* Lucky Wheel: Spin daily for extra prizes up to 10 SC.

Start playing now: {{ config('app.url') }}

---
CrowdPlay Casino • Social Gaming Entertainment
If you did not register for this account, please contact support.
