<?php
// GET /api/stats.php                           public: here-now count and all-time totals
// GET /api/stats.php  + header X-Stats-Key     private: full 30-day breakdown for /stats

declare(strict_types=1);
require __DIR__ . '/db.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    respond(['error' => 'method_not_allowed'], 405);
}

$pdo = db();
$now = now();

function scalar(PDO $pdo, string $sql, array $args = []): int
{
    $st = $pdo->prepare($sql);
    $st->execute($args);
    return (int) $st->fetchColumn();
}

// "Visitors" = unique visitors per day, summed (hashes rotate daily by design)
function views_and_visitors(PDO $pdo, string $since): array
{
    $st = $pdo->prepare(
        'SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash, DATE(created_at)) AS visitors
         FROM visits WHERE created_at >= ?'
    );
    $st->execute([$since]);
    $row = $st->fetch() ?: ['views' => 0, 'visitors' => 0];
    return ['views' => (int) $row['views'], 'visitors' => (int) $row['visitors']];
}

$live = scalar($pdo, 'SELECT COUNT(*) FROM presence WHERE last_seen > (? - INTERVAL 2 MINUTE)', [$now]);
$allTime = views_and_visitors($pdo, '1970-01-01');

$key = (string) ($_SERVER['HTTP_X_STATS_KEY'] ?? '');
if ($key === '') {
    respond(['live' => $live, 'total' => $allTime]);
}

if (!hash_equals((string) config()['stats_key'], $key)) {
    sleep(1); // slow down guessing
    respond(['error' => 'unauthorized'], 401);
}

$today = date('Y-m-d 00:00:00');
$since7 = date('Y-m-d 00:00:00', strtotime('-6 days'));
$since30 = date('Y-m-d 00:00:00', strtotime('-29 days'));

// Daily series for the last 30 days, zero-filled
$st = $pdo->prepare(
    'SELECT DATE(created_at) AS day, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors
     FROM visits WHERE created_at >= ? GROUP BY DATE(created_at)'
);
$st->execute([$since30]);
$byDay = [];
foreach ($st->fetchAll() as $row) {
    $byDay[$row['day']] = ['views' => (int) $row['views'], 'visitors' => (int) $row['visitors']];
}
$daily = [];
for ($i = 29; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-{$i} days"));
    $daily[] = ['date' => $d] + ($byDay[$d] ?? ['views' => 0, 'visitors' => 0]);
}

function top(PDO $pdo, string $column, string $since, int $limit = 8): array
{
    // $column is one of a fixed allow-list below, never user input
    $st = $pdo->prepare(
        "SELECT COALESCE($column, '') AS label, COUNT(*) AS views FROM visits
         WHERE created_at >= ? GROUP BY label ORDER BY views DESC LIMIT $limit"
    );
    $st->execute([$since]);
    return array_map(
        fn ($r) => ['label' => $r['label'], 'views' => (int) $r['views']],
        $st->fetchAll()
    );
}

respond([
    'live' => $live,
    'total' => $allTime,
    'today' => views_and_visitors($pdo, $today),
    'last7' => views_and_visitors($pdo, $since7),
    'last30' => views_and_visitors($pdo, $since30),
    'daily' => $daily,
    'referrers' => top($pdo, 'referrer_host', $since30),
    'pages' => top($pdo, 'path', $since30),
    'devices' => top($pdo, 'device', $since30, 3),
    'browsers' => top($pdo, 'browser', $since30, 6),
    'countries' => top($pdo, 'country', $since30),
    'generatedAt' => $now,
]);
