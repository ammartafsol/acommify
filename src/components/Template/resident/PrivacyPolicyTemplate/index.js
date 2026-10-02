"use client";
import React from "react";
import { Container } from "react-bootstrap";
import styles from "./PrivacyPolicyTemplate.module.css";
import { useLocale, useTranslations } from "next-intl";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { FiSettings } from "react-icons/fi";
import useDimensions from "@/resources/hooks/useDimensions";
import { mergeClass } from "@/resources/utils/helper";
import Button from "@/components/atoms/Button";

export default function PrivacyPolicyTemplate({ data }) {
  const { width } = useDimensions();
  const t = useTranslations("PrivacyPolicyPage");
  const isMobile = width < 577;
  const locale = useLocale();
  return (
    <Container className={mergeClass("containerFluid", styles?.main)}>
      {isMobile ? (
        <MobileHeader
          title={t("title")}
          icon={<FiSettings size={16} color="#33B5F6" />}
          showBack
        />
      ) : (
        <TopHeader title={t("title")} tabs={false} />
      )}
      <div className={styles.privacyPolicy}>
        <div
          className={styles.privacyPolicyContent}
          dangerouslySetInnerHTML={{ __html: data?.htmlDescription?.[locale] }}
        />
      </div>
      {/* {isMobile && (
        <Button
          label={t("agree")}
          variant={"primary"}
          className={styles.button}
        />
      )} */}
    </Container>
  );
}
