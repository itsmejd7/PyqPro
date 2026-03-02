import { extractGoogleDriveFileId, isValidGoogleDriveFileId } from "@/lib/google-drive";

export const runtime = "nodejs";

function buildDriveCandidates(fileId) {
  return [
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    `https://drive.usercontent.google.com/download?export=download&id=${fileId}&confirm=t`,
    `https://drive.google.com/uc?id=${fileId}&export=download`
  ];
}

function isPdfLike(contentType) {
  const type = (contentType || "").toLowerCase();
  return type.includes("application/pdf") || type.includes("application/octet-stream");
}

async function fetchPublicDrivePdf(fileId, rangeHeader) {
  const headers = {
    Accept: "application/pdf,application/octet-stream,*/*"
  };
  if (rangeHeader) headers.Range = rangeHeader;

  const urls = buildDriveCandidates(fileId);
  let lastResponse = null;

  for (const url of urls) {
    const response = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
      cache: "no-store"
    });
    lastResponse = response;
    if (!response.ok) continue;
    if (isPdfLike(response.headers.get("content-type"))) return response;
  }

  return lastResponse;
}

function buildPdfResponseHeaders(upstreamHeaders) {
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", 'inline; filename="paper.pdf"');
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  headers.set("Accept-Ranges", "bytes");
  headers.set("X-Content-Type-Options", "nosniff");

  const passthrough = ["content-length", "content-range", "etag", "last-modified"];
  for (const key of passthrough) {
    const value = upstreamHeaders.get(key);
    if (value) {
      headers.set(key, value);
    }
  }

  return headers;
}

export async function GET(request) {
  const rawId = request.nextUrl.searchParams.get("id") || request.nextUrl.searchParams.get("fileId");
  const fileId = extractGoogleDriveFileId(rawId || "");

  if (!fileId || !isValidGoogleDriveFileId(fileId)) {
    return Response.json({ error: "Invalid or missing fileId" }, { status: 400 });
  }

  const range = request.headers.get("range") || undefined;
  const upstreamResponse = await fetchPublicDrivePdf(fileId, range);

  if (!upstreamResponse || !upstreamResponse.ok || !isPdfLike(upstreamResponse.headers.get("content-type"))) {
    return Response.json({ error: "Unable to fetch PDF from Google Drive" }, { status: 502 });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: buildPdfResponseHeaders(upstreamResponse.headers)
  });
}
