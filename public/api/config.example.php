<?php
// Copy this file to config.php (same folder) and fill in your Hostinger MySQL details.
// config.php is git-ignored so your password never reaches GitHub.

return [
    // hPanel → Databases → MySQL Databases
    'db_host' => 'localhost',
    'db_name' => 'u123456789_visitors',
    'db_user' => 'u123456789_naveen',
    'db_pass' => 'your-database-password',

    // Long random strings (for example from https://1password.com/password-generator).
    // stats_key unlocks the private dashboard at https://naveenrdev.in/stats
    'stats_key' => 'change-me-to-a-long-random-string',
    // Secret used to anonymise visitors; changing it resets "unique" counting for the day
    'hash_salt' => 'change-me-to-another-long-random-string',

    'timezone' => 'Asia/Kolkata',
];
