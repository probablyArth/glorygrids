import { env } from "@/env";
import { getImage } from "@/storage";
import { api } from "@/utils/api";
import { type Grid } from "@repo/db/client";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { type FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const Grids = () => {
  const { data, error, status } = api.grids.get.useQuery();

  return (
    <div className="w-full rounded-md bg-secondary p-4">
      {status === "pending" ? (
        <LoadingGrid />
      ) : status === "error" ? (
        <ErrorGrid message={error.message} />
      ) : (
        <SuccessGrid
          data={data as unknown as Exclude<typeof data, undefined>}
        />
      )}
    </div>
  );
};

const ErrorGrid: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="w-full bg-secondary p-4">
      OOPS An error occured.. {message}
    </div>
  );
};

const LoadingGrid = () => {
  return <div className="w-full bg-secondary p-4">Loading...</div>;
};

const SuccessGrid: FC<{
  data: (Grid & {
    icon: { path: string } | null;
    _count: { textTestimonials: number };
  })[];
}> = ({ data }) => {
  const { toast } = useToast();

  if (data.length === 0) {
    return (
      <div className="w-full text-center">No Grids found :( Create one? :D</div>
    );
  }

  return (
    <div className="tems-center grid grid-cols-1 justify-center gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((grid) => {
        return (
          <div
            key={grid.id}
            className="flex min-w-[100px] max-w-[300px] flex-col items-center justify-center rounded-md bg-background shadow-sm"
          >
            <Link
              href={`/dashboard/grids/${grid.slug}`}
              className="p-4 text-start"
            >
              <Image
                src={getImage(grid?.icon?.path as unknown as string)}
                height={200}
                width={200}
                alt={grid.name}
                className="rounded-full"
              />

              <h2 className="text-xl font-bold">{grid.name}</h2>
              <div className="flex justify-between">
                {grid._count.textTestimonials} text testimonials
              </div>
            </Link>
            <div className="flex w-full items-center justify-between gap-4 rounded-b-md bg-primary p-4 text-primary">
              <code className="relative rounded bg-foreground px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold text-secondary">
                {env.NEXT_PUBLIC_CLIENT_BASE_URL}/{grid.slug}
              </code>
              <TooltipProvider>
                <Tooltip delayDuration={0.2}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="p-2"
                      onClick={() => {
                        void navigator.clipboard.writeText(
                          `${env.NEXT_PUBLIC_CLIENT_BASE_URL}/${grid.slug}`,
                        );
                        toast({
                          title: "Coped to clipboard ✅",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Grids;
