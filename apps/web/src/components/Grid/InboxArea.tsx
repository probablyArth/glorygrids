/* eslint-disable @typescript-eslint/no-empty-function */
import React, { type FC } from "react";
import { useInboxContext } from "./InboxContext";
import type { TextTestimonial } from "@repo/db";
import { api } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import Rating from "../Rating";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SparklesIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

const Testimonial: FC<{ data: TextTestimonial }> = ({ data }) => {
  const toggleLikeMut = api.textTestimonials.toggleLike.useMutation();
  const { toast } = useToast();
  const trpcContext = api.useUtils();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <Rating currRating={data.rating} disabled setRating={() => {}} />
          <TooltipProvider>
            <Tooltip delayDuration={0.3}>
              <TooltipTrigger>
                <SparklesIcon
                  className={`${data.liked && "fill-primary"} stroke-primary ${toggleLikeMut.isPending && "cursor-default"}`}
                  onClick={async () => {
                    if (toggleLikeMut.isPending) return;
                    try {
                      await toggleLikeMut
                        .mutateAsync({ id: data.id })
                        .then(async () => {
                          await trpcContext.testimonials.get.invalidate();
                        });
                      toast({
                        title: `${data.liked ? "Removed testimonial from the grid of glory" : "Added testimonial to the grid of glory"} ✅`,
                      });
                    } catch (e) {
                      toast({
                        variant: "destructive",
                        title: `Failed to ${data.liked ? "remove testimonial from the grid of glory" : "add testimonial to the grid of glory"} ❌`,
                      });
                    }
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {data.liked
                    ? "Remove from the grid of gory"
                    : "Add to the grid of glory"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="text-wrap">{data.content}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <CardDescription>
          <div className="flex flex-col">
            <Label>Name</Label>
            {data.name}
          </div>
        </CardDescription>
        <CardDescription>
          <div className="flex flex-col">
            <Label>Email</Label>
            {data.email}
          </div>
        </CardDescription>
        <CardDescription>
          <div className="flex flex-col">
            <Label>Submitted At</Label>
            {data.createdAt.toDateString()}
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

const InboxArea = () => {
  const { currentInbox, slug } = useInboxContext();
  const { data, status } = api.testimonials.get.useQuery({
    type: currentInbox,
    slug,
  });

  if (status === "pending") {
    return <div className="bg-primary p-4">Loading...</div>;
  }

  if (status === "error" || !data) {
    return <div className="bg-primary p-4">Error</div>;
  }

  return (
    <ScrollArea className="p-4">
      <div className="flex flex-col gap-4">
        {data.map((testimonial, idx) => (
          <Testimonial data={testimonial} key={idx} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default InboxArea;
