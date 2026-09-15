<?php

return [
    'name' => env('COMPANY_NAME', env('FRONT_COMPANY_NAME', 'WEBYSOFT SYSTEMS, MB')),
    'number' => env('COMPANY_NUMBER', env('FRONT_COMPANY_REG_NUMBER', '308033902')),
    'address' => env('COMPANY_ADDRESS', env('FRONT_COMPANY_ADDR', 'V. Nagevičiaus g. 3, LT-08237 Vilnius')),
    'email' => env('COMPANY_EMAIL', env('FRONT_COMPANY_EMAIL', 'info@crowdplay.net')),
    'phone' => env('COMPANY_PHONE', env('FRONT_COMPANY_PHONE', '+370 60 000 000')),
    'license' => env('COMPANY_LICENSE', env('FRONT_COMPANY_LICENSE', null)),
];
