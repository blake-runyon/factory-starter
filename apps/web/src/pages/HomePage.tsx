import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Health = { status: string; db: string };

export default function HomePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);

  const check = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch("/api/health");
      setHealth((await res.json()) as Health);
    } catch {
      setHealth(null);
      setError(true);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount; state updates happen after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void check();
  }, [check]);

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">{document.title}</h1>
      <p className="text-muted-foreground">
        Built by the Software Factory. Replace this page with your first feature.
      </p>
      <dl className="grid grid-cols-2 gap-2 rounded-lg border p-4 text-sm">
        <dt className="text-muted-foreground">API</dt>
        <dd data-testid="api-status">{error ? "unreachable" : (health?.status ?? "…")}</dd>
        <dt className="text-muted-foreground">Database</dt>
        <dd data-testid="db-status">{error ? "unknown" : (health?.db ?? "…")}</dd>
      </dl>
      <Button variant="outline" className="self-start" onClick={() => void check()}>
        Check again
      </Button>
    </main>
  );
}
