import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TestimonialType } from "@/type/testimonials";

export const testimonialsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ type: z.nativeEnum(TestimonialType), slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.textTestimonial.findMany({
        where: {
          grid: {
            slug: input.slug,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
