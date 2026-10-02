"use client";
import React, { useState } from "react";
import classes from "./styles.module.css";
import { Container } from "react-bootstrap";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import Image from "next/image";
import ConfirmationBookingCard, {
  ConfirmationBookingCardMobile,
} from "@/components/molecules/ConfirmationBookingCard/ConfirmationBookingCard";
import PassengerCard from "@/components/molecules/PassengerCard/PassengerCard";
import Button from "@/components/atoms/Button";
import { FiDownload } from "react-icons/fi";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import { useTranslations } from "@/resources/hooks/useTranslations";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import useDimensions from "@/resources/hooks/useDimensions";
import { IoNotificationsOutline } from "react-icons/io5";

export default function BusETicket() {
  const t = useTranslations();
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [reminder, setReminder] = useState({
    hour: false,
    thirty: false,
    fifteen: false,
    custom: false,
  });
  const [customValue, setCustomValue] = useState("");

  const cardDetailsData = {
    name: "John Doe",
    code: "J123",
    number: "1",
    seat: "1A",
    idNumber: "123456789",
    busName: "Green",
    // barcodeNumber: "EESBH21200001088",
  };
  return (
    <div className={classes.container}>
      <Container className="containerFluid">
        {isMobile ? (
          <MobileHeader title={t("eTicket.title")} showBack />
        ) : (
          <TopHeader title={t("eTicket.title")} />
        )}
        <div className={classes.main}>
          <div className={classes.left}>
            <div className={classes.header}>
              <div className={classes.calendarImg}>
                <div>
                  <Image src={"/svg/calendarImg.svg"} alt="calendar" fill />
                </div>
              </div>
              <div className={classes.confirmedText}>
                <p>{t("eTicket.bookingConfirmed")}</p>
                <p>{t("eTicket.description")}</p>
              </div>
            </div>
            <div className={classes.details}>
              <div className={classes.trips}>
                <p>{t("eTicket.yourTrip")}</p>

                <ConfirmationBookingCard
                  t={t}
                  mainClass={classes.bookingCard}
                />
              </div>
              {!isMobile && (
                <div className={classes.passengersList}>
                  <p>{t("eTicket.passengerList")}</p>
                  <PassengerCard verified={false} />
                </div>
              )}
              {isMobile && (
                <div className={classes.passengerDetailsMobile}>
                  <div>
                    <div className={classes.passengerDetail}>
                      <p>{t("eTicket.name")}</p>
                      <p>{cardDetailsData?.name}</p>
                    </div>
                    <div className={classes.passengerDetailRight}>
                      <p>{t("eTicket.bookingCode")}</p>
                      <p>{cardDetailsData?.code}</p>
                    </div>
                  </div>
                  <div>
                    <div className={classes.passengerDetail}>
                      <p>{t("eTicket.numberOfTicket")}</p>
                      <p>{cardDetailsData?.number} Ticket</p>
                    </div>
                    <div className={classes.passengerDetailRight}>
                      <p>{t("eTicket.seat")}</p>
                      <p>{cardDetailsData?.seat}</p>
                    </div>
                  </div>
                  <div>
                    <div className={classes.passengerDetail}>
                      <p>{t("eTicket.IdNumber")}</p>
                      <p>{cardDetailsData?.idNumber}</p>
                    </div>
                    <div className={classes.passengerDetailRight}>
                      <p>{t("eTicket.busName")}</p>
                      <p>{cardDetailsData?.busName} Bus</p>
                    </div>
                  </div>
                </div>
              )}

              {/* barcode */}
              {/* <div className={classes.barcode}>
                <div className={classes.barcodeImg}>
                  <Image src={"/svg/barcode.svg"} alt="barcode" fill />
                </div>
                <p>{cardDetailsData?.barcodeNumber}</p>
              </div> */}
            </div>
          </div>
          <div className={classes.right}>
            {isMobile && (
              <div className={classes.reminderTitleMobile}>
                <div className={classes.icon}>
                  <IoNotificationsOutline size={14} color="#33B5F6" />
                </div>
                <p className={classes.reminderTitle}>
                  {t("eTicket.reminders.title")}
                </p>
              </div>
            )}
            <div className={classes.reminderBox}>
              {!isMobile && (
                <p className={classes.reminderTitle}>
                  {t("eTicket.reminders.title")}
                </p>
              )}
              <Checkbox
                label={t("eTicket.reminders.reminderOptions.1hour")}
                value={reminder.hour}
                setValue={(val) => setReminder((r) => ({ ...r, hour: val }))}
              />
              <Checkbox
                label={t("eTicket.reminders.reminderOptions.30min")}
                value={reminder.thirty}
                setValue={(val) => setReminder((r) => ({ ...r, thirty: val }))}
              />
              <Checkbox
                label={t("eTicket.reminders.reminderOptions.15min")}
                value={reminder.fifteen}
                setValue={(val) => setReminder((r) => ({ ...r, fifteen: val }))}
              />
              <Checkbox
                label={t("eTicket.reminders.reminderOptions.custom")}
                value={reminder.custom}
                setValue={(val) => setReminder((r) => ({ ...r, custom: val }))}
              />
              {reminder.custom && (
                <input
                  type="text"
                  className={classes.customInput}
                  placeholder={t("eTicket.reminders.customPlaceholderText")}
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                />
              )}
            </div>
            <Button
              label={t("eTicket.downloadBtnLabel")}
              variant={"primary"}
              className={classes.downloadButton}
              leftIcon={<FiDownload size={24} color="#fff" />}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
