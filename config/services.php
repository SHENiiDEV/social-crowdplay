<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'ggr' => [
        'api_server' => env('GGR_API_SERVER', 'https://api.ggr-goldapi.com'),
        'agent_code' => env('GGR_AGENT_CODE', 'crowdplay_agent'),
        'agent_token' => env('GGR_AGENT_TOKEN', 'test_agent_token_41f5cc79'),
        'agent_secret' => env('GGR_AGENT_SECRET', 'test_agent_secret_8371c59'),
        'mock_mode' => env('GGR_MOCK_MODE', true),
    ],

];

