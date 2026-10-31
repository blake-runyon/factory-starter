import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="self-start underline underline-offset-4">
        Go home
      </Link>
    </main>
  );
}
