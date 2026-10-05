"use client";

import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import RenderStatusCell from "@/components/organisms/AppTable/tableHelper";
import { statusTranslations } from "@/constants/status";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDirection from "@/resources/hooks/useDirection";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { imageUrl } from "@/resources/utils/helper";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { HiOutlineDocumentText, HiOutlineEye, HiOutlineHome, HiOutlineUser } from "react-icons/hi2";
import { IoChevronBack } from "react-icons/io5";
import { LuDoorClosed } from "react-icons/lu";
import {
  asText,
  capitalizeFirst,
  documentKey,
  formatReported,
  isImageFile,
  houseValue,
  jobTitle,
  personName,
  placeLabel,
  roomValue,
} from "../MaintenanceRequests/jobFormat";
import styles from "./styles.module.css";

function AttachmentItem({ doc, t, size = "desktop" }) {
  const src = imageUrl(documentKey(doc));
  const [showAsImage, setShowAsImage] = useState(isImageFile(doc));

  if (!showAsImage) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        aria-label={t("detail.view")}
        className={size === "desktop" ? styles.documentTile : styles.documentTileMobile}
      >
        <span className={styles.docMark}>
          <HiOutlineDocumentText size={22} />
        </span>
        <span className={styles.docCopy}>
          <strong>{t("viewModal.attachment")}</strong>
          <em>{t("detail.view")}</em>
        </span>
        <span className={styles.viewBtn}>
          <HiOutlineEye size={16} />
        </span>
      </a>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className={size === "desktop" ? styles.desktopPhoto : styles.photo}
    >
      <img src={src} alt="" onError={() => setShowAsImage(false)} />
    </a>
  );
}

export default function MaintenanceRequestDetail({ slug }) {
  const t = useTranslations("maintenance.maintenanceRequests");
  const locale = useLocale();
  const dir = useDirection();
  const router = useRouter();
  const { Get } = useAxios();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState("loading");

  const loadRequest = async () => {
    const { response } = await Get({
      route: `maintenance-request/my/detail/${slug}`,
      showAlert: false,
    });
    return response?.data || null;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading("loading");
      const data = await loadRequest();
      if (cancelled) return;
      setRequest(data);
      setLoading("");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const house = placeLabel(t("jobs.house"), houseValue(request));
  const room = placeLabel(t("jobs.room"), roomValue(request, locale));
  const person = personName(request, locale);
  const title = jobTitle(request, locale);
  const description = capitalizeFirst(asText(request?.description, locale));
  const showDescription = description && description !== title;
  const documents = Array.isArray(request?.documents) ? request.documents : [];
  const category = asText(request?.category?.name, locale);
  const comment = asText(request?.comment, locale);
  const resident = asText(request?.user?.fullName, locale) || person;

  const savedStatus = String(request?.status || "").toLowerCase();
  const isCompleted = savedStatus === "completed";
  const currentLabel = statusTranslations[locale]?.[savedStatus] || request?.status || "";
  const currentTone =
    savedStatus === "completed"
      ? "complete"
      : savedStatus === "escalated" || savedStatus === "rejected"
        ? "escalate"
        : savedStatus === "in-progress"
          ? "progress"
          : "pending";

  if (loading === "loading") {
    return (
      <div className={styles.loading}>
        <SpinnerLoading />
      </div>
    );
  }

  if (!request) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles.back} onClick={() => router.push("/resident/maintenance-requests")}>
          <IoChevronBack size={18} style={dir === "rtl" ? { transform: "rotate(180deg)" } : undefined} />
          {t("detail.back")}
        </button>
        <p className={styles.missing}>{t("detail.notFound")}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.back} onClick={() => router.push("/resident/maintenance-requests")}>
          <IoChevronBack size={18} style={dir === "rtl" ? { transform: "rotate(180deg)" } : undefined} />
          {t("detail.back")}
        </button>
      </div>

      <section className={styles.desktop}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>{title}</h1>
            <p className={styles.reported}>{formatReported(request.createdAt, t)}</p>
          </div>
          <div className={styles.statusLock}>
            <span>{t("table.status")}</span>
            <RenderStatusCell status={request.status} />
          </div>
        </div>

        <div className={styles.facts}>
          {house ? (
            <div className={styles.fact}>
              <span>{t("jobs.house")}</span>
              <p>
                <HiOutlineHome size={18} />
                {houseValue(request)}
              </p>
            </div>
          ) : null}
          {room ? (
            <div className={styles.fact}>
              <span>{t("jobs.room")}</span>
              <p>
                <LuDoorClosed size={18} />
                {roomValue(request, locale)}
              </p>
            </div>
          ) : null}
          {resident ? (
            <div className={styles.fact}>
              <span>{t("detail.resident")}</span>
              <p>
                <HiOutlineUser size={18} />
                {resident}
              </p>
            </div>
          ) : null}
          {category ? (
            <div className={styles.fact}>
              <span>{t("viewModal.category")}</span>
              <p>{category}</p>
            </div>
          ) : null}
        </div>

        <div className={styles.panel}>
          <h2>{t("viewModal.description")}</h2>
          <p>{description || title}</p>
        </div>

        {documents.length > 0 ? (
          <div className={styles.panel}>
            <h2>{t("viewModal.attachments")}</h2>
            <div className={styles.desktopPhotos}>
              {documents.map((doc, index) => (
                <AttachmentItem key={`${documentKey(doc)}-${index}`} doc={doc} t={t} />
              ))}
            </div>
          </div>
        ) : null}

        {comment ? (
          <div className={styles.panel}>
            <h2>{t("viewModal.comment")}</h2>
            <p>{comment}</p>
          </div>
        ) : null}
      </section>

      <div className={styles.mobile}>
      <div className={`${styles.currentBanner} ${styles[currentTone]}`}>
        <span>{t("detail.currentStatus")}</span>
        <strong>{currentLabel}</strong>
      </div>
      <h1>{title}</h1>
      <p className={styles.reported}>{formatReported(request.createdAt, t)}</p>

      <section className={styles.infoCard}>
        {house ? (
          <p>
            <HiOutlineHome size={18} />
            {house}
          </p>
        ) : null}
        {room ? (
          <p>
            <LuDoorClosed size={18} />
            {room}
          </p>
        ) : null}
        {person ? (
          <p>
            <HiOutlineUser size={18} />
            {person}
          </p>
        ) : null}
        {showDescription ? (
          <p>
            <HiOutlineDocumentText size={18} />
            {description}
          </p>
        ) : null}
      </section>

      {documents.length > 0 ? (
        <section className={styles.block}>
          <h2>{t("viewModal.attachments")}</h2>
          <div className={styles.photos}>
            {documents.map((doc, index) => (
              <AttachmentItem
                key={`${documentKey(doc)}-${index}`}
                doc={doc}
                t={t}
                size="mobile"
              />
            ))}
          </div>
        </section>
      ) : null}

      {isCompleted && comment ? (
        <section className={styles.block}>
          <h2>{t("detail.staffComment")}</h2>
          <div className={styles.staffComment}>{comment}</div>
        </section>
      ) : null}
      </div>

    </div>
  );
}
