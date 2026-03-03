export const defaultResourceTypeOrder = ["PYQ", "SOLVED", "NOTES"];

export const resourceTypeLabels = {
  PYQ: "PYQs",
  SOLVED: "Solved Papers",
  NOTES: "Notes"
};

export const resourceTypeBadgeLabels = {
  PYQ: "PYQ",
  SOLVED: "Solved",
  NOTES: "Notes"
};

export function normalizeResourceType(value) {
  return String(value || "").trim().toUpperCase();
}

export function formatResourceTypeLabel(resourceType) {
  const normalized = normalizeResourceType(resourceType);
  if (!normalized) return "Resources";
  return resourceTypeLabels[normalized] || normalized;
}

export function formatResourceTypeBadge(resourceType) {
  const normalized = normalizeResourceType(resourceType);
  if (!normalized) return "Resource";
  return resourceTypeBadgeLabels[normalized] || normalized;
}

export function sortResourceTypes(resourceTypes) {
  const unique = [...new Set(resourceTypes.map(normalizeResourceType).filter(Boolean))];
  return unique.sort((a, b) => {
    const aIndex = defaultResourceTypeOrder.indexOf(a);
    const bIndex = defaultResourceTypeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}
