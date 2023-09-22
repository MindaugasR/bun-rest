import { App, Context } from "./lib";

const app = new App();
app.use((ctx: Context) => {
  ctx.headers.delete("host");
  return ctx;
});
await app.serve();
