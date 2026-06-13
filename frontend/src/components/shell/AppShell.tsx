"use client";

/**
 * AppShell — the global client shell mounted once in layout.tsx.
 *
 * Composes the persistent providers (role + walkthrough) and the persistent
 * DemoHeader around every page. Pages render as children below the sticky header.
 *
 * Kept as a single client boundary so the server RootLayout stays a server
 * component and only this subtree is client-side.
 */

import type { ReactNode } from "react";
import { RoleProvider } from "@/components/rbac";
import { WalkthroughProvider } from "@/components/walkthrough";
import { DemoHeader } from "./DemoHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <WalkthroughProvider>
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
          <DemoHeader />
          <div className="flex-1">{children}</div>
        </div>
      </WalkthroughProvider>
    </RoleProvider>
  );
}

export default AppShell;
