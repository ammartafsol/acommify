"use client";

import MeetingCard from "@/components/molecules/MeetingCard/MeetingCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import CalendarComponent from "@/components/organisms/Calender/Calender";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./styles.module.css";

export default function UpcomingEvents() {
  const locale = useLocale();
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [month, setMonth] = useState(null);
  const cards = [
    {
      id: 1,
      title: {
        en: "Manager Appointment",
        "en-GB": "Manager Meeting",
        es: "Cita con el Gerente",
        fr: "Rendez-vous avec le Responsable",
      },
      date: "March 15, 2023",
      time: "10:00 AM",
      slug: "manager-appointment",
    },
    {
      id: 2,
      title: {
        en: "Project Discussion",
        "en-GB": "Project Meeting",
        es: "Discusión de Proyecto",
        fr: "Discussion de Projet",
      },
      date: "March 25, 2024",
      time: "02:00 PM",
      slug: "project-discussion",
    },
    {
      id: 3,
      title: {
        en: "Team Sync-up",
        "en-GB": "Team Meeting",
        es: "Sincronización de Equipo",
        fr: "Réunion d'Équipe",
      },
      date: "April 10, 2024",
      time: "04:00 PM",
      slug: "team-sync-up",
    },
    {
      id: 4,
      title: {
        en: "Client Call",
        "en-GB": "Customer Call",
        es: "Llamada con el Cliente",
        fr: "Appel Client",
      },
      date: "May 5, 2024",
      time: "11:00 AM",
      slug: "client-call",
    },
    {
      id: 5,
      title: {
        en: "Client Call",
        "en-GB": "Customer Call",
        es: "Llamada con el Cliente",
        fr: "Appel Client",
      },
      date: "May 5, 2024",
      time: "11:00 AM",
      slug: "client-call",
    },
    {
      id: 6,
      title: {
        en: "Client Call",
        "en-GB": "Customer Call",
        es: "Llamada con el Cliente",
        fr: "Appel Client",
      },
      date: "May 5, 2024",
      time: "11:00 AM",
      slug: "client-call",
    },
  ];
  const t = useTranslations("upcomingEvents");
  const c = useTranslations("common");
  return (
    <Container className={mergeClass(styles.main, "containerFluid")}>
      {isMobile ? (
        <MobileHeader
          title={t("header.title")}
          showBack
          icon={
            <Image
              src={"/svg/calendar.svg"}
              height={16}
              width={16}
              alt="icon"
            />
          }
        />
      ) : (
        <TopHeader title={t("header.title")} icon={false} />
      )}
      <div className={styles.calendarContainer}>
        {isMobile && (
          <TopHeader
            dropDownPlaceholder={c("months")}
            searchInpClass={styles.searchInput}
            showBackBtn={false}
            showSearch
            showDropdown
            dropdownOptions={MonthsData}
            dropdownValue={month}
            setDropdownValue={setMonth}
            searchCustom={styles?.searchCustom}
          />
        )}
        <CalendarComponent />
        <div className={styles.calendarSidebar}>
          <h1>{t("header.title")}</h1>
          <div className={styles.content}>
            {cards?.map((card) => (
              <MeetingCard
                key={card.id}
                t={t}
                data={{
                  ...card,
                  title: card.title[locale],
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

const MonthsData = [
  {
    label: "January",
    value: "january",
  },
  {
    label: "February",
    value: "february",
  },
  {
    label: "March",
    value: "march",
  },
  {
    label: "April",
    value: "april",
  },
  {
    label: "May",
    value: "may",
  },
  {
    label: "June",
    value: "june",
  },
  {
    label: "July",
    value: "july",
  },
  {
    label: "August",
    value: "august",
  },
  {
    label: "September",
    value: "september",
  },
  {
    label: "October",
    value: "october",
  },
  {
    label: "November",
    value: "november",
  },
  {
    label: "December",
    value: "december",
  },
];
