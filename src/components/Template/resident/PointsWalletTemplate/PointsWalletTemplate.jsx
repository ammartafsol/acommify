"use client";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import RenderStatusCell from "@/components/organisms/AppTable/tableHelper";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import classes from "./styles.module.css";

export default function PointsWalletTemplate() {
  const { Get } = useAxios();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // const user = useSelector((state) => state.authReducer.user);
  const t = useTranslations("settingsPage");
  const c = useTranslations("common");
  const { width } = useDimensions();
  const isMobile = width < 577;

  const fetchPoints = async () => {
    setLoading("loading");
    const { response } = await Get({ route: "order/my/all" });
    if (response) {
      setData(response.data);
    }
    setLoading("");
  };
  const availableTokens = useSelector(
    (state) => state?.commonReducer?.availableTokens
  );
  console.log(availableTokens);

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <div className={classes.main}>
      <Container className="containerFluid">
        {isMobile ? (
          <MobileHeader title={t("pointsWallet.title")} showBack />
        ) : (
          <TopHeader title={t("pointsWallet.title")} tabs={false} />
        )}
        <div className={classes.balanceCard}>
          <HeaderCard
            width={false}
            title={t("pointsWallet.currentBalance")}
            description={
              (availableTokens || 0) +
              " " +
              t("pointsWallet.points")
            }
            mainClass={classes.balanceCardMain}
          />
        </div>
        {loading === "loading" ? (
          <SpinnerLoading />
        ) : (
          <div className={classes.pointsHistoryMain}>
            <p>{t("pointsWallet.pointsHistory")}</p>

            <div className={classes.cards}>
              {data
                // ?.filter((item) => item.status === "completed")
                ?.map((item, i) => (
                  <div className={classes.card} key={i}>
                    <div>
                      <div className={classes.orderRow}>
                        <p>
                          {c("order")} (#{item.orderId})
                        </p>
                        <RenderStatusCell status={item.status} />
                      </div>
                      <p>{moment(item.createdAt).format("MMM D, YYYY")}</p>
                    </div>
                    <p
                      className={
                        item?.status === "cancelled"
                          ? classes.plusPoints
                          : classes.points
                      }
                    >
                      {item?.status === "cancelled" ? "+" : "-"}
                      {item.totalPoints} &nbsp;{t("pointsWallet.points")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
