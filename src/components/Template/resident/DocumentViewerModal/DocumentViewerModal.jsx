"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import classes from "./styles.module.css";
import { LuDownload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "@/resources/hooks/useTranslations";
import dynamic from "next/dynamic";
import { renderAsync } from "docx-preview";
import useDimensions from "@/resources/hooks/useDimensions";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import { imageUrl } from "@/resources/utils/helper";

const Document = dynamic(
  () => import("react-pdf").then((mod) => ({ default: mod.Document })),
  {
    ssr: false,
    loading: () => <div>Loading PDF...</div>,
  }
);

const Page = dynamic(
  () => import("react-pdf").then((mod) => ({ default: mod.Page })),
  {
    ssr: false,
  }
);

export default function DocumentViewerModal({
  show,
  setShow,
  document,
  docName = "",
}) {
  const t = useTranslations();
  const [numPages, setNumPages] = useState(1);
  const docxContainerRef = useRef(null);
  const { width } = useDimensions();
  const [isClient, setIsClient] = useState(false);

  // Extract file type from document filename
  const fileType = useMemo(() => {
    if (!document) return "pdf";
    const extension = document.split(".").pop()?.toLowerCase();
    return extension === "docx" ? "word" : "pdf";
  }, [document]);

  // Ensure component only renders PDF on client side
  useEffect(() => {
    setIsClient(true);

    // Initialize PDF.js worker only on client side
    if (typeof window !== "undefined") {
      import("react-pdf").then(({ pdfjs }) => {
        const workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      });
    }
  }, []);

  // Use the document prop to determine file URL
  const FILE_URL = imageUrl(document);

  const isWord = fileType === "word";
  const isPdf = fileType === "pdf";

  // Memoize file prop for Document to avoid unnecessary reloads
  const pdfFileProp = useMemo(() => FILE_URL, [FILE_URL]);

  useEffect(() => {
    if (!isWord || !docxContainerRef.current || !isClient || !document) return;

    const controller = new AbortController();
    const el = docxContainerRef.current;
    el.innerHTML = "";

    fetch(FILE_URL, { cache: "no-store", signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`DOCX fetch ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("wordprocessingml") && !FILE_URL.endsWith(".docx")) {
          throw new Error("Not a .docx response");
        }
        return res.blob();
      })
      .then((blob) => renderAsync(blob, el, undefined, { inWrapper: true }))
      .catch((e) => {
        if (e.name === "AbortError") return;
        el.innerHTML =
          '<div style="color:red;text-align:center;">Failed to load DOCX. Please check file.</div>';
        console.error("DOCX load error:", e);
      });

    return () => controller.abort();
  }, [isWord, isClient, FILE_URL, document]);

  const handleDownload = () => {
    if (typeof window === "undefined" || !document) return;

    const a = window.document.createElement("a");
    a.href = FILE_URL;
    a.target = "_blank";
    const downloadFilename = docName || document;
    a.download = downloadFilename;
    window.document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getFileTypeDisplay = () => {
    return fileType === "pdf" ? "PDF Document" : "Word Document";
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!show) return null;

  const modalContent = (
    <div className={classes.modalOverlay} onClick={handleBackdropClick}>
      <div className={classes.modalContainer}>
        {/* Modal Header */}
        <div className={classes.modalHeader}>
          <div className={classes.headerLeft}>
            <div className={classes.iconContainer}>
              <Image
                src="/svg/blueDocumentIcon.svg"
                width={24}
                height={24}
                alt="document"
              />
            </div>
            <div className={classes.headerInfo}>
              <h2 className={classes.documentTitle}>{getFileTypeDisplay()}</h2>
              <div className={classes.documentName}>
                {docName || document || "Document"}
              </div>
            </div>
          </div>
          <div className={classes.headerActions}>
            <Button
              variant="primary"
              leftIcon={<LuDownload size={18} color="#fff" />}
              label={t("designGuidline.download") || "Download"}
              className={classes.downloadBtn}
              onClick={handleDownload}
            />
            <button
              className={classes.closeButton}
              onClick={handleClose}
              aria-label="Close modal"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className={classes.modalContent}>
          <div className={classes.documentViewer}>
            {isPdf && isClient && document && (
              <Document
                key="pdf"
                file={pdfFileProp}
                crossOrigin="anonymous"
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(e) => console.error("PDF load error:", e)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={`p${i}`} className={classes.pageFrame}>
                    <Page
                      pageNumber={i + 1}
                      width={
                        width < 500
                          ? width - 100
                          : width < 900
                          ? width - 200
                          : 600
                      }
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            )}

            {isPdf && !isClient && (
              <div className={classes.pageFrame}>
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  {t("DocumentViewerPage.loadingPDF")}
                </div>
              </div>
            )}

            {isWord && (
              <div
                className={classes.pageFrame}
                style={{
                  width: "100%",
                  margin: "0 auto",
                }}
              >
                <div
                  key="docx"
                  ref={docxContainerRef}
                  className={classes.docxPreview}
                />
              </div>
            )}

            {!document && (
              <div className={classes.noDocument}>
                <div className={classes.noDocumentIcon}>
                  <Image
                    src="/svg/blueDocumentIcon.svg"
                    width={48}
                    height={48}
                    alt="No document"
                  />
                </div>
                <p>{t("DocumentViewerPage.documentProvided")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, window.document.body)
    : null;
}
