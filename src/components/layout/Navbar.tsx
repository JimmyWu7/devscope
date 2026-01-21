"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <span className="font-semibold">DevScope</span>

      {session ? (
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      ) : (
        <Button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>Sign in with GitHub</Button>
      )}
    </nav>
  );
};

export default Navbar;
