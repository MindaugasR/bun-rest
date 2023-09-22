import type { Server } from "bun";

export type Method =
  | "ANY"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export class Context {
  req: Request;
  res: Response | null;
  server: Server;
  method: Method;
  host: string;
  path: string;
  headers: Headers;
  url: URL;
  query: URLSearchParams;
  params: { [key: string]: string };

  constructor(req: Request, server: Server) {
    this.req = req;
    this.server = server;
    this.res = null;
    const url = new URL(req.url);
    this.method = req.method as Method;
    this.headers = req.headers;
    this.host = url.host;
    this.path = url.pathname;
    this.url = url;
    this.query = url.searchParams;
    this.params = {};
  }
}
