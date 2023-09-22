import { Context } from "../lib";

export const user = (ctx: Context) => {
  return new Response(`user - ${ctx.params.id}`);
};
