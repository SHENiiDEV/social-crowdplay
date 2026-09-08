<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $resetUrl;
    public int $expiresInMinutes;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $resetUrl, int $expiresInMinutes = 60)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
        $this->expiresInMinutes = $expiresInMinutes;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject('Reset Your CrowdPlay Password 🔒')
            ->view('emails.reset_password')
            ->text('emails.reset_password_plain');
    }
}
