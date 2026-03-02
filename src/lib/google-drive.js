const FILE_ID_PATTERN = /^[a-zA-Z0-9_-]{10,}$/;

export function isValidGoogleDriveFileId(fileId) {
  return FILE_ID_PATTERN.test(fileId || "");
}

export function extractGoogleDriveFileId(input) {
  if (!input) return null;

  const trimmed = input.trim();
  if (isValidGoogleDriveFileId(trimmed)) return trimmed;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /\/d\/([a-zA-Z0-9_-]{10,})/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
}
