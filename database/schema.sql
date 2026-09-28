-- Visitor analytics schema for naveenrdev.in
-- Import in phpMyAdmin: select the database (u131255494_naveen) → Import → choose this file → Go.
-- Matches ensure_schema() in public/api/db.php; safe to run more than once.

CREATE TABLE IF NOT EXISTS visits (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS presence (
  visitor_hash CHAR(16) NOT NULL PRIMARY KEY,
  last_seen DATETIME NOT NULL,
  INDEX idx_last_seen (last_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
