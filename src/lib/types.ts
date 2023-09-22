import { Context } from ".";

export type TMiddleware = (ctx: Context) => boolean | Context;

export type TRouteCallback = (
  ctx?: Context,
  res?: Response
) => Response | Promise<Response>;

export type TRoute = {
  path: string;
  name?: string;
  regexp?: RegExp;
  middlewares?: null | TRouteCallback[];
  controller?: null | TRouteCallback;
};
export type TRouteArg = [
  path: string | TRoute,
  middleware?: TRouteCallback[] | TRouteCallback,
  controller?: TRouteCallback
];
