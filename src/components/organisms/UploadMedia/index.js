import React, { useRef, useState } from "react";
import classes from "./UploadMedia.module.css";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslations } from "@/resources/hooks/useTranslations";

// Stateless, controlled upload component
export default function UploadMedia({
  files = [],
  handleFileChange = () => {},
  handleRemoveFile = () => {},
  error = "",
  multiple = false,
  accept = "*",
  maxFiles = 1,
  maxSizeMB = 5,
  fileDisplayName = "",
  onValidationFail = () => {},
  uploadMessage,
}) {
  const t = useTranslations("uploadMedia");
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");

  const openPicker = () => inputRef.current?.click();

  const validateAndApply = (selected) => {
    if (!selected.length) return;
    let filtered = selected;
    // size check
    const oversize = selected.find((f) => f.size / 1024 / 1024 > maxSizeMB);
    if (oversize) {
      const msg = t("errors.fileSizeExceeded", {
        fileName: oversize.name,
        maxSize: maxSizeMB,
      });
      setLocalError(msg);
      onValidationFail(msg);
      return;
    }
    // count check
    const existingCount = files.length;
    const allowedRemaining = maxFiles - existingCount;
    if (allowedRemaining <= 0) {
      const msg = t("errors.maxFilesReached", { maxFiles });
      setLocalError(msg);
      onValidationFail(msg);
      return;
    }
    if (filtered.length > allowedRemaining) {
      filtered = filtered.slice(0, allowedRemaining);
      const msg = t("errors.tooManyFiles", { allowedRemaining });
      setLocalError(msg);
      onValidationFail(msg);
    } else {
      setLocalError("");
    }
    handleFileChange(multiple ? filtered : [filtered[0]]);
  };

  const onChange = (e) => {
    const selected = Array.from(e.target.files || []);
    validateAndApply(selected);
  };

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e) => {
    prevent(e);
    setDragActive(true);
  };
  const onDragOver = (e) => {
    prevent(e);
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    prevent(e);
    setDragActive(false);
  };
  const onDrop = (e) => {
    prevent(e);
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    validateAndApply(dropped);
  };

  return (
    <div className={classes.uploadContainer}>
      <div
        className={`${classes.dragAndDropContainer} ${
          dragActive ? classes.dragActive : ""
        }`}
        onClick={openPicker}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
      >
        <div className={classes.dragAndDropMessage}>
          <Image
            src="/svg/Image.svg"
            alt={t("uploadIconAlt")}
            width={43}
            height={43}
          />
          <p>{uploadMessage || t("uploadMessage")}</p>
          <h1>{t("fileFormats")}</h1>
        </div>
        <input
          ref={inputRef}
          hidden
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={onChange}
        />
      </div>
      {files?.length > 0 && (
        <div className={classes.filePreview}>
          {files?.map((file, idx) => {
            const displayName = (() => {
              if (!file) return "";
              if (typeof file === "string") {
                // attempt to derive human-readable name from key/path
                const parts = file.split("/");
                return parts[parts.length - 1] || file;
              }
              if (file.name) return file.name;
              if (file.key) return file.key.split("/").pop();
              return t("defaultFileName");
            })();
            return (
              <div key={idx} className={classes.fileItem}>
                <span>{fileDisplayName ? fileDisplayName : displayName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className={classes.removeFileButton}
                >
                  <IoMdCloseCircle color="red" size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {(error || localError) && (
        <p className={classes.error}>*{error || localError}</p>
      )}
    </div>
  );
}
