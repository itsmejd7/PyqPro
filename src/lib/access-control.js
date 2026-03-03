export const ACCESS_TYPE = Object.freeze({
  FREE: "FREE",
  PREMIUM: "PREMIUM"
});

export const VIEWER_PLAN = Object.freeze({
  FREE: "FREE",
  PREMIUM: "PREMIUM"
});

export function listAccessibleAccessTypes(viewerPlan) {
  if (viewerPlan === VIEWER_PLAN.PREMIUM) {
    return [ACCESS_TYPE.FREE, ACCESS_TYPE.PREMIUM];
  }
  return [ACCESS_TYPE.FREE];
}

export function shouldShowAds(viewerPlan) {
  return viewerPlan !== VIEWER_PLAN.PREMIUM;
}

