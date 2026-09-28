/**
 * Client for the visitor API in public/api (PHP + MySQL on Hostinger).
 * In local development there is no PHP server, so tracking is skipped and reads fail quietly.
 */

const API = '/api';
const enabled = !import.meta.env.DEV;

export interface Counts {
  views: number;
  visitors: number;
}

export interface PublicStats {
  live: number;
  total: Counts;
}

export interface Row {
  label: string;
  views: number;
}

export interface PrivateStats extends PublicStats {
  today: Counts;
  last7: Counts;
  last30: Counts;
  daily: ({ date: string } & Counts)[];
  referrers: Row[];
  pages: Row[];
  devices: Row[];
  browsers: Row[];
  countries: Row[];
  generatedAt: string;
}

function post(body: object) {
  return fetch(`${API}/track.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

let started = false;

/** Records this page view once, then pings every minute while the tab is visible. */
export function startTracking() {
  if (!enabled || started) return () => {};
  started = true;

  post({ type: 'view', path: location.pathname, referrer: document.referrer });

  const ping = () => document.visibilityState === 'visible' && post({ type: 'ping' });
  const timer = window.setInterval(ping, 60_000);
  document.addEventListener('visibilitychange', ping);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', ping);
  };
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const res = await fetch(`${API}/stats.php`);
  if (!res.ok) throw new Error(`stats ${res.status}`);
  return res.json();
}

export class UnauthorizedError extends Error {}

export async function fetchPrivateStats(key: string): Promise<PrivateStats> {
  const res = await fetch(`${API}/stats.php`, { headers: { 'X-Stats-Key': key } });
  if (res.status === 401) throw new UnauthorizedError('Wrong key');
  if (!res.ok) throw new Error(res.status === 503 ? 'The database isn’t set up yet.' : `Server error (${res.status})`);
  return res.json();
}

export const formatCount = (n: number) => new Intl.NumberFormat('en-IN').format(n);
