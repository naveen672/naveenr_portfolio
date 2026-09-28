<?php
// POST /api/track.php  {"type":"view","path":"/","referrer":"https://..."}  records a page view
// POST /api/track.php  {"type":"ping"}                                       keeps "here now" fresh

declare(strict_types=1);
require __DIR__ . '/db.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(['error' => 'method_not_allowed'], 405);
}

$ua = user_agent();
if (is_bot($ua)) {
    respond(['ok' => true, 'ignored' => 'bot']);
}

$body = json_body();
$type = ($body['type'] ?? 'view') === 'ping' ? 'ping' : 'view';
$pdo = db();
$hash = visitor_hash();
$now = now();

$pdo->prepare(
    'INSERT INTO presence (visitor_hash, last_seen) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE last_seen = VALUES(last_seen)'
)->execute([$hash, $now]);

if ($type === 'ping') {
    respond(['ok' => true]);
}

$path = substr(preg_replace('/[^\w\-\/.#]/', '', (string) ($body['path'] ?? '/')) ?: '/', 0, 255);

// Referrer host only; our own domain counts as direct
$referrer = null;
$refHost = parse_url((string) ($body['referrer'] ?? ''), PHP_URL_HOST);
if (is_string($refHost) && $refHost !== '') {
    $refHost = strtolower(preg_replace('/^www\./i', '', $refHost));
    $ownHost = strtolower(preg_replace('/^www\./i', '', (string) ($_SERVER['HTTP_HOST'] ?? '')));
    if ($refHost !== $ownHost) {
        $referrer = substr($refHost, 0, 255);
    }
}

// Ignore instant repeats of the same page (double-fires, quick reloads)
$recent = $pdo->prepare(
    'SELECT 1 FROM visits WHERE visitor_hash = ? AND path = ? AND created_at > (? - INTERVAL 30 SECOND) LIMIT 1'
);
$recent->execute([$hash, $path, $now]);
if ($recent->fetchColumn()) {
    respond(['ok' => true, 'ignored' => 'repeat']);
}

$pdo->prepare(
    'INSERT INTO visits (visitor_hash, path, referrer_host, device, browser, country, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
)->execute([$hash, $path, $referrer, device_of($ua), browser_of($ua), country_of(), $now]);

respond(['ok' => true]);
