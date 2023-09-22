import { green, yellow, red } from "kolorist";

export const getLoadingTime = (time: number) => {
  const ms = time / 1_000_000;
  let output = "";
  if (ms <= 50) {
    output = green(`${ms.toFixed(2)}ms`);
  } else if (ms > 50 && ms <= 100) {
    output = yellow(`${ms.toFixed(2)}ms`);
  } else if (ms > 100) {
    output = red(`${ms.toFixed(2)}ms`);
  }

  return output;
};
