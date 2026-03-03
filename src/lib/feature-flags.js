export const featureFlags = {
  premiumEnabled: process.env.FEATURE_PREMIUM === "true",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false"
};

