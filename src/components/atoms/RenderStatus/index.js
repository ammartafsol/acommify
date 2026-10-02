import { mergeClass } from "@/resources/utils/helper";
import Image from "next/image";
import classes from "./styles.module.css";
import { ReactSVG } from "react-svg";

export const RenderStatus = ({ status }) => {
  if (!status) return null;

  // normalize: remove spaces + lowercase
  const normalizedStatus = status.replace(/\s+/g, "").toLowerCase();

  const statusConfig = {
    upcomingevents: {
      icon: "/svg/active.svg",
      class: classes.upcomingEvents,
      displayName: "Upcoming Events",
    },
    maintenancenotices: {
      icon: "/svg/active.svg",
      class: classes.upcomingEvents,
      displayName: "Maintenance Notices",
    },
    pending: {
      icon: "/svg/pending.svg",
      class: classes.pending,
      displayName: "Pending",
    },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.inactive;

  return (
    <div className={mergeClass(classes.statusText, config.class)}>
      <ReactSVG className="reactSvg" src={config.icon} width={12} height={12} />
      <p className="maxLine1">{config.displayName || status}</p>
    </div>
  );
};
