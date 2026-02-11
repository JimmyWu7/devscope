import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-linear-to-b from-muted/30 to-background border-t">
      <div className="max-w-6xl mx-auto px-6 py-4 md:py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-10 text-center lg:text-left">
          {/* Project Name + Description */}
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-xl font-bold">DevScope</h3>
            <p className="text-sm text-center lg:text-left text-muted-foreground max-w-xs mx-auto">
              Your all-in-one dashboard to track applications, grow your skills,
              and level up your developer career.
            </p>
            {/* Socials */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="https://github.com/JimmyWu7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5"></Github>
              </Link>
              <Link
                href="https://www.linkedin.com/in/jimmywu7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Documentation</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full border-t py-6 flex flex-col items-center text-center text-sm text-muted-foreground space-y-3">
        <p>© {new Date().getFullYear()} DevScope. All rights reserved.</p>

        <p>Made with ❤️ for developers.</p>
      </div>
    </footer>
  );
}
