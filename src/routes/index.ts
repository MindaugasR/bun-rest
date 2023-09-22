import { Router } from "../lib";
import { home, about, user } from "../controllers";

Router.get("/", () => {
  return new Response("Dashboard");
});
Router.get("/home", home);
Router.get({ path: "/about" }, about);
Router.get("/user/:id", user);
