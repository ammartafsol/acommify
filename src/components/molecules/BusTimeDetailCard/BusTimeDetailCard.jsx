"use client";
import React from "react";
import classes from "./BusTimeDetailCard.module.css";
import { ReactSVG } from "react-svg";
import { FaCircleCheck } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { GiOfficeChair } from "react-icons/gi";
import useDimensions from "@/resources/hooks/useDimensions";
import { useLocale } from "next-intl";
import moment from "moment-timezone";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { capitalizeEachWord } from "@/resources/utils/helper";

export default function BusTimeDetailCard({
  data,
  selectedDate,
  onClick = () => {},
}) {
  const t = useTranslations("busDetailCard");
  const router = useRouter();
  const locale = useLocale();
  const { width } = useDimensions();
  const isMobile = width < 577;
  const isAvailable = data?.availableSeatsCount
    ? data?.availableSeatsCount > 0
    : data?.bookedSlots?.length !== data?.capacity;

  const BusData = {
    title: data?.name?.[locale] || "N/A",
    from: data?.startingPointAddress?.[locale] || "N/A",
    to: data?.endingPointAddress?.[locale] || "N/A",
    startTime:
      (data?.schedule?.startTime &&
        moment(data?.schedule?.startTime, "HH:mm").format("hh:mm A")) ||
      "N/A",
    endTime:
      (data?.schedule?.endTime &&
        moment(data?.schedule?.endTime, "HH:mm").format("hh:mm A")) ||
      "N/A",
    date:
      (selectedDate && moment(selectedDate).format("DD MMM, YYYY")) || "N/A",
    endDate:
      (selectedDate &&
        moment(`${selectedDate} ${data?.schedule?.endTime}`).format(
          "DD MMM, YYYY"
        )) ||
      "N/A",
    duration:
      (data?.schedule?.duration &&
        moment(data?.schedule?.duration, "h")?.format("h[h] m[m]")) ||
      "N/A",
    seatsAvailable:
      data?.availableSeatsCount ||
      `${data?.capacity - data?.bookedSlots?.length}` ||
      "N/A",
    slug: data?.slug,
    capacity: data?.capacity || "N/A",
  };

  return (
    <div
      className={classes.container}
      onClick={() => {
        onClick(BusData);
      }}
    >
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <div className={classes.busIcon}>
            <ReactSVG src={"/svg/greenBus.svg"} height={23} width={25} />
          </div>
          <p>{capitalizeEachWord(BusData.title)}</p>
        </div>
        <div
          className={
            isAvailable ? classes.availableStatus : classes.bookedStatus
          }
        >
          <FaCircleCheck
            size={16}
            color={isAvailable ? "#05CD99" : "#F86969"}
          />
          <p className={isAvailable ? classes.available : classes.booked}>
            {isAvailable ? t("available") : t("booked")}
          </p>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <p>{capitalizeEachWord(BusData.from)}</p>
          <p>{capitalizeEachWord(BusData.to)}</p>
        </div>
        <div className={classes.contentMiddle}>
          <p>{BusData.startTime}</p>
          <div className={classes.routeImg}>
            <Image src="/svg/point-group.svg" alt="point" fill />
          </div>
          <p>{BusData.endTime}</p>
        </div>
        <div className={classes.contentBottom}>
          <p>{BusData.date} </p>
          <p>
            {t("duration")} {BusData.duration}
          </p>
          <p>{BusData.date}</p>
        </div>
      </div>
      {isMobile ? (
        <div className={classes.bottomMobile}>
          <div className={classes.busCardMobile}>
            <div className={classes?.busIconMobile}>
              <GiOfficeChair size={16} color="#33B5F6" />
            </div>
            <p>
              {t("seatsAvailable")}:<span> {BusData.seatsAvailable}</span>
            </p>
          </div>
          <div>
            <p>
              <span>{t("departureDate")}:</span> {BusData.date}
            </p>
          </div>
        </div>
      ) : (
        <div className={classes.bottom}>
          <p>
            <span>{t("departureDate")}:</span> {BusData.date}
          </p>
          <p>
            <span>{t("seatsAvailable")}:</span>
            {`${BusData.seatsAvailable} / ${BusData.capacity}`}
          </p>
        </div>
      )}
    </div>
  );
}
