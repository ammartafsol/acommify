"use client";
import React from "react";
import classes from "./PassengerCard.module.css";
import { FaCircleCheck } from "react-icons/fa6";
import { useTranslations } from "@/resources/hooks/useTranslations";
export default function PassengerCard({ verified = true, data }) {
  const t = useTranslations("passengerCard");
  return (
    <div className={classes.bookingCard}>
      <div className={classes.bookingCardTop}>
        <p>
          {t("passenger")}: {data?.passengerName || "N/A"}
        </p>
        {verified && <FaCircleCheck size={20} color="#00B383" />}
      </div>
      <div className={classes.bookingCardBottom}>
        <p>
          {t("seatNumber")}: {data?.seatNumber || "N/A"}
        </p>
      </div>
    </div>
  );
}
