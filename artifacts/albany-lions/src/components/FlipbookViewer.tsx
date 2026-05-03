import { useState, useRef, forwardRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, Loader2, Download, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipPage = forwardRef<
  HTMLDivElement,
  { pageNumber: number; pageWidth: number; pageHeight: number }
>(({ pageNumber, pageWidth, pageHeight }, ref) => (
  <div
    ref={ref}
    className="bg-white overflow-hidden select-none"
    style={{ width: pageWidth, height: pageHeight }}
  >
    <Page
      pageNumber={pageNumber}
      width={pageWidth}
      renderTextLayer={false}
      renderAnnotationLayer={false}
      loading={
        <div
          className="w-full bg-gray-50 flex items-center justify-center"
          style={{ height: pageHeight }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
        </div>
      }
    />
  </div>
));
FlipPage.displayName = "FlipPage";

interface FlipbookViewerProps {
  pdfUrl: string;
  title: string;
}

export function FlipbookViewer({ pdfUrl, title }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  const PAGE_W = isMobile ? Math.min(window.innerWidth - 32, 360) : 420;
  const PAGE_H = Math.round(PAGE_W * (11 / 8.5));

  const goToPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);
  const goToNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);

  const totalShown = isMobile ? 1 : 2;
  const endPage = Math.min(currentPage + totalShown, numPages ?? 1);
  const pageLabel = numPages
    ? currentPage + 1 < endPage
      ? `Pages ${currentPage + 1}–${endPage} of ${numPages}`
      : `Page ${currentPage + 1} of ${numPages}`
    : "";

  return (
    <div className="flex flex-col bg-[#1a1a2e]" style={{ minHeight: "calc(100vh - 160px)" }}>
      {/* Top toolbar */}
      <div className="bg-[#16213e] px-5 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-4 w-4 text-secondary shrink-0" />
          <span className="text-white font-semibold text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={pdfUrl} download>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1.5 h-8"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </a>
          <a href={pdfUrl} target="_blank" rel="noreferrer">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1.5 h-8"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open PDF</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Flipbook area */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 relative overflow-x-auto">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-white">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            <p className="text-sm text-white/50">Loading magazine…</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-white text-center py-16">
            <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="font-semibold mb-1">Couldn't load the PDF</p>
            <p className="text-white/50 text-sm">Try the "Open PDF" button above.</p>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setLoading(false);
          }}
          onLoadError={() => {
            setError(true);
            setLoading(false);
          }}
          loading={null}
        >
          {numPages && !error && (
            // @ts-ignore – react-pageflip 2.x has loose typings
            <HTMLFlipBook
              key={isMobile ? "portrait" : "landscape"}
              ref={bookRef}
              width={PAGE_W}
              height={PAGE_H}
              size="fixed"
              minWidth={200}
              maxWidth={PAGE_W}
              minHeight={300}
              maxHeight={PAGE_H}
              showCover={true}
              flippingTime={800}
              usePortrait={isMobile}
              drawShadow={true}
              useMouseEvents={true}
              mobileScrollSupport={false}
              clickEventForward={true}
              showPageCorners={!isMobile}
              disableFlipByClick={false}
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
              className=""
              startPage={0}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.6}
              swipeDistance={30}
              onFlip={(e: any) => setCurrentPage(e.data)}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <FlipPage
                  key={i}
                  pageNumber={i + 1}
                  pageWidth={PAGE_W}
                  pageHeight={PAGE_H}
                />
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* Bottom navigation */}
      {numPages && !loading && !error && (
        <div className="bg-[#16213e] border-t border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-white/50 text-xs text-center">{pageLabel}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            disabled={currentPage >= numPages - (isMobile ? 1 : 2)}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5 disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
