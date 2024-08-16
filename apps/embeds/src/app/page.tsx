"use client";

import Link from "next/link";
import { env } from "~/env";

export default async function Home() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Link
        href={env.NEXT_PUBLIC_MAIN_APP_URL}
        className="text-muted-foreground underline"
      >
        {">"} Glory Grids
      </Link>
    </main>
  );
}
