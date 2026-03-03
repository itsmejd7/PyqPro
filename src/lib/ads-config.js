export const adNetworkConfig = {
  network: process.env.NEXT_PUBLIC_AD_NETWORK || "adsense",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false"
};

export const AD_POSITIONS = Object.freeze({
  HOME_BELOW_HERO: "HOME_BELOW_HERO",
  HOME_BETWEEN_BRANCH_GRID: "HOME_BETWEEN_BRANCH_GRID",
  SUBJECT_BELOW_TITLE: "SUBJECT_BELOW_TITLE",
  SUBJECT_AFTER_LIST_6: "SUBJECT_AFTER_LIST_6",
  SUBJECT_BEFORE_FOOTER: "SUBJECT_BEFORE_FOOTER",
  PDF_MOBILE_BOTTOM_BANNER: "PDF_MOBILE_BOTTOM_BANNER",
  PDF_DESKTOP_SIDEBAR: "PDF_DESKTOP_SIDEBAR"
});

export const adSlotConfig = {
  [AD_POSITIONS.HOME_BELOW_HERO]: {
    key: "home-below-hero",
    label: "Sponsored",
    minHeightClass: "min-h-[96px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_HOME_BELOW_HERO || ""
  },
  [AD_POSITIONS.HOME_BETWEEN_BRANCH_GRID]: {
    key: "home-between-branch-grid",
    label: "Sponsored",
    minHeightClass: "min-h-[96px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_HOME_BETWEEN_GRID || ""
  },
  [AD_POSITIONS.SUBJECT_BELOW_TITLE]: {
    key: "subject-below-title",
    label: "Sponsored",
    minHeightClass: "min-h-[96px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_SUBJECT_BELOW_TITLE || ""
  },
  [AD_POSITIONS.SUBJECT_AFTER_LIST_6]: {
    key: "subject-after-list-6",
    label: "Sponsored",
    minHeightClass: "min-h-[96px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_SUBJECT_AFTER_LIST || ""
  },
  [AD_POSITIONS.SUBJECT_BEFORE_FOOTER]: {
    key: "subject-before-footer",
    label: "Sponsored",
    minHeightClass: "min-h-[96px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_SUBJECT_BEFORE_FOOTER || ""
  },
  [AD_POSITIONS.PDF_MOBILE_BOTTOM_BANNER]: {
    key: "pdf-mobile-bottom-banner",
    label: "Sponsored",
    minHeightClass: "min-h-[84px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_PDF_MOBILE_BOTTOM || ""
  },
  [AD_POSITIONS.PDF_DESKTOP_SIDEBAR]: {
    key: "pdf-desktop-sidebar",
    label: "Sponsored",
    minHeightClass: "min-h-[300px]",
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_PDF_DESKTOP_SIDEBAR || ""
  }
};
