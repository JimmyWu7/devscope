"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { User2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  async function signOutUser() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <div className="h-header bg-background border-b">
      <nav className="container mx-auto px-4 flex h-full items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          DevScope
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            {session.user.image != null ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center overflow-hidden rounded-full border">
                <User2Icon className="size=-[30px] mt-2.5" />
              </div>
            )}
            <span className="text-muted-foreground text-sm">
              {session.user?.name || session.user?.email}
            </span>
            <Button onClick={() => signOutUser()}>Sign out</Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
