import { capitalizeEachWord, mergeClass } from "@/resources/utils/helper";
import moment from "moment";
import styles from "./tableHelper.module.css";
import { useLocale } from "next-intl";
import { statusTranslations } from "@/constants/status";

// export default function RenderStatusCell({ status }) {
//   const normalizedStatus = status?.toLowerCase();
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "confirmed":
//         return styles.statusBlue;
//       case "completed":
//         return styles.statusGreen;
//       case "escalated":
//         return styles.statusRed;
//       case "pending":
//         return styles.statusOrange;
//       case "delivery":
//         return styles.statusGreen;
//       case "pickup":
//         return styles.statusOrange;
//       case "pickup / delivery":
//         return styles.statusBlue;
//       default:
//         return styles.statusDefault;
//     }
//   };
//   const statusClass = getStatusClass(normalizedStatus);
//   return (
//     <div className={mergeClass(statusClass, styles.statusCell)}>
//       <span />
//       <p>{status}</p>
//     </div>
//   );
// }
export default function RenderStatusCell({ status }) {
  const locale = useLocale();
  const normalizedStatus = status?.toLowerCase();

  const getStatusClass = (status) => {
    if (["confirmed", "low", "pickup-delivery"].includes(status)) {
      return styles.statusBlue;
    } else if (
      [
        "completed",
        "resolved",
        "approved",
        "active",
        "unoccupied",
        "on-site",
        "open",
        "accepted",
        "delivery",
        "checked-in",
      ].includes(status)
    ) {
      return styles.statusGreen;
    } else if (
      [
        "escalated",
        "urgent",
        "in progress",
        "inactive",
        "rejected",
        "high",
        "cancelled",
      ].includes(status)
    ) {
      return styles.statusRed;
    } else if (
      [
        "pending",
        "under review",
        "medium",
        "maintenance",
        "occupied",
        "under-review",
        "in-progress",
        "pickup",
        "off-site",
        "checked-out",
      ].includes(status)
    ) {
      return styles.statusOrange;
    } else {
      return styles.statusDefault;
    }
  };

  const statusClass = getStatusClass(normalizedStatus);

  // Fallback: if translation not available, show raw status
  const translatedStatus =
    statusTranslations[locale]?.[normalizedStatus] || status;

  return (
    <div className={mergeClass(statusClass, styles.statusCell)}>
      <span />
      <p>{translatedStatus}</p>
    </div>
  );
}

export function RenderDateTimeCell({ dateTime, withoutTimezone = false }) {
  const formatDateTime = () => {
    if (withoutTimezone) {
      // Show as UTC without timezone offset
      return moment.utc(dateTime).format("YYYY-MM-DD • h:mmA");
    } else {
      // Show with timezone offset (local time)
      return moment(dateTime).format("YYYY-MM-DD • h:mmA");
    }
  };

  return (
    <div className={styles.dateTimeCell}>
      <p>{formatDateTime()}</p>
    </div>
  );
}
