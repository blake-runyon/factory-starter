import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

/** Sign in / sign up links, or the signed-in user with a sign-out button. */
export function AuthNav() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  if (isPending) return null;

  return (
    <nav aria-label="Account" className="flex items-center gap-3 text-sm">
      {session ? (
        <>
          <Link to="/account" className="underline underline-offset-4">
            {session.user.email}
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOut().then(() => navigate("/"))}
          >
            Sign out
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" className="underline underline-offset-4">
            Sign in
          </Link>
          <Link to="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
}
