import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();

  return (
    <>
      <main className="flex flex-col items-center justify-center bg-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Collect and share <span className="text-primary">testimonials</span>{" "}
            nice and quick.
          </h1>
          <p className="text-3xl"></p>
          <p>a grid of testimonials here.</p>
        </div>
        {status === "authenticated" && (
          <Link href={"/dashboard"}>
            <Button>
              <ArrowRight className="mr-2 h-4 w-4" /> Go to Dashboard
            </Button>
          </Link>
        )}
      </main>
    </>
  );
}
