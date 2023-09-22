import { blue, green, red } from "kolorist";

export const getStatus = (status?: number) => {
  if (status) {
    if (status >= 100 && status <= 199) {
      return blue(`[${status}]`);
    } else if (status >= 200 && status <= 299) {
      return green(`[${status}]`);
    } else if (status >= 400 && status <= 599) {
      return red(`[${status}]`);
    }
  }

  return "";
};
