import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { cn } from "@/lib/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { api } from "@/utils/api";

import "@/styles/globals.css";
import AuthLayout from "@/layouts/AuthLayout";
import { Toaster } from "@/components/ui/toaster";
import PublicLayout from "@/layouts/PublicLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div
        className={
          cn("min-h-screen bg-background font-sans antialiased") + " px-8 py-4"
        }
      >
        <Toaster />
        <PublicLayout>
          <div className="px-10 py-20">
            <AuthLayout>
              <ReactQueryDevtools initialIsOpen={false} />

              <Component {...pageProps} />
            </AuthLayout>
          </div>
        </PublicLayout>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
