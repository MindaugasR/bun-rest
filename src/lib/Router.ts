import { Context } from ".";
import { red } from "kolorist";
import { pathToRegexp, match, parse, compile } from "path-to-regexp";

import { TRouteArg, TRoute, TRouteCallback } from "./types";

export const Router = {
  routeList: {} as { [key: string]: Route },
  async handle(ctx: Context) {
    const { route, params } = this.findRoute(ctx.url.pathname);
    if (route && route.route?.controller) {
      if (Object.keys(params)) {
        ctx.params = params;
      }
      ctx.res = await route.route.controller(ctx);
    } else if (!route || !route?.route?.controller) {
      ctx.res = new Response("", { status: 404 });
    } else {
      ctx.res = new Response("", { status: 400 });
    }

    return ctx.res;
  },
  findRoute(path: string): {
    route: Route | null;
    params: { [key: string]: string };
  } {
    let route: null | Route = null;
    let params = {};
    Object.keys(this.routeList).forEach((p) => {
      const fn = match(p, { decode: decodeURIComponent });
      const result = fn(path);
      if (result) {
        route = this.routeList[p];
        params = result.params;
      }
    });

    return { route, params };
  },
  get(...args: TRouteArg) {
    let path = "";

    if (args.length <= 0) {
      throw new Error(
        [red("⚠"), "Path should be set as first argument"].join(" ")
      );
    }
    const controller =
      args.length === 2
        ? (args[1] as TRouteCallback)
        : args.length === 3
        ? (args[2] as TRouteCallback)
        : undefined;
    const middlewares =
      args.length === 3 ? this.assignMiddlewares(args[1]) : [];

    if (typeof args[0] === "string") {
      path = args[0];
      this.routeList[path] = new Route({ path: path }, middlewares, controller);
    } else if (args[0].path) {
      path = args[0].path;
      this.routeList[path] = new Route(args[0], middlewares, controller);
    } else {
      throw new Error(
        [red("⚠"), 'Path should be set in obejct with key "path"'].join(" ")
      );
    }
    return this.routeList[path];
  },
  assignMiddlewares(middlewares: TRouteArg[1]) {
    if (!middlewares) {
      return [];
    }
    return [middlewares].flat();
  },
};

export class Route {
  route = {
    path: "",
    name: "",
    regexp: undefined,
    middlewares: undefined,
    controller: undefined,
  } as TRoute;
  constructor(
    args: TRoute,
    middlewares?: TRouteCallback[],
    controller?: TRouteCallback
  ) {
    if (!args.path) {
      throw new Error([red("⚠"), "Path should be set"].join(" "));
    }
    this.route.path = args.path;
    this.route.regexp = pathToRegexp(args.path);

    if (middlewares && middlewares.length > 0) {
      this.route.middlewares = middlewares;
    }
    if (controller && typeof controller === "function") {
      this.route.controller = controller;
    }
    return this;
  }

  name(name: string) {
    this.route.name = name;
    return this;
  }
}
