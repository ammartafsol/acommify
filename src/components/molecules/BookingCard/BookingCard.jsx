"use client";
import React, { useState } from "react";
import classes from "./BookingCard.module.css";
import RenderStatusCell, {
  RenderDateTimeCell,
} from "@/components/organisms/AppTable/tableHelper";
import { capitalizeEachWord } from "@/resources/utils/helper";
import Button from "@/components/atoms/Button";
import AreYouSureModal from "@/components/organisms/Modals/AreYouSureModal/AreYouSureModal";

export default function BookingCard({
  t,
  item,
  cancelBooking,
  loading,
  onSuccess,
  setBookingToCancel,
}) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  return (
    <React.Fragment>
      <div className={classes.bookingCard}>
        <div className={classes.cardHeader}>
          <h3>{`${t("table.booking")} #${item.bookingId}`}</h3>
          <div className={classes.status}>
            <RenderStatusCell status={item.status} />
          </div>
        </div>

        <div className={classes.cardBody}>
          <div className={classes.cardItem}>
            <strong>{t("table.category")}: </strong>
            <span>{capitalizeEachWord(item.category) || "N/A"}</span>
          </div>
          <div className={classes.cardItem}>
            <strong>{t("table.bookingStartDate")}: </strong>
            <RenderDateTimeCell dateTime={item.bookingStartDate} />
          </div>
          <div className={classes.cardItem}>
            <strong>{t("table.bookingEndDate")}: </strong>
            <RenderDateTimeCell dateTime={item.bookingEndDate} />
          </div>
        </div>
        {item?.status === "pending" && (
          <div className={classes.cardFooter}>
            <Button
              variant="primary"
                label={t("menuItems.cancel")}
              onClick={() => {
                setBookingToCancel(item?.slug);
                setShowCancelModal(true);
              }}
            />
          </div>
        )}
      </div>
      {showCancelModal && (
        <AreYouSureModal
          show={showCancelModal}
          setShow={setShowCancelModal}
          onConfirm={cancelBooking}
          loading={loading === "cancel"}
          onSuccess={onSuccess}
        />
      )}
    </React.Fragment>
  );
}
