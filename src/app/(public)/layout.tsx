import type { ReactNode } from "react";

import { PublicShell } from "@/Components/PublicShell";

/** Shared chrome (header + footer) for every public marketing page. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
