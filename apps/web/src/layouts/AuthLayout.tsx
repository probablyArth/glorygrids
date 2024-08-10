import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { type FC, type ReactNode, useEffect } from "react";

const RESTRICTED_PATHS = ["new", "dashboard"];

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "unauthenticated" &&
      RESTRICTED_PATHS.includes(
        router.pathname.split("/")[1] as unknown as string,
      )
    ) {
      void router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthLayout;
