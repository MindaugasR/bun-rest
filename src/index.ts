import { Server } from "bun";
import { green } from "kolorist";
import os from "node:os";
import { Router } from "./lib/Router";

import "./routes";

const pckgFile = Bun.file("./package.json");
const pckg = await pckgFile.json();

const server = Bun.serve({
  port: 9000,
  fetch(req) {
    const url = new URL(req.url);
    const controller = Router.getController(url.pathname);
    if (controller) {
      return new Response(controller.controller());
    }

    return new Response(`Bun!`);
  },
});

const getIPs = () => {
  const networkInterfaces = os.networkInterfaces();
  const list = [];

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
};

const getListeningUrl = (hostname: string) => {
  return `${(server as Server & { protocol: number }).protocol}://${hostname}:${
    server.port
  }`;
};

const getListeningBanner = () => {
  const acc = getIPs().map((ip) => ["", getListeningUrl(ip)]);
  acc[0][0] = "Listening at";
  return acc;
};

const filler = "".padEnd(20, " ");

const info = [
  ["Bun REST", `v${pckg?.version}`],
  ["Bun version", Bun.version],
  ...getListeningBanner(),
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
