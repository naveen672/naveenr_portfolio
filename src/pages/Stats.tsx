import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { SkyToggle } from '@/components/ui/sky-toggle';
import {
  fetchPrivateStats,
  formatCount,
  UnauthorizedError,
  type Counts,
  type PrivateStats,
  type Row,
} from '@/lib/visitors';

const KEY_STORAGE = 'naveenr-stats-key';

function readKey() {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

/** Reads chart colours from CSS tokens (SVG attributes can't take var()) and follows theme changes. */
function useVizColors() {
  const read = () => {
    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    return { views: v('--viz-1'), visitors: v('--viz-2'), grid: v('--viz-grid'), axis: v('--viz-axis') };
  };
  const [colors, setColors] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setColors(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return colors;
}

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const card = 'rounded-3xl bg-card ring-1 ring-border/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)]';

function KeyGate({ onKey, error }: { onKey: (k: string) => void; error?: string }) {
  const [value, setValue] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onKey(value.trim());
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <form onSubmit={submit} className={`${card} w-full max-w-sm p-7`}>
        <h1 className="font-display text-2xl font-medium tracking-[-0.02em]">Visitor stats</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the stats key from your server’s config.php.</p>
        <label htmlFor="stats-key" className="mt-6 block text-sm font-medium">
          Stats key
        </label>
        <input
          id="stats-key"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-invalid={!!error}
          aria-describedby={error ? 'stats-key-error' : undefined}
        />
        {error && (
          <p id="stats-key-error" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Open dashboard
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
          Back to the site
        </Link>
      </form>
    </main>
  );
}

function Tile({ label, counts, live }: { label: string; counts?: Counts; live?: number }) {
  return (
    <div className={`${card} p-5 md:p-6`}>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {live !== undefined && (
          <span className="relative flex h-2 w-2" aria-hidden>
            {live > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${live > 0 ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
          </span>
        )}
        {label}
      </p>
      {live !== undefined ? (
        <>
          <p className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] tabular-nums">{formatCount(live)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{live === 1 ? 'person on the site' : 'people on the site'}</p>
        </>
      ) : (
        counts && (
          <>
            <p className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] tabular-nums">
              {formatCount(counts.visitors)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              visitors · <span className="tabular-nums">{formatCount(counts.views)}</span> views
            </p>
          </>
        )
      )}
    </div>
  );
}

function TrendTooltip({
  active,
  payload,
  label,
  colors,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
  colors: ReturnType<typeof useVizColors>;
}) {
  if (!active || !payload?.length || !label) return null;
  const get = (k: string) => payload.find((p) => p.dataKey === k)?.value ?? 0;
  return (
    <div className="rounded-xl bg-popover px-3.5 py-2.5 text-sm text-popover-foreground shadow-lg ring-1 ring-border">
      <p className="font-medium">{shortDate(label)}</p>
      <p className="mt-1 flex items-center gap-2">
        <span className="h-0.5 w-3 rounded" style={{ background: colors.views }} aria-hidden />
        <span className="text-muted-foreground">Views</span>
        <span className="ml-auto pl-4 tabular-nums">{formatCount(get('views'))}</span>
      </p>
      <p className="flex items-center gap-2">
        <span className="h-0.5 w-3 rounded" style={{ background: colors.visitors }} aria-hidden />
        <span className="text-muted-foreground">Visitors</span>
        <span className="ml-auto pl-4 tabular-nums">{formatCount(get('visitors'))}</span>
      </p>
    </div>
  );
}

function Trend({ daily }: { daily: PrivateStats['daily'] }) {
  const colors = useVizColors();
  const [showTable, setShowTable] = useState(false);
  const last = daily[daily.length - 1];
  const empty = daily.every((d) => d.views === 0);

  // Direct label on the final point of each line, so identity never rests on colour alone
  const endLabel =
    (name: string, color: string) =>
    ({ x, y, index }: { x?: number; y?: number; index?: number }) =>
      index === daily.length - 1 && x !== undefined && y !== undefined ? (
        <g>
          <circle cx={x} cy={y} r={4} fill={color} stroke="hsl(var(--card))" strokeWidth={2} />
          <text x={x + 8} y={y + 4} fontSize={12} fill="currentColor" className="fill-foreground">
            {name}
          </text>
        </g>
      ) : null;

  return (
    <section className={`${card} p-5 md:p-7`} aria-labelledby="trend-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="trend-title" className="font-display text-xl font-medium tracking-[-0.01em]">
            Views and visitors
          </h2>
          <p className="text-sm text-muted-foreground">Last 30 days, per day</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded" style={{ background: colors.views }} aria-hidden /> Views
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded" style={{ background: colors.visitors }} aria-hidden /> Visitors
          </span>
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            className="rounded-full px-3 py-1.5 text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
            aria-expanded={showTable}
          >
            {showTable ? 'Show chart' : 'Show table'}
          </button>
        </div>
      </div>

      {showTable ? (
        <div className="mt-5 max-h-[340px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card text-left text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 text-right font-medium">Views</th>
                <th className="py-2 text-right font-medium">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {[...daily].reverse().map((d) => (
                <tr key={d.date} className="border-t border-border/60">
                  <td className="py-2">{shortDate(d.date)}</td>
                  <td className="py-2 text-right tabular-nums">{formatCount(d.views)}</td>
                  <td className="py-2 text-right tabular-nums">{formatCount(d.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : empty ? (
        <p className="mt-5 flex h-[300px] items-center justify-center rounded-2xl bg-muted/40 text-sm text-muted-foreground">
          No visits recorded yet. They’ll appear here as people open the site.
        </p>
      ) : (
        <div className="mt-5 h-[300px]" role="img" aria-label={`Line chart of daily views and visitors. Today: ${last.views} views, ${last.visitors} visitors.`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ top: 10, right: 72, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={colors.grid} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fill: colors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: colors.grid }}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                content={<TrendTooltip colors={colors} />}
                cursor={{ stroke: colors.axis, strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke={colors.views}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                label={endLabel('Views', colors.views)}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke={colors.visitors}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                label={endLabel('Visitors', colors.visitors)}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function BarList({ title, rows, empty, labelFor }: { title: string; rows: Row[]; empty: string; labelFor?: (l: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  const total = rows.reduce((n, r) => n + r.views, 0);
  return (
    <section className={`${card} p-5 md:p-6`}>
      <h2 className="font-display text-lg font-medium tracking-[-0.01em]">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {rows.map((r) => {
            const label = labelFor ? labelFor(r.label) : r.label;
            const share = Math.round((r.views / Math.max(total, 1)) * 100);
            return (
              <li
                key={r.label}
                className="group relative flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm"
                title={`${label}: ${formatCount(r.views)} views (${share}%)`}
              >
                <span
                  className="absolute inset-y-0.5 left-0 rounded-r-[4px] bg-[var(--viz-1)] opacity-15 transition-opacity group-hover:opacity-25"
                  style={{ width: `${(r.views / max) * 100}%` }}
                  aria-hidden
                />
                <span className="relative truncate">{label}</span>
                <span className="relative shrink-0 tabular-nums text-muted-foreground">
                  {formatCount(r.views)} <span className="text-xs">({share}%)</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

const capitalise = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const regionName = (() => {
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return (code: string) => (code ? (dn.of(code) ?? code) : 'Unknown');
  } catch {
    return (code: string) => code || 'Unknown';
  }
})();

export default function Stats() {
  useTheme(); // applies the visitor's saved light/dark choice on this page too
  const [key, setKey] = useState(readKey);

  useEffect(() => {
    document.title = 'Visitor stats · Naveen R';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const query = useQuery({
    queryKey: ['visitors', 'private', key],
    queryFn: () => fetchPrivateStats(key),
    enabled: !!key,
    retry: false,
    refetchInterval: 60_000,
  });

  const saveKey = (k: string) => {
    try {
      sessionStorage.setItem(KEY_STORAGE, k);
    } catch {
      /* private mode: keep it in memory only */
    }
    setKey(k);
  };
  const signOut = () => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore */
    }
    setKey('');
  };

  const unauthorized = query.error instanceof UnauthorizedError;
  const data = query.data;
  const updated = useMemo(
    () => (data ? new Date(data.generatedAt.replace(' ', 'T')).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''),
    [data]
  );

  if (!key || unauthorized) {
    return <KeyGate onKey={saveKey} error={unauthorized ? 'That key didn’t work. Check stats_key in config.php.' : undefined} />;
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" aria-hidden /> naveenrdev.in
            </Link>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-medium tracking-[-0.035em]">Visitors</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data ? `Updated ${updated} · refreshes every minute` : query.isLoading ? 'Loading…' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => query.refetch()}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 ring-border transition-colors hover:bg-muted"
            >
              <RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} aria-hidden /> Refresh
            </button>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 ring-border transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Lock
            </button>
            <SkyToggle />
          </div>
        </header>

        {query.error && !unauthorized && (
          <p className="mt-8 rounded-2xl bg-destructive/10 px-5 py-4 text-sm text-destructive">
            Couldn’t load stats: {(query.error as Error).message}
          </p>
        )}

        {data && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Tile label="Here now" live={data.live} />
              <Tile label="Today" counts={data.today} />
              <Tile label="Last 7 days" counts={data.last7} />
              <Tile label="Last 30 days" counts={data.last30} />
            </div>

            <div className="mt-4">
              <Trend daily={data.daily} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <BarList
                title="Where visitors came from"
                rows={data.referrers}
                empty="No referrals yet."
                labelFor={(l) => l || 'Direct / typed'}
              />
              <BarList title="Pages" rows={data.pages} empty="No page views yet." />
              <BarList title="Devices" rows={data.devices} empty="No data yet." labelFor={capitalise} />
              <BarList title="Browsers" rows={data.browsers} empty="No data yet." />
              {data.countries.some((c) => c.label) && (
                <BarList title="Countries" rows={data.countries} empty="No data yet." labelFor={regionName} />
              )}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              All time: <span className="tabular-nums text-foreground">{formatCount(data.total.visitors)}</span> visitors ·{' '}
              <span className="tabular-nums text-foreground">{formatCount(data.total.views)}</span> views. Visitors are
              counted once per day without storing IP addresses; bots are ignored.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
