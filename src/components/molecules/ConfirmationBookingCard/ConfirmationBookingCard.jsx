"use client";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useLocale } from "next-intl";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import classes from "./ConfirmationBookingCard.module.css";
import moment from "moment-timezone";

// Data object in requested format
const busCardsData = [
  {
    id: 12895464454,
    icon: "/svg/greenBus.svg",
    title: {
      en: "Green Bus",
      "en-GB": "Green Bus",
      es: "Autobús Verde",
      fr: "Bus Vert",
    },
    description: {
      en: "A convenient and eco-friendly bus service from Rathmore to Tesco.",
      "en-GB":
        "A reliable green bus service operating between Rathmore and Tesco.",
      es: "Un servicio de autobús ecológico y conveniente de Rathmore a Tesco.",
      fr: "Un service de bus écologique et pratique de Rathmore à Tesco.",
    },
    from: "Rathmore",
    to: "Tesco",
    startTime: "12:00 PM",
    endTime: "01:15 PM",
    date: "Feb 24, 2023",
    duration: "1h 15m",
    departureDate: "Nov 18, 2024, 8:00 AM",
    seatsAvailable: 15,
    totalSeats: 20,
    available: true,
    slug: "green-bus",
    routeImg: "/svg/point-group.svg",
    detailsLabel: "View Details",
    busName: "Yellow Bus",
    name: "Cameron Williamson",
    bookingCode: "V13NS90",
    totalTickets: "1 Ticket",
    seat: "8D",
  },
];

export default function ConfirmationBookingCard({ bus, mainClass }) {
  // console.log(bus);
  const bookingData = bus || busCardsData[0];
  const locale = useLocale();
  const router = useRouter();
  const [seats, setSeats] = useState([]);
  const t = useTranslations("busBookingConfirmationCard");
  const sParams = useSearchParams();
  const selectedDate = sParams.get("date");
  try {
    const seats = JSON.parse(sParams.get("seats"));
  } catch (error) {}

  useEffect(() => {
    if (sParams.get("seats")) {
      try {
        const seats = JSON.parse(sParams.get("seats"));
        setSeats(seats);
      } catch (error) {
        return notFound();
      }
    }
  }, [sParams]);

  // Calculate formatted times and duration
  const startTimeFormatted = bookingData.schedule?.startTime
    ? moment(bookingData.schedule.startTime, "HH:mm A").format("HH:mm A")
    : "N/A";
  const endTimeFormatted = bookingData.schedule?.endTime
    ? moment(bookingData.schedule.endTime, "HH:mm A").format("HH:mm A")
    : "N/A";
  const startMoment = moment(bookingData.schedule?.startTime, "HH:mm A");
  const endMoment = moment(bookingData.schedule?.endTime, "HH:mm A");
  const duration = moment.duration(endMoment.diff(startMoment));
  const durationString = `${duration.hours()}h${
    duration.minutes() > 0 ? ` ${duration.minutes()}m` : ""
  }`;

  return (
    <div className={mergeClass(mainClass, classes.main)}>
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <div className={classes.busIcon}>
            <ReactSVG src={"/svg/greenBus.svg"} height={23} width={25} />
          </div>
          <p>{bookingData.name?.[locale]}</p>
        </div>
        <p className={classes.details}>
          {bookingData.endingPointAddress?.[locale]}
        </p>
      </div>
      <div className={classes.separator}></div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <p> {bookingData.endingPointAddress?.[locale]}</p>
          <p>{bookingData.startingPointAddress?.[locale]}</p>
        </div>
        <div className={classes.contentMiddle}>
          <p>{startTimeFormatted}</p>
          <div className={classes.routeImg}>
            <Image src={"/svg/point-group.svg"} alt="point" fill />
          </div>
          <p>{endTimeFormatted}</p>
        </div>
        <div className={classes.contentBottom}>
          <p>{selectedDate}</p>
          <p>
            {t("duration")} {durationString}
          </p>
          <p>{selectedDate}</p>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationBookingCardMobile({ bus }) {
  console.log(bus);
  const bookingData = bus || busCardsData[0];
  const locale = useLocale();
  const t = useTranslations("busBookingConfirmationCard");
  const [seats, setSeats] = useState([]);
  const sParams = useSearchParams();
  const selectedDate = sParams.get("date");

  try {
    const seats = JSON.parse(sParams.get("seats"));
  } catch (error) {}

  useEffect(() => {
    if (sParams.get("seats")) {
      try {
        const seats = JSON.parse(sParams.get("seats"));
        setSeats(seats);
      } catch (error) {
        return notFound();
      }
    }
  }, [sParams]);
  // Calculate formatted times and duration
  const startTimeFormatted = bookingData.startTime
    ? moment(bookingData.startTime, "HH:mm A").format("HH:mm A")
    : "N/A";
  const endTimeFormatted = bookingData.endTime
    ? moment(bookingData.endTime, "HH:mm A").format("HH:mm A")
    : "N/A";
  const startMoment = moment(bookingData.startTime, "HH:mm A");
  const endMoment = moment(bookingData.endTime, "HH:mm A");
  const duration = moment.duration(endMoment.diff(startMoment));
  const durationString = `${duration.hours()}h${
    duration.minutes() > 0 ? ` ${duration.minutes()}m` : ""
  }`;

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <div className={classes.busIcon}>
            <ReactSVG src={bookingData.icon} height={23} width={25} />
          </div>
          <p>{bookingData.name?.[locale]}</p>
        </div>
        <div className={classes?.busDetails}>
          <h5>{bookingData.busName}</h5>
          <p>{bookingData.from}</p>
        </div>
      </div>
      <div className={classes.separator}></div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <p>{bookingData.from}</p>
          <p>{bookingData.to}</p>
        </div>
        <div className={classes.contentMiddle}>
          <p>{startTimeFormatted}</p>
          <div className={classes.routeImg}>
            <Image src={bookingData.routeImg} alt="point" fill />
          </div>
          <p>{endTimeFormatted}</p>
        </div>
        <div className={classes.contentBottom}>
          <p>{bookingData.date}</p>
          <p>
            {t("duration")} {durationString}
          </p>
          <p>{bookingData.date}</p>
        </div>
      </div>
      <div className={classes.separator}></div>
      <div className={classes?.mainHeaderDetails}>
        <div className={classes?.detailsTop}>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.name")}</p>
            <p>{bookingData?.name}</p>
          </div>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.bookingCode")}</p>
            <p>{bookingData?.bookingCode}</p>
          </div>
        </div>
        <div className={classes?.detailsTop}>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.numberOfTicket")}</p>
            <p>{bookingData?.totalTickets}</p>
          </div>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.seat")}</p>
            <p>{bookingData?.seat}</p>
          </div>
        </div>
        <div className={classes?.detailsTop}>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.Idnumber")}</p>
            <p>{bookingData?.id}</p>
          </div>
          <div className={classes?.detailsTopName}>
            <p>{t("eTicket.busName")}</p>
            <p>{bookingData.title?.[locale]}</p>
          </div>
        </div>
      </div>
      <div className={classes.separator}></div>
      {/* barcode */}
      {/* <div className={classes.barcode}>
        <div className={classes.barcodeImg}>
          <Image src={"/svg/barcode.svg"} alt="barcode" fill />
        </div>
        <p>EESBH21200001088</p>
      </div> */}
    </div>
  );
}
