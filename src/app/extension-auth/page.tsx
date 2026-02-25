// extension-auth/page.tsx
"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ExtensionAuth() {
  const { data: session, isPending } = authClient.useSession();
  // console.log("Extension Auth Session", session);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/login?callbackUrl=/extension-auth");
      return;
    }

    async function authenticate() {
      const res = await fetch("/api/extension-token", { method: "POST" });
      if (!res.ok) return;

      const { token } = await res.json();
      // console.log("Extension Auth Token", token);

      // Send token to browser
      window.postMessage(
        {
          type: "DEV_SCOPE_EXTENSION_TOKEN",
          token: token,
        },
        "*",
      );

      // Optionally close the page automatically
      // window.close();
    }

    authenticate();
  }, [session, isPending]);

  return <div>Connecting DevScope Extension...</div>;
}
