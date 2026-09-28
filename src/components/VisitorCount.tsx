import { useQuery } from '@tanstack/react-query';
import { fetchPublicStats, formatCount } from '@/lib/visitors';

/** "● 3 here now · 12,345 visits". Renders nothing until the API answers. */
export function VisitorCount() {
  const { data } = useQuery({
    queryKey: ['visitors', 'public'],
    queryFn: fetchPublicStats,
    refetchInterval: 60_000,
    retry: false,
    staleTime: 30_000,
  });

  if (!data) return null;

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
      {data.live > 0 && (
        <>
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>
            <span className="tabular-nums text-foreground">{formatCount(data.live)}</span> here now
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      <span>
        <span className="tabular-nums text-foreground">{formatCount(data.total.visitors)}</span> visits
      </span>
    </p>
  );
}
