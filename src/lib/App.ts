import { Server } from "bun";
import os from "node:os";
import { green } from "kolorist";

import { Router, Context } from "./";
import { TMiddleware } from "./types";

import "../routes";

import { getStatus, getLoadingTime } from "../utils";

export class App {
  server: Server | null = null;
  middlewares: TMiddleware[] = [];

  constructor() {}
  use(fn: TMiddleware) {
    if (typeof fn !== "function")
      throw new Error("Middleware must be a function!");
    this.middlewares.push(fn);
  }
  async serve() {
    this.server = Bun.serve({
      port: 9000,
      fetch: async (req: Request, server: Server) => {
        let response: Response;
        const start = Bun.nanoseconds();
        let ctx = new Context(req, server);

        if (this.middlewares.length > 0) {
          for (let i = 0; i < this.middlewares.length; i++) {
            const fn = this.middlewares[i];
            const result = fn(ctx);
            if (result instanceof Context) {
              ctx = result;
            } else if (!result) {
              return new Response("", { status: 400 });
            }
          }
        }

        response = await Router.handle(ctx);
        if (!response) {
          response = new Response("Page not found", { status: 404 });
        }

        const time = Bun.nanoseconds() - start;
        const msg = `${getStatus(ctx.res?.status)} ${green(ctx.req.method)} ${
          ctx.url.pathname
        } ${getLoadingTime(time)}\n`;
        console.log(msg);

        return response;
      },
      error(error: Error) {
        console.log(error);

        return new Response("❌" + error.toString(), { status: 500 });
      },
    });

    const filler = "".padEnd(20, " ");
    const info = [
      ["Bun REST", `v0.1`],
      ["Bun version", Bun.version],
      ...this.getListeningBanner(),
      ["Web server root", import.meta.dir],
      ["Index file", import.meta.file],
      ["HTTPS", "enabled"],
      ["Gzip", "enabled"],
      ["Cache (max-age)", "disabled"],
      ["Micro-cache", "100 s"],
      ["History mode", "enabled"],
      ["CORS", "enabled"],
      ["Proxy definitions", "*"],
    ].map(
      (msg) =>
        " " +
        (msg[0] !== "" ? msg[0].padEnd(20, ".") : filler) +
        " " +
        green(msg[1])
    );

    console.log("\n" + info.join("\n") + "\n");
  }

  private getListeningBanner() {
    const acc = this.getIPs().map((ip) => ["", this.getListeningUrl(ip)]);
    acc[0][0] = "Listening at";
    return acc;
  }
  getListeningUrl(hostname: string) {
    return `${
      (this.server as Server & { protocol: number }).protocol
    }://${hostname}:${this.server?.port}`;
  }
  getIPs() {
    const networkInterfaces = os.networkInterfaces();
    const list: string[] = [];

    for (const deviceName of Object.keys(networkInterfaces)) {
      const networkInterface = networkInterfaces[deviceName];
      if (networkInterface) {
        for (const networkAddress of networkInterface) {
          if (networkAddress.family === "IPv4") {
            list.push(networkAddress.address);
          }
        }
      }
    }

    return list;
  }
}
