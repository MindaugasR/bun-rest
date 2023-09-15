export const Routes = {};
export type routeType = {
  controller?: unknown;
};

export class Router {
  static routesList: { [key: string]: routeType } = {};

  static get(path: string, middleware?: unknown, controller?: unknown) {
    this.routesList[path] = {
      controller: this.assignController(middleware, controller),
    };

    return this.routesList[path];
  }

  static routes() {
    return this.routesList;
  }

  static getController(path: string) {
    return this.routesList[path] ?? false;
  }

  private static assignController(middleware: unknown, controller: unknown) {
    return typeof controller === "function"
      ? controller
      : typeof middleware === "function"
      ? middleware
      : null;
  }
}
