export const getAbsolutePath = (pathParam) => {
  return path.isAbsolute(pathParam)
    ? pathParam
    : path.join(process.cwd(), pathParam);
};
