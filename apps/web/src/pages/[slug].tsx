/* eslint-disable react/jsx-no-comment-textnodes */

import { Button } from "@/components/ui/button";
import { getImage } from "@/storage";
import { PencilIcon } from "lucide-react";
import type { GetServerSideProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Image from "next/image";
import { useState, type FC } from "react";
import { appRouter } from "@/server/api/root";
import SuperJSON from "superjson";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import Head from "next/head";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Rating from "@/components/Rating";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

type Props = {
  data:
    | ({
        questions: {
          index: number;
          content: string;
        }[];
        icon: {
          path: string;
        } | null;
      } & {
        id: string;
        slug: string;
        userId: string;
        name: string;
        header_title: string;
        customMessage: string;
        iconId: string | null;
        createdAt: Date;
        updatedAt: Date;
      })
    | null;
  error: string | null;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await getServerAuthSession({ req, res });
  const { slug } = params as { slug: string };

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session,
      db,
    },
    transformer: SuperJSON,
  });
  const response: Props = { data: null, error: null };
  try {
    response.data = await helpers.grids.getPublic.fetch({ slug });
  } catch (e: unknown) {
    const err = e as Error;
    response.error = err.message;
  }
  return {
    props: JSON.parse(JSON.stringify(response)) as Props,
  };
};

const Public: FC<Props> = ({ data: GridData, error }) => {
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const sendTestimonial = api.textTestimonials.post.useMutation();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be atleast 3 characters." })
      .max(50, { message: "Name must be at most 50 characters." }),
    email: z.string().email({ message: "Must be a valid email" }),
    isPublic: z.boolean(),
    message: z
      .string()
      .min(10, { message: "Message must be atleast 10 characters." })
      .max(500, { message: "Message must be atmost 500 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  if (GridData === null || error !== null) {
    if (GridData === null) return <h1>Grid not found</h1>;
    return <h1>Error</h1>;
  }

  const onSubmit = form.handleSubmit(async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await sendTestimonial.mutateAsync({
        content: data.message,
        email: data.email,
        hasPublicConsent: data.isPublic,
        name: data.name,
        rating,
        gridId: GridData.id,
      });
      toast({
        title: "Testimonial sent 🎉",
      });
      form.reset();
    } catch (e) {
      toast({
        title: "Failed to send testimonial 😔",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Head>
        <title>give a testimonial to {GridData.name}</title>
        <meta name="description" content="Easy testimonials collection" />
        <link
          rel="icon"
          href={getImage(GridData.icon?.path as unknown as string)}
        />
      </Head>
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <Image
          src={getImage(GridData.icon?.path as unknown as string)}
          width={100}
          height={100}
          alt={GridData.name}
        />
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-6xl font-semibold text-foreground">
              {GridData.header_title}
            </h1>
            <p className="text-2xl opacity-70">{GridData.customMessage}</p>
          </div>
          <div className="flex flex-col gap-4 self-start">
            <div>
              <h2 className="text-lg font-bold">QUESTIONS</h2>
              <div className="h-[4px] w-[50px] bg-primary"></div>
            </div>
            <ul className="opacity-70">
              {GridData.questions.map((question, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-lg font-semibold">&#x2022;</span>
                  <p className="text-lg">{question.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button className="p-8 text-xl">
              <PencilIcon className="mr-4" />
              Send in text
            </Button>
          </DialogTrigger>
          <DialogContent className="mb-10 max-h-[90%] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>
                Write a text testimonial to {GridData.name}
              </DialogTitle>
              <Image
                src={getImage(GridData.icon?.path as unknown as string)}
                height={50}
                width={50}
                className="rounded-lg shadow-md"
                alt={GridData.name}
              />
            </DialogHeader>
            <div className="flex flex-col gap-4 self-start">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Questions</h2>
                <div className="h-[4px] w-[50px] bg-primary"></div>
              </div>
              <ul className="opacity-70">
                {GridData.questions.map((question, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-md font-semibold">&#x2022;</span>
                    <p className="text-md">{question.content}</p>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <Rating currRating={rating} setRating={setRating} />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Write a cheerful message :D</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Good" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your good name</FormLabel>
                      <FormControl>
                        <Input placeholder="probablyarth" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="probablyarth@gmail.com"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I give permission to use this testimonial across
                          social channels and other marketing efforts
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  Send
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Public;
