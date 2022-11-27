import { z } from "zod";
import { getTemperature } from "../../../utils/temperature";

import { router, publicProcedure } from "../trpc";

export const temperatureRouter = router({
  get: publicProcedure
    .input(z.object({ lon: z.number(), lat: z.number() }).partial())
    .query(async ({ input }) => {
      if (!input.lon || !input.lat) return null;

      return await getTemperature(input.lon, input.lat);
    }),
});
