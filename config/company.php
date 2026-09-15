<?php

return [
    'name' => env('COMPANY_NAME', env('FRONT_COMPANY_NAME', 'Crowdplay Entertainment N.V.')),
    'number' => env('COMPANY_NUMBER', env('FRONT_COMPANY_REG_NUMBER', '164829')),
    'address' => env('COMPANY_ADDRESS', env('FRONT_COMPANY_ADDR', 'Heelsumstraat 51, Willemstad, Curaçao')),
    'email' => env('COMPANY_EMAIL', env('FRONT_COMPANY_EMAIL', 'support@crowdplay.net')),
    'phone' => env('COMPANY_PHONE', env('FRONT_COMPANY_PHONE', '+357 22 123 456')),
    'license' => env('COMPANY_LICENSE', env('FRONT_COMPANY_LICENSE', 'OGL/2026/184/0129')),
];
