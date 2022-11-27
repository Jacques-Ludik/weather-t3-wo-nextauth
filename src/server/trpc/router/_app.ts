import { router } from "../trpc";
import { locationRouter } from "./location";
import { temperatureRouter } from "./temperature";

export const appRouter = router({
  location: locationRouter,
  temperature: temperatureRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
