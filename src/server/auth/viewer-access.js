import { VIEWER_PLAN } from "@/lib/access-control";
import { featureFlags } from "@/lib/feature-flags";

export async function getAuthenticatedUser() {
  return null;
}

export async function getViewerAccess() {
  const user = await getAuthenticatedUser();
  const isPremium = Boolean(featureFlags.premiumEnabled && user?.isPremium);

  return {
    plan: isPremium ? VIEWER_PLAN.PREMIUM : VIEWER_PLAN.FREE,
    userId: user?.id || null
  };
}

