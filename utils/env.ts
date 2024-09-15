export const getAppName = (): string => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("App name is not defined in environment variables");
  return appName;
};
