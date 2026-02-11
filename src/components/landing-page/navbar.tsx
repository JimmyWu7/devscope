"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) return null; // or a skeleton navbar
  return (
    <header className="flex items-center justify-center w-full sticky top-0 z-50 bg-background border-b">
      <nav className="flex items-center justify-between w-full px-6 max-w-7xl h-header">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={
                isDark
                  ? "/devscope-crosshair-white.png"
                  : "/devscope-crosshair.png"
              }
              alt="DevScope logo"
              width={25}
              height={25}
              priority
            />
            <span className="font-semibold text-md">DevScope</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center">
          <ul className="flex gap-12">
            <li>
              <a href="#features" className="text-md font-medium">
                Features
              </a>
            </li>
            <li>
              <a href="#faq" className="text-md font-medium">
                FAQ
              </a>
            </li>
            <li>
              <a href="#docs" className="text-md font-medium">
                Docs
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <Button className="cursor-pointer">Get started</Button>
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 w-full bg-background z-40 md:hidden transition-transform duration-300 ease-in-out">
          <ul className="flex flex-col items-center gap-4 px-6 py-4">
            {["Features", "FAQ", "Docs"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-md font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/auth/login">
                <Button className="text-md w-full cursor-pointer">
                  Get started
                </Button>
              </Link>
            </li>
            <li className="pt-2">
              <ModeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
