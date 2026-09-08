<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountBlockedNoticeMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $caseNumber;
    public string $recipientEmail;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $caseNumber, string $recipientEmail = 'renat@crowdplay.io')
    {
        $this->user = $user;
        $this->caseNumber = $caseNumber;
        $this->recipientEmail = $recipientEmail;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject("OFFICIAL NOTICE: Account Blocked [Case No. {$this->caseNumber}]")
            ->view('emails.account_blocked_notice')
            ->text('emails.account_blocked_notice_plain');
    }
}
