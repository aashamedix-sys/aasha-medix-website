
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, X, Maximize, Minimize } from 'lucide-react';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ url, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/90 flex flex-col transition-all duration-300 ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}>
      {/* Controls Header */}
      <div className="bg-white rounded-t-lg p-4 flex flex-wrap items-center justify-between gap-4 border-b">
        <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-900">Medical Report Viewer</h3>
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-md p-1">
                <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut className="w-4 h-4" /></Button>
                <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.min(2.0, s + 0.1))}><ZoomIn className="w-4 h-4" /></Button>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 mr-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pageNumber <= 1} 
                    onClick={() => setPageNumber(prev => prev - 1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">Page {pageNumber} of {numPages || '--'}</span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pageNumber >= numPages} 
                    onClick={() => setPageNumber(prev => prev + 1)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="hidden md:flex">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <a href={url} download target="_blank" rel="noreferrer">
                 <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                    <Download className="w-4 h-4 mr-2" /> Download
                </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-red-500">
                <X className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 bg-gray-100 overflow-auto flex justify-center p-4 rounded-b-lg relative">
        <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-white animate-pulse">Loading secure document...</div>}
            error={<div className="text-red-500 bg-white p-4 rounded">Failed to load PDF. Please try downloading it directly.</div>}
            className="shadow-2xl"
        >
            <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                className="bg-white shadow-lg" 
            />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
