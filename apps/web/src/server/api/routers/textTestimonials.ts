import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const textTestimonialsRouter = createTRPCRouter({
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const testimonial = await ctx.db.textTestimonial.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!testimonial) return new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.textTestimonial.update({
        where: {
          id: input.id,
        },
        data: {
          liked: !testimonial.liked,
        },
      });
    }),

  get: protectedProcedure
    .input(z.object({ gridId: z.string() }))
    .query(async ({ ctx, input }) => {
      const grid = await ctx.db.grid.findUnique({
        where: {
          id: input.gridId,
        },
      });
      if (!grid) return new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.textTestimonial.findMany({
        where: {
          gridId: input.gridId,
        },
      });
    }),

  post: publicProcedure
    .input(
      z.object({
        rating: z.number().min(1).max(5),
        hasPublicConsent: z.boolean(),
        content: z.string(),
        name: z.string(),
        email: z.string(),
        gridId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const grid = await ctx.db.grid.findUnique({
        where: {
          id: input.gridId,
        },
      });
      if (!grid) return new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.textTestimonial.create({
        data: {
          rating: input.rating,
          hasPublicConsent: input.hasPublicConsent,
          content: input.content,
          name: input.name,
          email: input.email,
          gridId: input.gridId,
        },
      });
    }),
});
