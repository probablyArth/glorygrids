import Navbar from "@/components/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";

const PublicLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/[slug]" && (
        <>
          <Head>
            <title>Glory Grid</title>
            <meta name="description" content="Easy testimonials collection" />
            <link rel="icon" href="/gg.png" />
          </Head>
          <Navbar />
        </>
      )}
      {children}
    </>
  );
};

export default PublicLayout;
