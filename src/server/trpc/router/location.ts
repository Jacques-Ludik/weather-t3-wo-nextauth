import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const locationRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.location.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        lon: z.number(),
        lat: z.number(),
        temp: z.number(),
        description: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.location.create({
        data: {
          lon: input.lon,
          lat: input.lat,
          temp: input.temp,
          description: input.description,
        },
      });
    }),
});
