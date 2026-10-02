"use client";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import DashboardCard from "@/components/molecules/DashboardCard";
import NotificationCard from "@/components/molecules/NotificationCard/NotificationCard";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import styles from "./styles.module.css";

export default function DashboardTemplate() {
  const { Get } = useAxios();
  const { user } = useSelector((state) => state.authReducer);
  const { width } = useDimensions();
  const isMobile = width < 577;
  const t = useTranslations("dashboardPage");
  const c = useTranslations();
  const language = useLocale();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Get({
      route: `notifications/all?limit=5&page=1`,
    }).then(({ response }) => {
      setLoading(false);
      setNotifications(response?.data || []);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={mergeClass("containerFluid", styles?.main)}>
      <div className={styles?.containerClass}>
        <Row>
          <Col lg={12}>
            <h1>{t("welcome", { name: user?.fullName?.[language] || "" })}!</h1>
          </Col>
        </Row>

        {isMobile ? (
          <Row className={styles?.mobileRow}>
            <DashboardCard data={getDashboardData(t)} />
            <Col lg={12}>
              <ActivitiesCard
                isMobile={isMobile}
                loading={loading}
                notifications={notifications}
              />
            </Col>
          </Row>
        ) : (
          <Row className={styles?.dashboardContainer}>
            <div className={styles?.leftMain}>
              <DashboardCard data={getDashboardData(t)} />

              <Row className="gy-3">
                <Col lg={12}>
                  <ActivitiesCard
                    isMobile={isMobile}
                    loading={loading}
                    notifications={notifications}
                  />
                </Col>
              </Row>
            </div>
          </Row>
        )}
      </div>
    </Container>
  );
}

function ActivitiesCard({ notifications, loading, isMobile }) {
  const t = useTranslations("notificationsPage");

  return (
    <div className={styles?.activitiesCardMain}>
      <div className={styles?.cardMaindata}>
        <h1>{t("activities.upcomingActivities")}</h1>

        {/* {isMobile && (
          <Link href={"/resident/settings/help-line"}>
            <div className={styles?.helplineDiv}>
              <Image
                src="/svg/helplineIcon.svg"
                width={24}
                height={24}
                alt="helplineIcon"
              ></Image>
              <p>{t("activities.helpLine")}</p>
              <div className="iconOutlineMain">
                <MdArrowOutward color="33B5F6" size={15} />
              </div>
            </div>
          </Link>
        )} */}
        <p>{t("activities.currentActivities")}</p>
      </div>

      {loading ? (
        <SpinnerLoading />
      ) : notifications?.length === 0 ? (
        <p className={styles.noData}>{t("noNotifications")}</p>
      ) : (
        notifications?.map((data, i) => (
          <NotificationCard data={data} key={i} />
        ))
      )}
    </div>
  );
}

function getDashboardData(t) {
  return [
    {
      label: t("dashboardCards.allBookings"),
      icon: "/svg/logout.svg",
      route: "/resident/all-bookings",
    },
    {
      label: t("dashboardCards.bookLaundry"),
      icon: "/svg/laundry.svg",
      route: "/resident/laundry-booking",
    },
    {
      label: t("dashboardCards.bookBus"),
      icon: "/svg/bus.svg",
      route: "/resident/bus-booking",
    },
    {
      label: t("dashboardCards.bookAppointment"),
      icon: "/svg/appointment.svg",
      route: "/resident/appointments",
    },
    {
      label: t("dashboardCards.visitorBooking"),
      icon: "/svg/peopleGroup.svg",
      route: "/resident/visitor-booking",
    },
    {
      label: t("dashboardCards.maintenanceRequests"),
      icon: "/svg/settings.svg",
      route: "/resident/maintenance-requests",
    },
    {
      label: t("dashboardCards.documentCenter"),
      icon: "/svg/document.svg",
      route: "/resident/document-center",
    },
    {
      label: t("dashboardCards.signInOut"),
      icon: "/svg/logout.svg",
      route: "/resident/sign-in-out-requests",
    }
  ];
}
