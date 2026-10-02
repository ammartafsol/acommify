"use client";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { imageUrl } from "@/resources/utils/helper";
import moment from "moment-timezone";
import { useLocale } from "next-intl";
import RenderStatusCell from "../../AppTable/tableHelper";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./style.module.css";

export default function MaintenanceRequestViewModal({
  setShow,
  show,
  requestData,
}) {
  const t = useTranslations("maintenance.maintenanceRequests.viewModal");
  const locale = useLocale();

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return (
      date.toLocaleDateString() +
      " • " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <ModalSkeleton
      maxWidth="500px"
      header={t("title")}
      show={show}
      setShow={setShow}
    >
      <div className={classes.main}>
        {/* Header with description and status */}
        <div className={classes.header}>
          <div>
            <p className={classes.fieldLabel}>{t("status")}</p>
            <RenderStatusCell status={requestData?.status} />
          </div>
        </div>

        {/* Content fields */}
        <div className={classes.content}>
          <div className={classes.fieldRow}>
            <div className={classes.field}>
              <label className={classes.fieldLabel}>{t("dateTime")}</label>
              <p className={classes.fieldValue}>
                {formatDateTime(requestData?.createdAt)}
              </p>
            </div>
            <div className={classes.field}>
              <label className={classes.fieldLabel}>{t("category")}</label>
              <p className={classes.fieldValue}>
                {requestData?.category?.name?.[locale] || "-"}
              </p>
            </div>
          </div>
          <div className={classes.fieldRow}>
            <div className={classes.field}>
              <label className={classes.fieldLabel}>{t("description")}</label>
              <p className={classes.fieldValue}>
                {requestData?.description || "-"}
              </p>
            </div>

            {requestData?.assignedTo && (
              <div className={classes.field}>
                <label className={classes.fieldLabel}>{t("resolvedBy")}</label>
                <p className={classes.fieldValue}>
                  {requestData?.assignedTo?.fullName?.[locale] || "-"}
                </p>
              </div>
            )}
          </div>
          <div className={classes.fieldRow}>
            {requestData?.documents && requestData?.documents?.length > 0 && (
              <div className={classes.field}>
                <label className={classes.fieldLabel}>{t("attachments")}</label>
                <div className={classes.attachmentsContainer}>
                  {requestData.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={imageUrl(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.attachmentLink}
                    >
                      {t("attachment")} {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {requestData?.updatedAt && (
              <div className={classes.field}>
                <label className={classes.fieldLabel}>{t("lastUpdated")}</label>
                <p className={classes.fieldValue}>
                  {moment(requestData.updatedAt).format("DD MMM YYYY, HH:mm")}
                </p>
              </div>
            )}
          </div>
          {requestData?.comment && (
            <div className={classes.field}>
              <label className={classes.fieldLabel}>{t("comment")}</label>
              <p className={classes.fieldValue}>
                {requestData?.comment?.[locale] || requestData?.comment || "-"}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalSkeleton>
  );
}
