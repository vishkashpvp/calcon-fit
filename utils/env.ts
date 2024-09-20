const getError = (variable: string) => `${variable} is not defined in environment variables`;

export const getAppName = (): string => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error(getError("NEXT_PUBLIC_APP_NAME"));
  return appName;
};

export const getMongoDbUri = (): string => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error(getError("MONGODB_URI"));
  return uri;
};
