export const appConfig = {
  appUrl: () =>
    (process.env.APP_URL || 'http://localhost:3001')
      .replace(/['";\s]/g, '') //strips quotes, semicolons, and whitespace
      .replace(/\/$/, ''), // strips trailing slash

  uploadsPath: (folder: string, filename: string) =>
    `${appConfig.appUrl()}/uploads/${folder}/${filename}`,
};
