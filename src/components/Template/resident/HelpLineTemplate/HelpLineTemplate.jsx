"use client";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import HelpLineCard from "@/components/molecules/HelpLineCard/HelpLineCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./HelpLineTemplate.module.css";

export default function HelpLineTemplate() {
  const t = useTranslations("settingsPage");
  const { Get } = useAxios();
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const locale = useLocale();

  const { width } = useDimensions();
  const isMobile = width < 577;

  const getHelpLineData = async () => {
    setLoading("loading");

    const { response } = await Get({ route: "help-line/all" });
    if (response) {
      setData(response?.data);
    }
    setLoading("");
  };
  useEffect(() => {
    getHelpLineData();
  }, []);

  return (
    <div className={classes.main}>
      <Container className="containerFluid">
        {loading === "loading" ? (
          <SpinnerLoading />
        ) : (
          <>
            {isMobile ? (
              <MobileHeader
                title={t("helpLine.title")}
                icon={
                  <Image
                    src={"/svg/helpIcon.svg"}
                    width={16}
                    height={16}
                    alt="Help Icon"
                  />
                }
                showBack
              />
            ) : (
              <TopHeader title={t("helpLine.title")} tabs={false} showBackBtn />
            )}

            <div className={classes.welcomeDiv}>
              <HeaderCard
                width={isMobile}
                title={t("helpLine.welcomeText")}
                description={t("helpLine.description")}
              />
            </div>

            <div className={classes.cards}>
              {data?.map((card) => {
                return (
                  <HelpLineCard key={card._id} data={card} locale={locale} />
                );
              })}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
