import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
// import { ThemeSelector } from "./ui/theme-selector";
import { ModeToggle } from "../ui/mode-toggle";
import Link from "next/link";

type SiteHeaderProps = {
  githubProfile?: {
    profileUrl: string;
    username: string;
    avatarUrl: string;
  } | null;
  latestSync?: Date | null;
};

export function SiteHeader({ githubProfile, latestSync }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          {latestSync && (
            <p className="text-sm text-muted-foreground">
              Last synced: {latestSync.toLocaleString()}
            </p>
          )}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            {githubProfile ? (
              <Link
                href={githubProfile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-foreground"
              >
                My GitHub
              </Link>
            ) : (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com"
              >
                GitHub Not Linked
              </Link>
            )}
          </Button>
          {/* <ThemeSelector /> */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
