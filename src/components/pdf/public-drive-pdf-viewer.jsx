"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PublicDrivePdfViewer({ fileId }) {
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(900);
  const containerRef = useRef(null);

  const apiUrl = useMemo(() => `/api/pdf?id=${encodeURIComponent(fileId)}`, [fileId]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const resize = () => {
      const width = containerRef.current?.clientWidth || 900;
      setPageWidth(Math.max(280, Math.min(900, width - 16)));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Document
        file={apiUrl}
        onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
        loading={<p className="text-base text-slate-500">Loading PDF...</p>}
        error={<p className="text-base text-slate-500">Could not load PDF.</p>}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
