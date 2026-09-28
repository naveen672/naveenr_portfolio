<?php
// Shared helpers for the visitor API. Never stores raw IP addresses: each visitor becomes a
// short hash of (secret salt, date, IP, user agent) that changes every day.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function config(): array
{
    static $config = null;
    if ($config === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            respond(['error' => 'not_configured'], 503);
        }
        $config = require $file;
        date_default_timezone_set($config['timezone'] ?? 'Asia/Kolkata');
    }
    return $config;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    $c = config();
    $debug = !empty($c['debug']);
    if (!extension_loaded('pdo_mysql')) {
        respond(['error' => 'db_unavailable'] + ($debug ? ['detail' => 'PHP extension pdo_mysql is not enabled'] : []), 503);
    }
    try {
        $pdo = new PDO(
            "mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",
            $c['db_user'],
            $c['db_pass'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $e) {
        // With 'debug' => true in config.php the reason is shown (MySQL never includes the password).
        // Turn it off again once connected.
        respond(['error' => 'db_unavailable'] + ($debug ? ['detail' => $e->getMessage()] : []), 503);
    }
    ensure_schema($pdo);
    return $pdo;
}

/** Creates the tables on first use so no manual SQL is needed. */
function ensure_schema(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS visits (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            visitor_hash CHAR(16) NOT NULL,
            path VARCHAR(255) NOT NULL,
            referrer_host VARCHAR(255) NULL,
            device ENUM('mobile','tablet','desktop') NOT NULL,
            browser VARCHAR(32) NOT NULL,
            country CHAR(2) NULL,
            created_at DATETIME NOT NULL,
            INDEX idx_created (created_at),
            INDEX idx_visitor_day (visitor_hash, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS presence (
            visitor_hash CHAR(16) NOT NULL PRIMARY KEY,
            last_seen DATETIME NOT NULL,
            INDEX idx_last_seen (last_seen)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );
}

function now(): string
{
    config();
    return date('Y-m-d H:i:s');
}

function client_ip(): string
{
    // Behind Hostinger's CDN the visitor's address arrives in a forwarding header
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR'] as $h) {
        if (!empty($_SERVER[$h])) {
            return trim(explode(',', (string) $_SERVER[$h])[0]);
        }
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '');
}

function user_agent(): string
{
    return substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512);
}

function visitor_hash(): string
{
    $c = config();
    return substr(hash('sha256', $c['hash_salt'] . '|' . date('Y-m-d') . '|' . client_ip() . '|' . user_agent()), 0, 16);
}

function is_bot(string $ua): bool
{
    return $ua === '' || (bool) preg_match(
        '/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch/i',
        $ua
    );
}

function device_of(string $ua): string
{
    if (preg_match('/ipad|tablet|(android(?!.*mobile))/i', $ua)) {
        return 'tablet';
    }
    return preg_match('/mobi|iphone|android/i', $ua) ? 'mobile' : 'desktop';
}

function browser_of(string $ua): string
{
    $rules = [
        'Edge' => '/edg\//i',
        'Opera' => '/opr\/|opera/i',
        'Samsung Internet' => '/samsungbrowser/i',
        'Chrome' => '/chrome|crios/i',
        'Firefox' => '/firefox|fxios/i',
        'Safari' => '/safari/i',
    ];
    foreach ($rules as $name => $re) {
        if (preg_match($re, $ua)) {
            return $name;
        }
    }
    return 'Other';
}

function country_of(): ?string
{
    foreach (['HTTP_CF_IPCOUNTRY', 'HTTP_X_COUNTRY_CODE', 'HTTP_X_GEO_COUNTRY'] as $h) {
        $v = strtoupper(trim((string) ($_SERVER[$h] ?? '')));
        if (preg_match('/^[A-Z]{2}$/', $v) && $v !== 'XX') {
            return $v;
        }
    }
    return null;
}

/** Same-origin JSON body, capped in size. */
function json_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 4096);
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}
