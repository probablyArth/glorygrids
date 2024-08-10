import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import slugify from "slugify";

export const gridsRouter = createTRPCRouter({
  getPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.grid.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          icon: {
            select: {
              path: true,
            },
          },
          questions: {
            orderBy: {
              index: "asc",
            },
            select: {
              content: true,
              index: true,
            },
          },
        },
      });
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.grid.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          icon: {
            select: {
              path: true,
            },
          },
          questions: {
            orderBy: {
              index: "asc",
            },
          },
        },
      });
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.grid.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        icon: {
          select: {
            path: true,
          },
        },
        _count: {
          select: {
            textTestimonials: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  post: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        header: z.string(),
        customMessage: z.string(),
        questions: z.array(z.string()),
        iconStorageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        const baseSlug = slugify(input.title, { lower: true });
        let uniqueSlug = baseSlug;
        let count = Math.floor(Math.random() * 9);

        while (
          (await tx.grid.findUnique({ where: { slug: uniqueSlug } })) &&
          uniqueSlug !== "dashboard"
        ) {
          uniqueSlug = `${baseSlug}${count}`;
          count += Math.floor(Math.random() * 9);
        }

        const photo = await tx.photo.create({
          data: { path: input.iconStorageId },
        });
        const grid = await tx.grid.create({
          data: {
            slug: uniqueSlug,
            userId: ctx.session.user.id,
            customMessage: input.customMessage,
            name: input.title,
            header_title: input.header,
            iconId: photo.id,
          },
        });
        for (const [idx, question] of input.questions.entries()) {
          await tx.questions.create({
            data: {
              gridId: grid.id,
              content: question,
              index: idx,
            },
          });
        }
      });
    }),
});
