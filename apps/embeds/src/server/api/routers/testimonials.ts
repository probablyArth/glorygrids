import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const testimonialsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const testimonials = await ctx.db.textTestimonial.findMany({
        where: {
          grid: {
            slug: input.slug,
          },
          hasPublicConsent: true,
        },
      });

      return testimonials;
    }),
});
