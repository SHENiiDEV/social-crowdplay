<?php

namespace App\Mail;

use App\Models\DepositLog;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DepositSuccessfulMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public DepositLog $deposit;
    public float $newBalance;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, DepositLog $deposit, ?float $newBalance = null)
    {
        $this->user = $user;
        $this->deposit = $deposit;
        $this->newBalance = $newBalance ?? (float) ($user->game_balance ?? $user->balance ?? 0.00);
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject("Deposit Confirmed: +{$this->deposit->coins_received} SC Credited! [Order #{$this->deposit->order_id}]")
            ->view('emails.deposit_successful')
            ->text('emails.deposit_successful_plain');
    }
}
