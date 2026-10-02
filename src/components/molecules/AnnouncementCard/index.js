import React from "react";
import classes from "./styles.module.css";
import { useLocale } from "next-intl";
import { MdArrowOutward } from "react-icons/md";
import { RenderStatus } from "@/components/atoms/RenderStatus";
import { mergeClass } from "@/resources/utils/helper";

export default function AnnouncementCard({ dataNews, customClass }) {
  const language = useLocale();
  return (
    <div className={mergeClass(customClass, classes.announcementCardParent)}>
      {dataNews?.map((announcement) => (
        <div key={announcement.id} className={classes.announcementCard}>
          <div className={classes.announcementCardFull}>
            <div className={classes?.announcementTop}>
              <RenderStatus status={announcement.status[language]} />
            </div>
            <div className={classes?.arrowMain}>
              <MdArrowOutward size={20} color="33b5f6" />
            </div>
          </div>
          <div className={classes.announcementCardBody}>
            <h5>{announcement.label[language]}</h5>
            <p>{announcement.description[language]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
