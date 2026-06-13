"use client";

/**
 * DemoHeader — the persistent demo top bar, mounted in the app shell on every
 * page (layout.tsx).
 *
 * Always-visible controls so the presenter is never lost full-screen:
 *  - the Mox wordmark (links home)
 *  - primary nav to every surface (Home, Yardi, Twin, Command, Investor, Context)
 *  - the WALKTHROUGH controls (start / prev / next / exit + beat indicator)
 *  - the ROLE SWITCHER
 *
 * Sticky, dark, compact. On narrow screens the primary nav and secondary controls
 * collapse into a toggleable menu; the wordmark and walkthrough controls stay on
 * the bar so the demo is always drivable.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RoleSwitcher } from "@/components/rbac";
import { WalkthroughControls } from "./WalkthroughControls";

interface NavItem {
  href: string;
  label: string;
}

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/yardi", label: "Yardi" },
  { href: "/twin", label: "Twin" },
  { href: "/command", label: "Command" },
  { href: "/investor", label: "Investor" },
  { href: "/context", label: "Context" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function DemoHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-base font-semibold tracking-tight text-zinc-50">
            Mox
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-widest text-zinc-600 sm:inline">
            demo
          </span>
        </Link>

        {/* Primary nav — desktop */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-2.5 py-1 text-sm font-medium transition",
                isActive(pathname, item.href)
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster — walkthrough always on bar; role switcher on wider */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <WalkthroughControls compact />
          <div className="hidden md:block">
            <RoleSwitcher compact />
          </div>

          {/* Menu toggle — narrow screens */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-300 transition hover:border-zinc-500 hover:text-white lg:hidden"
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Collapsed menu — narrow screens */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 lg:hidden">
          <nav className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive(pathname, item.href)
                    ? "bg-zinc-800 text-zinc-50"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto max-w-screen-2xl border-t border-zinc-800 px-4 py-3 sm:px-6 md:hidden">
            <RoleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}

export default DemoHeader;
