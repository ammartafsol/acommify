"use client";
import Button from "@/components/atoms/Button";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import CancelModal from "@/components/organisms/Modals/CancelModal";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import moment from "moment-timezone";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./styles.module.css";

export default function VisitorConfirmationTemplate({ slug }) {
  const router = useRouter();
  const locale = useLocale();
  const { width } = useDimensions();
  const t = useTranslations("VisitorBookingConfirmation");
  const { Get, Post } = useAxios();
  const [data, setData] = useState(null);
  const isMobile = useMemo(() => width < 577, [width]);
  const status = data?.status;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isCancelled = status === "cancelled";
  const isCompleted = status === "completed";
  const isRejected = status === "rejected";

  const [loading, setLoading] = useState({
    getData: false,
  });
  const [show, setShow] = useState(false);

  const getStatusContent = useCallback(
    (isMobile) => {
      if (isPending) {
        return {
          title: isMobile ? t("pendingTitle") : t("pendingTitle"),
          description: t("pendingDescription"),
        };
      } else if (isCancelled) {
        return {
          title: isMobile ? t("cancelledTitle") : t("cancelledTitle"),
          description: t("cancelledDescription"),
        };
      } else if (isRejected) {
        return {
          title: isMobile ? t("rejectedTitle") : t("rejectedTitle"),
          description: t("rejectedDescription"),
        };
      } else if (isCompleted) {
        return {
          title: isMobile ? t("completedTitle") : t("completedTitle"),
          description: t("completedDescription"),
        };
      } else {
        return {
          title: isMobile ? t("confirmedTitle") : t("confirmedTitle"),
          description: t("confirmedDescription"),
        };
      }
    },
    [isPending, isCancelled, isRejected, isCompleted, t]
  );

  const getData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getData: true }));
    const { response } = await Get({
      route: `booking/detail/${slug}`,
    });
    if (response?.status === "success") {
      setData(response?.data);
    }
    setLoading((prev) => ({ ...prev, getData: false }));
  }, [slug]);

  const cancelBooking = useCallback(async () => {
    setShow(false);
    setLoading((prev) => ({ ...prev, cancelBooking: true }));
    const { response } = await Post({
      route: `booking/cancel/${slug}`,
    });
    if (response?.status === "success") {
      RenderToast({ type: "success", message: t("cancelSuccess") });
      router.push("/resident/appointments/visitor-booking");
    }
    setLoading((prev) => ({ ...prev, cancelBooking: false }));
  }, [slug]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container className={mergeClass(styles.main, "containerFluid")}>
      {isMobile ? (
        <MobileHeader title={getStatusContent(true).title} showBack={true} />
      ) : (
        <TopHeader title={getStatusContent(false).title} icon={false} />
      )}

      {loading.getData ? (
        <SpinnerLoading />
      ) : (
        <div className={styles?.cardMain}>
          <div className={styles?.calendarContainer}>
            <div className={styles.bookingContainer}>
              <div className={styles?.calendarImg}>
                <div>
                  <Image
                    src={
                      isPending
                        ? "/svg/bookingInfo.svg"
                        : isCancelled || isRejected
                        ? "/svg/bookingCancelled.svg"
                        : "/svg/calendarImg.svg"
                    }
                    fill
                    alt="bookingConfirm"
                  />
                </div>
              </div>
              <div className={styles?.bookingDescription}>
                <h2>{getStatusContent(false).title}</h2>
                <p>{getStatusContent(false).description}</p>
              </div>
            </div>

            <BookDetails locale={locale} data={data} />
          </div>
          {/* Action buttons */}
          {isPending || isAccepted ? (
            <div className={styles?.btnMain}>
              <div className={styles?.buttonsConfirm}>
                <Button
                  large
                  variant="red"
                  label={t("cancelBooking")}
                  onClick={() => setShow(true)}
                  loading={loading.cancelBooking}
                  showSpinner
                  disabled={loading.cancelBooking}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {show && (
        <CancelModal
          icon="/svg/cancel.svg"
          show={show}
          setShow={setShow}
          content={"VisitorBookingConfirmation.CancelModal"}
          onConfirm={cancelBooking}
        />
      )}
    </Container>
  );
}

function BookDetails({ locale, data }) {
  return (
    <div className={styles.bookingDetails}>
      <h2>
        <span>
          <Image
            src="/svg/bookingTime.svg"
            width={13}
            height={13}
            alt="time"
          ></Image>
        </span>
        {moment(data?.bookingStartDate).format("HH:mm a")} -{" "}
        {moment(data?.bookingEndDate).format("HH:mm a")}
      </h2>
      <h2>
        <span>
          <Image
            src="/svg/bookingDate.svg"
            width={13}
            height={13}
            alt="date"
          ></Image>
        </span>
        {moment(data?.bookingStartDate).format("ddd, DD MMM YYYY")}
      </h2>
      <h2>
        <span>
          <Image
            src="/svg/user.svg"
            width={13}
            height={13}
            alt="booking"
          ></Image>
        </span>
        {data?.visitorName || data?.visitorName?.[locale]}
      </h2>
    </div>
  );
}
