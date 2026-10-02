import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import moment from "moment-timezone";
import { useMemo } from "react";
import styles from "./styles.module.css";

export default function TimeSlots2Hour({
  slots = [],
  onSlotClick = () => {},
  selectedSlot,
}) {
  const t = useTranslations("timeslots");

  // Filter and process slots to only show those that can be selected for 2 hours
  const processedSlots = useMemo(() => {
    const validSlots = [];

    for (let i = 0; i < slots.length; i++) {
      const currentSlot = slots[i];
      const nextSlot = slots[i + 1];
      const prevSlot = slots[i - 1];

      // Only show slots that are available and can pair with next or previous
      if (currentSlot.type === "available") {
        const canPairWithNext =
          nextSlot &&
          nextSlot.type === "available" &&
          moment(currentSlot.end).isSame(moment(nextSlot.start));

        const canPairWithPrev =
          prevSlot &&
          prevSlot.type === "available" &&
          moment(prevSlot.end).isSame(moment(currentSlot.start));

        // Only include slot if it can pair with next or previous
        if (canPairWithNext || canPairWithPrev) {
          validSlots.push({
            ...currentSlot,
            canPairWithNext,
            canPairWithPrev,
            nextSlot,
            prevSlot,
            slotIndex: i,
            originalSlots: slots, // Keep reference to all slots for finding pairs
          });
        }
      }
    }

    return validSlots;
  }, [slots]);

  const handleSlotClick = (slot) => {
    if (slot.type !== "available") return;

    let selectedSlots = [];
    const currentSlotOriginalIndex = slot.slotIndex;
    const allSlots = slot.originalSlots;

    // Check if this slot is already selected (is it part of current selection?)
    const isCurrentlySelected =
      selectedSlot &&
      moment(slot.start).isSameOrAfter(moment(selectedSlot.start)) &&
      moment(slot.end).isSameOrBefore(moment(selectedSlot.end));

    // If clicking on a selected slot (cascading behavior)
    if (isCurrentlySelected && selectedSlot) {
      const selectedStartTime = moment(selectedSlot.start);
      const selectedEndTime = moment(selectedSlot.end);
      const clickedSlotStartTime = moment(slot.start);
      const clickedSlotEndTime = moment(slot.end);

      // Check if this is the second slot of the current selection
      // The second slot is the one where its start matches the middle of the 2-hour selection
      const selectionMidpoint = selectedStartTime.clone().add(1, "hour");
      const isSecondSlot =
        clickedSlotStartTime.isSame(selectionMidpoint) &&
        clickedSlotEndTime.isSame(selectedEndTime);

      if (isSecondSlot) {
        // This is the second slot, cascade forward
        // Try to select this slot + next slot from original array
        const nextSlot = allSlots[currentSlotOriginalIndex + 1];

        if (
          nextSlot &&
          nextSlot.type === "available" &&
          moment(slot.end).isSame(moment(nextSlot.start))
        ) {
          // Can cascade forward - use the actual slot objects from original array
          selectedSlots = [allSlots[currentSlotOriginalIndex], nextSlot];
        } else {
          // This is the last available slot, select previous + current from original array
          const prevSlot = allSlots[currentSlotOriginalIndex - 1];
          if (
            prevSlot &&
            prevSlot.type === "available" &&
            moment(prevSlot.end).isSame(moment(slot.start))
          ) {
            selectedSlots = [prevSlot, allSlots[currentSlotOriginalIndex]];
          } else {
            return; // Can't cascade, do nothing
          }
        }
      } else {
        // Clicked on first slot of selection, treat as new selection
        const nextSlot = allSlots[currentSlotOriginalIndex + 1];
        const prevSlot = allSlots[currentSlotOriginalIndex - 1];

        const canPairWithNext =
          nextSlot &&
          nextSlot.type === "available" &&
          moment(slot.end).isSame(moment(nextSlot.start));

        const canPairWithPrev =
          prevSlot &&
          prevSlot.type === "available" &&
          moment(prevSlot.end).isSame(moment(slot.start));

        if (canPairWithNext) {
          selectedSlots = [allSlots[currentSlotOriginalIndex], nextSlot];
        } else if (canPairWithPrev && !canPairWithNext) {
          selectedSlots = [prevSlot, allSlots[currentSlotOriginalIndex]];
        } else {
          return;
        }
      }
    } else {
      // Normal selection logic - not currently selected
      const nextSlot = allSlots[currentSlotOriginalIndex + 1];
      const prevSlot = allSlots[currentSlotOriginalIndex - 1];

      const canPairWithNext =
        nextSlot &&
        nextSlot.type === "available" &&
        moment(slot.end).isSame(moment(nextSlot.start));

      const canPairWithPrev =
        prevSlot &&
        prevSlot.type === "available" &&
        moment(prevSlot.end).isSame(moment(slot.start));

      // If slot can pair with next, select current + next
      if (canPairWithNext) {
        selectedSlots = [allSlots[currentSlotOriginalIndex], nextSlot];
      }
      // If slot can pair with previous but not next, select previous + current
      else if (canPairWithPrev && !canPairWithNext) {
        selectedSlots = [prevSlot, allSlots[currentSlotOriginalIndex]];
      }
      // If slot cannot pair with any, don't allow selection for 2-hour mode
      else {
        return;
      }
    }

    // Create combined slot object
    const combinedSlot = {
      start: selectedSlots[0].start,
      end: selectedSlots[1].end,
      type: "available",
      duration: "2hour",
      slots: selectedSlots,
    };

    onSlotClick(combinedSlot);
  };

  const isSlotSelected = (slot) => {
    if (!selectedSlot) return false;

    // Check if this slot is part of the selected 2-hour block
    const selectedStart = moment(selectedSlot.start);
    const selectedEnd = moment(selectedSlot.end);
    const slotStart = moment(slot.start);
    const slotEnd = moment(slot.end);

    return (
      slotStart.isSameOrAfter(selectedStart) &&
      slotEnd.isSameOrBefore(selectedEnd)
    );
  };

  const isSlotClickable = (slot) => {
    // All displayed slots are already filtered to be clickable
    return slot.type === "available";
  };

  return (
    <div className={styles?.container}>
      <div className={styles.main}>
        <h1 className={styles?.heading}>{t("available2HourSlots")}</h1>
        <div className={styles.timeSlots}>
          {processedSlots?.map((slot, idx) => (
            <div
              data-selected={isSlotSelected(slot)}
              onClick={() => handleSlotClick(slot)}
              className={`${styles.timeSlot} ${
                !isSlotClickable(slot) ? styles.disabled : ""
              }`}
              key={idx}
              data-type={slot.type}
            >
              <span
                className={mergeClass(
                  styles.dot,
                  slot.type === "available"
                    ? isSlotClickable(slot)
                      ? styles.available
                      : styles.unavailable
                    : slot.type === "booked"
                    ? styles.booked
                    : styles.your
                )}
              />
              {moment(slot.start).format("hh:mm A")} -{" "}
              {moment(slot.end).format("hh:mm A")}
              {/* {isSlotSelected(slot) && (
                <span className={styles.durationBadge}>2h</span>
              )} */}
            </div>
          ))}
        </div>
        {processedSlots?.filter((slot) => isSlotClickable(slot)).length ===
          0 && <p>{t("noConsecutiveSlotsAvailable")}</p>}
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
