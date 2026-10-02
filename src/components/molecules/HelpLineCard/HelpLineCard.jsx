"use client";
import React from "react";
import classes from "./HelpLineCard.module.css";
import { LuClock4, LuPhone } from "react-icons/lu";
import { TbWorld } from "react-icons/tb";

export default function HelpLineCard({ data, locale }) {
  const title = data?.title?.[locale] || data?.title?.en;
  const description = data?.description?.[locale] || data?.description?.en;
  const country = data?.country?.[locale] || data?.country?.en;

  return (
    <div className={classes.card}>
      <p>{title}</p>
      <p>{description}</p>
      <p className={classes.iconText}>
        <span>
          <TbWorld size={15} color="#33B5F6" />
        </span>
        {country || "N/A"}
      </p>
      <p className={classes.iconText}>
        <span>
          <LuPhone size={14} color="#33B5F6" />
        </span>
        ({data?.callingCode}) {data?.phoneNumber}
      </p>
      <p className={classes.iconText}>
        <span>
          <LuClock4 size={15} color="#33B5F6" />
        </span>
        {data?.timings}
      </p>
    </div>
  );
}
