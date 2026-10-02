"use client";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { NewsData } from "@/developmentContent/dashboardData";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { Container } from "react-bootstrap";
import styles from "./styles.module.css";

export default function NewsTemplate() {
  const { width } = useDimensions();
  const isMobile = width < 577;
  const t = useTranslations("notificationsPage");
  return (
    <Container className={mergeClass("containerFluid", styles?.main)}>
      <div className={styles?.containerClass}>
        {isMobile ? (
          <MobileHeader title={t("title")} showBack={true} />
        ) : (
          <TopHeader title={t("title")} icon={false} />
        )}

        <NewsCard t={t} />
      </div>
    </Container>
  );
}

function NewsCard({ t }) {
  return (
    <div className={styles?.newsCardFull}>
      <AnnouncementCard dataNews={NewsData} customClass={styles?.newsCard} />
    </div>
  );
}
