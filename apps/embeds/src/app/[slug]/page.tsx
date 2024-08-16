import { TextTestimonial } from "@repo/db/client";
import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";
import { StarIcon } from "lucide-react";

const GridItem: FC<{ t: TextTestimonial }> = ({ t }) => {
  return (
    <Card className="h-full max-w-[300px]">
      <CardHeader>
        <CardTitle>{t.name}</CardTitle>
        <div className="flex">
          {Array.from({ length: t.rating }).map((_, idx) => {
            return (
              <StarIcon
                key={idx}
                color="gold"
                fill="gold"
                height={15}
                width={15}
              />
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-wrap break-words">
          {t.content}
        </CardDescription>
      </CardContent>
      <CardFooter>{t.createdAt.toDateString()}</CardFooter>
    </Card>
  );
};

const Grid: FC<{ params: { slug: string } }> = async ({ params }) => {
  const data = await api.testimonials.get({ slug: params.slug });

  return (
    <div className="grid grid-flow-col items-center justify-center gap-8 p-4">
      {data.map((i) => {
        return <GridItem t={i} />;
      })}
    </div>
  );
};

export default Grid;
