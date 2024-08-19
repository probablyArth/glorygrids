import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InboxNav from "@/components/Grid/InboxNav";
import { env } from "@/env";
import { getImage } from "@/storage";
import { api } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import InboxContextProvider from "@/components/Grid/InboxContext";
import InboxArea from "@/components/Grid/InboxArea";
import GenerateEmbedButton from "@/components/GenerateEmbedButton";

const GridDashboardPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, status } = api.grids.getBySlug.useQuery({
    slug: slug as string,
  });

  if (typeof slug !== "string") {
    return <div className="bg-primary p-4">Invalid slug</div>;
  }

  if (status === "pending") {
    return <div className="bg-primary p-4">Loading...</div>;
  }

  if (status === "error" || data === null) {
    return <div className="bg-primary p-4">Error</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={getImage(data.icon?.path as unknown as string)}
            alt={data.name}
            width={80}
            height={80}
            className="h-[80px] w-[80px] rounded-full border-2 shadow-sm"
          />
          <div className="flex flex-col justify-between gap-2">
            <CardTitle>{data.name}</CardTitle>
            <CardDescription>
              <div className="flex">
                Grid public URL: &nbsp;
                <a
                  href={`${env.NEXT_PUBLIC_CLIENT_BASE_URL}/${data.slug}`}
                  target="_blank"
                  className="underline"
                >
                  {env.NEXT_PUBLIC_CLIENT_BASE_URL}/{data.slug}
                </a>
              </div>
            </CardDescription>
          </div>
          <div>
            <GenerateEmbedButton />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex h-[50vh] p-0">
        <InboxContextProvider slug={slug}>
          <InboxNav />
          <Separator orientation="vertical" />
          <InboxArea />
        </InboxContextProvider>
      </CardContent>
    </Card>
  );
};

export default GridDashboardPage;
