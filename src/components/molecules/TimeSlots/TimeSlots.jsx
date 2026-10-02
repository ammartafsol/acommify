import { useTranslations } from "@/resources/hooks/useTranslations";
import styles from "./styles.module.css";
import { mergeClass } from "@/resources/utils/helper";
import moment from "moment-timezone";

export default function TimeSlots({
  slots = [],
  onSlotClick = () => {},
  selectedSlot,
}) {
  const t = useTranslations("timeslots");

  return (
    <div className={styles?.container}>
      <div className={styles.main}>
        <h1 className={styles?.heading}>{t("availableTimeSlots")}</h1>
        <div className={styles.timeSlots}>
          {slots?.map((slot, idx) => (
            <div
              data-selected={
                `${selectedSlot?.start}-${selectedSlot?.end}` ===
                `${slot.start}-${slot.end}`
              }
              onClick={() => {
                if (slot.type === "available") {
                  onSlotClick(slot);
                }
              }}
              className={styles.timeSlot}
              key={idx}
              data-type={slot.type}
            >
              <span
                className={mergeClass(
                  styles.dot,
                  slot.type === "available"
                    ? styles.available
                    : slot.type === "booked"
                    ? styles.booked
                    : styles.your
                )}
              />
              {moment(slot.start).format("hh:mm A")} -{" "}
              {moment(slot.end).format("hh:mm A")}
              {/* {format24To12Hour(slot.start)} - {format24To12Hour(slot.end)} */}
            </div>
          ))}
        </div>
        {slots?.length === 0 && <p>{t("noSlotsAvailable")}</p>}
      </div>

      <div className={styles.footer}>
        <div>
          <span className={mergeClass(styles.dot, styles.available)} />
          {t("available")}
        </div>
        <div>
          <span className={mergeClass(styles.dot, styles.booked)} />
          {t("booked")}
        </div>
        <div>
          <span className={mergeClass(styles.dot, styles.your)} />
          {t("your")}
        </div>
      </div>
    </div>
  );
}
