"use client";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import Pagination from "@/components/molecules/Pagination";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";

export default function NotificationsTemplate() {
  const t = useTranslations("notificationsPage");
  const { width } = useDimensions();
  const { Get } = useAxios();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMobile = width < 577;

  const getAllNotifications = async ({ page_ = page }) => {
    const sParams = new URLSearchParams({
      page: page_,
      limit: RECORDS_LIMIT,
    });
    setLoading(true);
    const { response } = await Get({
      route: `notifications/all?${sParams.toString()}`,
    });
    setLoading(false);
    if (response?.status === "success") {
      setNotifications(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    }
  };

  useEffect(() => {
    getAllNotifications({ page_: page });
  }, []);

  return (
    <div className={classes.main}>
      <Container className="containerFluid">
        <div className={classes.content}>
          {isMobile ? (
            <MobileHeader title={t("title")} showBack />
          ) : (
            <TopHeader title={t("title")} tabs={false} />
          )}

          {loading ? (
            <SpinnerLoading />
          ) : (
            <>
              <div className={classes.notificationCards}>
                {notifications.length === 0 ? (
                  <p className={classes.noData}>{t("noNotifications")}</p>
                ) : (
                  notifications?.map((data, i) => (
                    <NotificationCard data={data} key={i} />
                  ))
                )}
              </div>
              {totalRecords > RECORDS_LIMIT && (
                <Pagination
                  currentPage={page}
                  totalRecords={totalRecords}
                  limit={RECORDS_LIMIT}
                  setCurrentPage={(p) => {
                    setPage(p);
                    getAllNotifications({ page_: p });
                  }}
                />
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
