"use client";
import React from "react";
import classes from "./MeetingCard.module.css";
import Button from "@/components/atoms/Button";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { FiClock } from "react-icons/fi";
import { mergeClass } from "@/resources/utils/helper";

export default function MeetingCard({ data, mainClass, t }) {
  return (
    <div className={mergeClass(classes.card, mainClass)}>
      {/* Status */}
      {data?.status && (
        <>
          {data.status === "Confirmed" ? (
            <div className={classes.confirmedStatus}>
              <FaCheckCircle color="#00B383" height={12} width={12} />
              <p>{data.status}</p>
            </div>
          ) : (
            <div className={classes.pendingStatus}>
              <Image
                src={"/svg/pending.svg"}
                height={12}
                width={12}
                alt="pending"
              />
              <p>{data.status}</p>
            </div>
          )}
        </>
      )}

      {/* Title */}
      <p className={classes.title}>{data?.title}</p>
      <div className={classes.schedule}>
        <div className={classes.date}>
          <div className={classes.icon}>
            <Image
              src={"/svg/calendar.svg"}
              height={13}
              width={13}
              alt="calendar"
            />
          </div>
          <p>{data?.date}</p>
        </div>
        <div className={classes.time}>
          <div className={classes.icon}>
            <FiClock size={13} color="#33B5F6" />
          </div>
          <p>{data?.time}</p>
        </div>
      </div>
      <Button
        label={t("upcomingMeetings.requestChange")}
        variant={"primary"}
        className={classes.btn}
      />
    </div>
  );
}
