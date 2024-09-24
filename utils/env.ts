const getError = (variable: string) => `${variable} is not defined in environment variables`;

const getEnvVar = (variable: string): string => {
  const result = process.env[variable];
  if (!result) throw new Error(getError(variable));
  return result;
};

export const getAppName = () => getEnvVar("NEXT_PUBLIC_APP_NAME");
export const getMongoDbUri = () => getEnvVar("MONGODB_URI");
export const getAuthSecret = () => getEnvVar("AUTH_SECRET");
