import { Router } from "../lib/Router";
import { home, about } from "../controllers";

Router.get("/", home);
Router.get("/about", about);
