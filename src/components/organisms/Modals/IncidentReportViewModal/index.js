import { useTranslations } from "@/resources/hooks/useTranslations";
import RenderStatusCell from "../../AppTable/tableHelper";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./style.module.css";
import { useLocale } from "next-intl";
import moment from "moment-timezone";
import { mergeClass } from "@/resources/utils/helper";

export default function IncidentReportViewModal({
  setShow,
  show,
  incidentData,
}) {
  const t = useTranslations("myIncidentReports.IncidentReportViewModal");
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
      skeletonClass={classes.modalSkeleton}
    >
      <div className={classes.main}>
        <div className={classes.content}>
          <p className={classes.incidentId}>
            {t("incidentId")} {incidentData?.incidentId || "-"}
          </p>
          <h3 className={classes.incidentTitle}>
            {t("incidentTitle")} {incidentData?.title[locale] || "-"}
          </h3>
        </div>
        <div className={classes.fieldRow}>
          <div className={classes.field}>
            <label className={classes.fieldLabel}>{t("status")}</label>
            <div className={classes.fieldValue}>
              <RenderStatusCell status={incidentData?.status} />
            </div>
          </div>
          <div className={classes.fieldRow}>
            <div className={classes.field}>
              <label className={classes.fieldLabel}>{t("severity")}</label>
              <p className={classes.fieldValue}>
                {incidentData?.severity || "-"}
              </p>
            </div>
          </div>
          <div className={classes.field}>
            <label className={classes.fieldLabel}>{t("dateTime")}</label>
            <p className={classes.fieldValue}>
              {formatDateTime(incidentData?.createdAt)}
            </p>
          </div>

          <div
            hidden={incidentData?.status !== "resolved"}
            className={classes.field}
          >
            <label className={classes.fieldLabel}>{t("completedDate")}</label>
            <p className={classes.fieldValue}>
              {incidentData?.updatedAt
                ? moment(incidentData.completedDate).format("DD MMM YYYY")
                : "-"}
            </p>
          </div>
          <div className={mergeClass(classes.field, classes.fullWidthField)}>
            <label className={classes.fieldLabel}>{t("description")}</label>
            <p className={classes.fieldValue}>
              {incidentData?.description[locale] || "-"}
            </p>
          </div>
        </div>
      </div>
    </ModalSkeleton>
  );
}
