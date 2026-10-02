"use client";
import React from "react";
import classes from "./NotificationCard.module.css";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "@/resources/hooks/useTranslations";
import moment from "moment-timezone";
import useDimensions from "@/resources/hooks/useDimensions";

export default function NotificationCard({ data, showButton = false }) {
  const locale = useLocale();
  const t = useTranslations("notificationsPage");
  const { width } = useDimensions();
  const isMobile = width < 376;
  const iconSrc = ["cancelled", "rejected"].includes(data?.booking?.status)
    ? "/svg/cross.svg"
    : ["completed", "accepted"].includes(data?.booking?.status)
    ? "/svg/successnotification.svg"
    : "/svg/yellowInfo.svg";

  return (
    <div className={classes.main}>
      <div className={classes.left}>
        <Image src={iconSrc} alt="Notification Icon" width={24} height={24} />
        <div className={classes.content}>
          <div className={classes.title}>
            <p>
              {typeof data?.title === "string"
                ? data?.title
                : data?.title?.[locale]}
            </p>
            {isMobile && (
              <p className={classes.createdAt}>{moment(data?.createdAt).locale(locale).format("LL")}</p>
            )}
          </div>
          {typeof data?.message === "string" ? (
            <p>{data?.message}</p>
          ) : (
            <p>{data?.message?.[locale]}</p>
          )}
          {/* {data?.createdAt && (
            <p>{moment(data?.createdAt).locale(locale).format("LL")}</p>
          )} */}
        </div>
      </div>
      <div className={classes.right}>
        {data?.createdAt && (
          <p>{moment(data?.createdAt).locale(locale).format("LL")}</p>
        )}
        {showButton && (
          <Button
            label={t("reschedule")}
            variant={"primary"}
            className={classes.button}
          />
        )}
      </div>
    </div>
  );
}
