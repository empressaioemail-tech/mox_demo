/**
 * Shell barrel — the persistent app shell (header + providers + container).
 *
 *   import { AppShell, DemoHeader, ContentContainer } from "@/components/shell";
 *
 * AppShell is mounted in layout.tsx. Surfaces opt into the responsive
 * <ContentContainer> for full-screen-friendly layout.
 */

export { AppShell } from "./AppShell";
export { DemoHeader } from "./DemoHeader";
export { WalkthroughControls } from "./WalkthroughControls";
export type { WalkthroughControlsProps } from "./WalkthroughControls";
export { ContentContainer } from "./ContentContainer";
export type { ContentContainerProps, ContainerWidth } from "./ContentContainer";
