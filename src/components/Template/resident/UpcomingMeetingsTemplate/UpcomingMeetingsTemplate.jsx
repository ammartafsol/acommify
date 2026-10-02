"use client";
import React, { useState } from "react";
import classes from "./styles.module.css";
import { Container } from "react-bootstrap";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { CiFileOn } from "react-icons/ci";
import ViewHeader from "@/components/molecules/ViewHeader/ViewHeader";
import { useTranslations } from "@/resources/hooks/useTranslations";
import MeetingCard from "@/components/molecules/MeetingCard/MeetingCard";
import useDimensions from "@/resources/hooks/useDimensions";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
export default function UpcomingMeetingsTemplate() {
  const t = useTranslations();
  const documentTabs = [
    {
      label: t("upcomingMeetings.tabs.all"),
      value: "all",
    },
    {
      label: t("upcomingMeetings.tabs.confirmed"),
      value: "confirmed",
    },
    {
      label: t("upcomingMeetings.tabs.pending"),
      value: "pending",
    },
  ];
  const filterOptions = [
    {
      label: t("upcomingMeetings.filters.recent"),
      value: "recent",
    },
    {
      label: t("upcomingMeetings.filters.starred"),
      value: "starred",
    },
    {
      label: t("upcomingMeetings.filters.archived"),
      value: "archived",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(documentTabs[1]);
  const [isGrid, setIsGrid] = useState(true);
  const [filterValue, setFilterValue] = useState(filterOptions[0]);
  const [search, setSearch] = useState("");
  const { width } = useDimensions();
  const isMobile = width < 577;

  const locale = t?.locale || "en";

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
      status: "Confirmed",
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
      status: "Pending",
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
      status: "Confirmed",
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
      status: "Pending",
      slug: "client-call",
    },
    {
      id: 5,
      title: {
        en: "Project Discussion",
        "en-GB": "Project Meeting",
        es: "Discusión de Proyecto",
        fr: "Discussion de Projet",
      },
      date: "March 25, 2024",
      time: "02:00 PM",
      status: "Pending",
      slug: "project-discussion",
    },
    {
      id: 6,
      title: {
        en: "Team Sync-up",
        "en-GB": "Team Meeting",
        es: "Sincronización de Equipo",
        fr: "Réunion d'Équipe",
      },
      date: "April 10, 2024",
      time: "04:00 PM",
      status: "Confirmed",
      slug: "team-sync-up",
    },
    {
      id: 7,
      title: {
        en: "Client Call",
        "en-GB": "Customer Call",
        es: "Llamada con el Cliente",
        fr: "Appel Client",
      },
      date: "May 5, 2024",
      time: "11:00 AM",
      status: "Pending",
      slug: "client-call",
    },
    {
      id: 8,
      title: {
        en: "Budget Review",
        "en-GB": "Budget Meeting",
        es: "Revisión de Presupuesto",
        fr: "Révision du Budget",
      },
      date: "June 15, 2024",
      time: "09:00 AM",
      status: "Confirmed",
      slug: "budget-review",
    },
    {
      id: 9,
      title: {
        en: "One-on-One",
        "en-GB": "One-on-One Meeting",
        es: "Reunión Individual",
        fr: "Réunion Individuelle",
      },
      date: "July 20, 2024",
      time: "10:00 AM",
      status: "Pending",
      slug: "one-on-one",
    },
    {
      id: 10,
      title: {
        en: "Team Building",
        "en-GB": "Team Building Activity",
        es: "Actividad de Team Building",
        fr: "Activité de Team Building",
      },
      date: "August 5, 2024",
      time: "01:00 PM",
      status: "Confirmed",
      slug: "team-building",
    },
    {
      id: 11,
      title: {
        en: "Feedback Session",
        "en-GB": "Feedback Meeting",
        es: "Sesión de Retroalimentación",
        fr: "Session de Retour d'Information",
      },
      date: "September 10, 2024",
      time: "03:00 PM",
      status: "Pending",
      slug: "feedback-session",
    },
  ];
  const totalCount = cards.length;

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        <div className={classes.header}>
          {isMobile ? (
            <MobileHeader
              icon={<CiFileOn size={12} color="#33B5F6" />}
              title={t("upcomingMeetings.title")}
              showBack
            />
          ) : (
            <TopHeader
              icon={<CiFileOn size={12} color="#33B5F6" />}
              title={t("upcomingMeetings.title")}
              showFilters={false}
              showSearch={false}
              tabs={false}
            />
          )}

          <div className={classes.tabsMain}>
            {isMobile ? (
              <TopHeader
                title={t("upcomingMeetings.title")}
                cardsCount={totalCount}
                tabs={false}
                showFilters={true}
                showSearch={true}
                showBackBtn={false}
                search={search}
                setSearch={setSearch}
                filterOptions={filterOptions}
                mainClass={classes?.meetingHeader}
              />
            ) : (
              <TopHeader
                tabs={documentTabs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                showFilters={true}
                showSearch={true}
                showBackBtn={false}
                title={false}
                search={search}
                setSearch={setSearch}
                filterOptions={filterOptions}
              />
            )}
          </div>
        </div>
        {!isMobile ? (
          <div className={classes.content}>
            <ViewHeader
              dropdownOptions={filterOptions}
              dropDownValue={filterValue}
              setDropdownValue={setFilterValue}
              isGrid={isGrid}
              setIsGrid={setIsGrid}
            />
          </div>
        ) : (
          ""
        )}
        <div className={isGrid ? classes.cardsGrid : classes.cardsListMain}>
          {cards?.map((card) => (
            <MeetingCard
              key={card.id}
              t={t}
              data={{
                ...card,
                title: card.title[locale],
              }}
              mainClass={isGrid && classes.meetingCard}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
