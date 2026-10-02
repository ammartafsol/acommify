"use client";
import React, { useState } from "react";
import classes from "./MobileCalendar.module.css";
import Calendar from "react-calendar";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import "./style.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function MobileCalendar({ title = "" }) {
  const [value, setValue] = useState(new Date(2024, 2, 2));
  const [selectedDates, setSelectedDates] = useState([]);

  const onPick = (d) => {
    const k = fmt(d);
    const isSelected = selectedDates.includes(k);

    if (isSelected) {
      setSelectedDates((arr) => arr.filter((x) => x !== k));
      setValue(null);
    } else {
      setSelectedDates((arr) => [...arr, k]);
      setValue(d);
    }
  };
  // console.log(selectedDates);
  return (
    <div className={classes.wrap}>
      {title && <div className={classes.title}>{title}</div>}
      <div className={classes.card}>
        <Calendar
          className={classes.cal}
          onChange={onPick}
          value={value}
          showNeighboringMonth
          prev2Label={null}
          next2Label={null}
          prevLabel={<BiChevronLeft size={20} color="#A8B5BC" />}
          nextLabel={<BiChevronRight size={20} color="#A8B5BC" />}
          formatShortWeekday={(_, d) => DAYS[d.getDay()]}
          tileClassName={({ date, view }) =>
            view === "month" && selectedDates.includes(fmt(date))
              ? classes.reactCalendarActive // your 35x35 blue chip + no hover
              : undefined
          }
          tileContent={({ date, view }) => {
            const k = fmt(date);
            const hideDots =
              view !== "month" ||
              selectedDates.includes(k) ||
              (value && fmt(value) === k);
            if (hideDots || !availabilityMap[k]) return null;
            return (
              <div className={classes.dots}>
                {availabilityMap[k].map((t, i) => (
                  <span key={i} className={`${classes.dot} ${classes[t]}`} />
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

/* ---- sample data ---- */
const availabilityMap = {
  "2024-02-26": ["available"],
  "2024-02-27": ["available"],
  "2024-02-28": ["available"],
  "2024-03-01": ["available"],
  "2024-03-02": ["available"],
  "2024-03-03": ["available"],
  "2024-03-05": ["available"],
  "2024-03-06": ["available"],
  "2024-03-07": ["available"],
  "2024-03-09": ["unavailable"],
  "2024-03-10": ["unavailable"],
  "2024-03-12": ["available"],
  "2024-03-13": ["available"],
  "2024-03-14": ["available"],
  "2024-03-16": ["unavailable"],
  "2024-03-17": ["available"],
  "2024-03-19": ["available"],
  "2024-03-20": ["available"],
  "2024-03-21": ["available"],
  "2024-03-22": ["available"],
  "2024-03-23": ["unavailable"],
  "2024-03-24": ["available"],
  "2024-03-26": ["available"],
  "2024-03-27": ["available"],
  "2024-03-28": ["available"],
  "2024-03-29": ["available"],
  "2024-03-30": ["available"],
  "2024-03-31": ["available"],
  "2024-04-01": ["available"],
};
