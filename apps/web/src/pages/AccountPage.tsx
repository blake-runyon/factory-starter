import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

/** Example protected page. Wrapped in <RequireAuth> in App.tsx. */
export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <dl className="grid grid-cols-2 gap-2 rounded-lg border p-4 text-sm">
        <dt className="text-muted-foreground">Name</dt>
        <dd>{session?.user.name}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{session?.user.email}</dd>
      </dl>
      <Link to="/" className="self-start underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}
