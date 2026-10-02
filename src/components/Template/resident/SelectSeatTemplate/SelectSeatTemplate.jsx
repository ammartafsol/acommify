"use client";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import BusTimeDetailCard from "@/components/molecules/BusTimeDetailCard/BusTimeDetailCard";
import ConfirmationBookingCard from "@/components/molecules/ConfirmationBookingCard/ConfirmationBookingCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import PassengerCard from "@/components/molecules/PassengerCard/PassengerCard";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import BusSeatSelector from "@/components/organisms/BusSeatSelector/BusSeatSelector";
import BusSeatModal from "@/components/organisms/Modals/BusSeatModal/BusSeatModal";
import CancelModal from "@/components/organisms/Modals/CancelModal";
import { Link, useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { baseURL, imageUrl } from "@/resources/utils/helper";
import axios from "axios";
import moment from "moment-timezone";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import classes from "./styles.module.css";
import { useLocaleAwareBack } from "@/resources/hooks/useLocaleAwareBack";

export default function SelectSeatTemplate({ slug, bookingSlug, date }) {
  const router = useRouter();
  const { width } = useDimensions();
  const handleBack = useLocaleAwareBack();
  const { Get, Post } = useAxios();
  const { accessToken } = useSelector((state) => state.authReducer);
  const selectedDate = date;
  const t1 = useTranslations("busBooking.selectSeat");
  const t2 = useTranslations("busBooking.bookingConfirmation");
  const t3 = useTranslations("busBooking.eTicket");
  const isMobile = width < 577;
  const [step, setStep] = useState(bookingSlug ? 3 : 1);
  const [show, setShow] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const initialMount = useRef(true);
  const [busDetail, setBusDetail] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loading, setLoading] = useState({
    getBus: false,
    confirmBooking: false,
    downloadTicket: false,
    cancelBooking: false,
    getBooking: false,
  });
  const [reminder, setReminder] = useState({
    hour: false,
    thirty: false,
    fifteen: false,
    custom: false,
  });
  const [customValue, setCustomValue] = useState("");
  const isPending = bookingDetail?.status === "pending";
  const isCancelled = bookingDetail?.status === "cancelled";
  const isCompleted = bookingDetail?.status === "completed";
  const isRejected = bookingDetail?.status === "rejected";

  const confirmBookingHandler = async () => {
    setLoading((prev) => ({ ...prev, confirmBooking: true }));
    let reminderMinutes = 0;
    if (reminder.hour) reminderMinutes = 60;
    else if (reminder.thirty) reminderMinutes = 30;
    else if (reminder.fifteen) reminderMinutes = 15;
    else if (reminder.custom) reminderMinutes = parseInt(customValue) || 0;
    const payload = {
      serviceType: "bus",
      slug: busDetail?.slug,
      ...(Boolean(reminderMinutes) && { setReminder: reminderMinutes }),
      bookingStartDate: moment(
        `${selectedDate} ${busDetail?.schedule?.startTime}`
      ).toISOString(),
      bookingEndDate: moment(
        `${selectedDate} ${busDetail?.schedule?.endTime}`
      ).toISOString(),
      seats: selected,
    };
    const { response } = await Post({
      route: "booking/create",
      data: payload,
    });
    if (response?.status === "success") {
      setBookingDetail(response?.data);
      RenderToast({ type: "success", message: t2("bookingConfirm") });
      setStep(3);
    }
    setLoading((prev) => ({ ...prev, confirmBooking: false }));
  };

  const handleDownload = useCallback(async () => {
    setLoading((prev) => ({ ...prev, downloadTicket: true }));

    if (!accessToken) {
      RenderToast({ type: "error", message: t3("authenticationRequired") });
      setLoading((prev) => ({ ...prev, downloadTicket: false }));
      return;
    }

    if (!bookingDetail?.slug) {
      RenderToast({
        type: "error",
        message: t3("bookingInformationNotAvailable"),
      });
      setLoading((prev) => ({ ...prev, downloadTicket: false }));
      return;
    }

    const response = await axios.get(
      baseURL(`booking/invoice/download/${bookingDetail?.slug}`),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/pdf",
          "ngrok-skip-browser-warning": "69420",
        },
        responseType: "blob",
      }
    );

    const blob = response.data;

    if (blob.size === 0) {
      RenderToast({ type: "error", message: t3("pdfFileEmpty") });
      setLoading((prev) => ({ ...prev, downloadTicket: false }));
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `e-ticket-${bookingDetail?.slug}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    RenderToast({ type: "success", message: t3("pdfDownloadedSuccessfully") });
    setLoading((prev) => ({ ...prev, downloadTicket: false }));
  }, [bookingDetail, accessToken]);

  const handleCancelBooking = useCallback(() => {
    setLoading((prev) => ({ ...prev, cancelBooking: true }));
    Post({
      route: `booking/cancel/${bookingDetail?.slug}`,
    }).then(({ response }) => {
      setLoading((prev) => ({ ...prev, cancelBooking: false }));
      if (response?.status === "success") {
        RenderToast({ type: "success", message: t3("cancelSuccess") });
        getBookingDetail();
      } else {
        RenderToast({ type: "error", message: t3("cancelError") });
      }
    });
    setLoading((prev) => ({ ...prev, cancelBooking: false }));
    setShowAreYouSure(false);
  }, [bookingDetail]);

  const getBusDetail = useCallback(() => {
    setLoading((prev) => ({ ...prev, getBus: true }));
    Get({
      route: `bus/detail/${slug}?date=${selectedDate}`,
    }).then(({ response }) => {
      if (response?.status === "success") {
        setBusDetail({ ...response?.data });
      }
      setLoading((prev) => ({ ...prev, getBus: false }));
    });
  }, [slug, selectedDate]);

  const getBookingDetail = useCallback(() => {
    setLoading((prev) => ({ ...prev, getBooking: true }));
    Get({
      route: `booking/detail/${bookingSlug}`,
    }).then(({ response }) => {
      if (response?.status === "success") {
        setBookingDetail({ ...response?.data });
      } else {
        setStep(1);
      }
    });
    setLoading((prev) => ({ ...prev, getBooking: false }));
  }, [bookingSlug]);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      getBusDetail();
    }

    return () => {
      initialMount.current = true;
    };
  }, [slug, selectedDate]);

  useEffect(() => {
    if (bookingSlug) {
      getBookingDetail();
    }
  }, [bookingSlug]);

  const bookedSeats = useMemo(() => {
    if (!busDetail) return [];
    const seats = busDetail?.bookedSlots?.map((b) => b?.seat?.seatNumber);
    return seats || [];
  }, [busDetail]);

  function StepOneLeft() {
    return (
      <>
        <div className={classes.leftContent}>
          <div className={classes.seatsMain}>
            <BusSeatSelector
              selectedSeats={selected?.map((s) => s.seatNumber) || []}
              onSelectSeat={(arr, seat) => {
                if (selected?.some((s) => s?.seatNumber === seat)) {
                  setSelected(selected.filter((s) => s.seatNumber !== seat));
                } else {
                  setShow(seat);
                }
              }}
              busType={`${busDetail?.capacity}-seater`}
              seatData={bookedSeats}
            />
          </div>
          {busDetail && (
            <div className={classes.busCard}>
              <BusTimeDetailCard data={busDetail} selectedDate={selectedDate} />
            </div>
          )}
        </div>
      </>
    );
  }

  function StepTwoLeft() {
    return (
      <>
        <div className={classes.trips}>
          <p>{t2("yourTrip")}</p>

          <ConfirmationBookingCard
            bus={busDetail}
            selectedDate={selectedDate}
            t2={t2}
          />
        </div>
        <div className={classes.passengersList}>
          <p>{t2("passengerList")}</p>
          <PassengerList passengers={selected} />
        </div>
      </>
    );
  }

  function StepThreeLeft() {
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.calendarImg}>
            <div>
              <Image
                src={
                  isPending
                    ? "/svg/bookingInfo.svg"
                    : isCancelled || isRejected
                    ? "/svg/bookingCancelled.svg"
                    : "/svg/calendarImg.svg"
                }
                alt="calendar"
                fill
              />
            </div>
          </div>
          <div className={classes.confirmedText}>
            <p>
              {isPending
                ? t3("bookingPending")
                : isCancelled
                ? t3("bookingCancelled")
                : isCompleted
                ? t3("bookingCompleted")
                : isRejected
                ? t3("bookingRejected")
                : t3("bookingConfirmed")}
            </p>
            <p>
              {isPending
                ? t3("descriptionPending")
                : isCancelled
                ? t3("descriptionCancelled")
                : isCompleted
                ? t3("descriptionCompleted")
                : isRejected
                ? t3("descriptionRejected")
                : t3("description")}
            </p>
          </div>
        </div>
        <div className={classes.trips}>
          <p>{t2("yourTrip")}</p>

          <ConfirmationBookingCard
            bus={busDetail}
            selectedDate={selectedDate}
            t2={t2}
          />
        </div>

        <div className={classes.passengersList}>
          <p>{t2("passengerList")}</p>
          <PassengerList
            passengers={
              bookingDetail?.seats?.map((s) => ({
                ...s,
                seatNumber: s?.seat?.seatNumber,
              })) || []
            }
          />
        </div>
      </div>
    );
  }

  function GetCurrentStepData([choice1, choice2, choice3]) {
    if (step === 1) return choice1;
    if (step === 2) return choice2;
    if (step === 3) return choice3;
  }

  return (
    <>
      <div className={classes.container}>
        <Container className="containerFluid">
          {isMobile ? (
            <MobileHeader
              title={GetCurrentStepData([
                t1("title"),
                t2("title"),
                t3("title"),
              ])}
              showBack={true}
            />
          ) : (
            <TopHeader
              title={GetCurrentStepData([
                t1("title"),
                t2("title"),
                t3("title"),
              ])}
              onBack={() => {
                if (step === 1) {
                  handleBack();
                } // Inside back button logic
                else if (step === 3) {
                  if (bookingSlug) {
                    handleBack();
                  }
                  setStep(1);
                  setReminder({
                    hour: false,
                    thirty: false,
                    fifteen: false,
                    custom: false,
                  });
                  setTermsAgreed(false);
                  setSelected([]);
                  getBusDetail();
                  setCustomValue("");
                } else {
                  setStep(step - 1);
                }
              }}
              isBackBtnDisabled={loading.confirmBooking || loading.getBooking}
            />
          )}
          <div className={classes.main}>
            {loading.getBus || loading.getBooking ? (
              <SpinnerLoading />
            ) : step === 1 ? (
              // Special layout for step 1: left section takes full width, right content below
              <div className={classes.stepOneContainer}>
                <div className={classes.left}>
                  {GetCurrentStepData([
                    <StepOneLeft />,
                    <StepTwoLeft />,
                    <StepThreeLeft />,
                  ])}
                </div>

                <div className={classes.right}>
                  {selected.length > 0 && (
                    <div className={classes.rightContent}>
                      <PassengerList passengers={selected} />
                    </div>
                  )}

                  <Button
                    label={t1("continue")}
                    variant={"primary"}
                    className={classes.continueBtn}
                    onClick={() => {
                      setStep(2);
                    }}
                    disabled={selected.length === 0}
                    loading={loading.confirmBooking}
                    showSpinner
                    customStyle={{
                      width: "max-content",
                      minWidth: "30%",
                    }}
                  />
                </div>
              </div>
            ) : (
              // Original layout for steps 2 and 3
              <>
                <div className={classes.left}>
                  {GetCurrentStepData([
                    <StepOneLeft />,
                    <StepTwoLeft />,
                    <StepThreeLeft />,
                  ])}
                </div>

                <div className={classes.right}>
                  {selected.length > 0 && step === 2 && (
                    <>
                      <div className={classes.termsAndCondition}>
                        <Checkbox
                          label={
                            <>
                              {t1("termsAgreement")}
                              <Link
                                onClick={(e) => {
                                  e.preventDefault();
                                  const doc = imageUrl(busDetail?.document);
                                  if (doc) {
                                    window.open(doc, "_blank");
                                  }
                                }}
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#007bff",
                                  textDecoration: "underline",
                                }}
                              >
                                {t1("termsAndConditions")}
                              </Link>
                            </>
                          }
                          value={termsAgreed}
                          setValue={setTermsAgreed}
                        />
                      </div>

                      <ReminderBox
                        isMobile={isMobile}
                        t3={t3}
                        reminder={reminder}
                        setReminder={setReminder}
                        customValue={customValue}
                        setCustomValue={setCustomValue}
                      />
                    </>
                  )}

                  {step !== 3 && (
                    <Button
                      label={GetCurrentStepData([
                        t1("continue"),
                        t2("confirmBooking"),
                      ])}
                      variant={"primary"}
                      className={classes.continueBtn}
                      onClick={() => {
                        if (step === 1) {
                          setStep(2);
                        } else if (step === 2) {
                          confirmBookingHandler();
                        } else {
                          setStep(3);
                        }
                      }}
                      disabled={
                        (step === 2 && !termsAgreed) ||
                        selected.length === 0 ||
                        loading.confirmBooking
                      }
                      loading={loading.confirmBooking}
                      showSpinner
                    />
                  )}
                  {/* Button logic based on booking status */}
                  {step === 3 &&
                    ["accepted", "pending"]?.includes(
                      bookingDetail?.status
                    ) && (
                      <Button
                        label={t3("cancelBooking")}
                        variant={"red"}
                        large
                        onClick={() => setShowAreYouSure(true)}
                        disabled={loading.cancelBooking}
                        loading={loading.cancelBooking}
                        showSpinner
                      />
                    )}
                  {step === 3 &&
                    ["accepted"]?.includes(bookingDetail?.status) && (
                      <Button
                        label={t3("downloadBtnLabel")}
                        variant={"primary"}
                        className={classes.downloadButton}
                        onClick={handleDownload}
                        disabled={loading.downloadTicket}
                        loading={loading.downloadTicket}
                        showSpinner
                        leftIcon={<FiDownload size={24} color="#fff" />}
                      />
                    )}
                </div>
              </>
            )}
          </div>
          {showAreYouSure && (
            // <AreYouSureModal
            //   onConfirm={handleCancelBooking}
            //   show={showAreYouSure}
            //   setShow={setShowAreYouSure}
            //   loading={loading.cancelBooking}
            // />
            <CancelModal
              icon="/svg/cancel.svg"
              show={showAreYouSure}
              setShow={setShowAreYouSure}
              content="busBooking.eTicket.cancelBookingModal"
              onConfirm={handleCancelBooking}
            />
          )}
        </Container>
      </div>

      {show && (
        <BusSeatModal
          show={show}
          setShow={setShow}
          data={show}
          onConfirm={(seatInfo) => {
            setSelected((prev) => [...prev, seatInfo]);
          }}
        />
      )}
    </>
  );
}

function PassengerList({ passengers }) {
  return passengers?.map((passenger, index) => (
    <PassengerCard key={index} data={passenger} />
  ));
}

function ReminderBox({
  isMobile,
  t3,
  reminder,
  setReminder,
  customValue,
  setCustomValue,
}) {
  const handleReminderChange = (key, val) => {
    if (val) {
      setReminder({
        hour: key === "hour",
        thirty: key === "thirty",
        fifteen: key === "fifteen",
        custom: key === "custom",
      });
    } else {
      setReminder({
        hour: false,
        thirty: false,
        fifteen: false,
        custom: false,
      });
    }
  };

  return (
    <>
      <div className={classes.reminderBox}>
        {!isMobile && (
          <p className={classes.reminderTitle}>{t3("reminders.title")}</p>
        )}
        <Checkbox
          label={t3("reminders.reminderOptions.1hour")}
          value={reminder.hour}
          setValue={(val) => handleReminderChange("hour", val)}
        />
        <Checkbox
          label={t3("reminders.reminderOptions.30min")}
          value={reminder.thirty}
          setValue={(val) => handleReminderChange("thirty", val)}
        />
        <Checkbox
          label={t3("reminders.reminderOptions.15min")}
          value={reminder.fifteen}
          setValue={(val) => handleReminderChange("fifteen", val)}
        />
        <Checkbox
          label={t3("reminders.reminderOptions.custom")}
          value={reminder.custom}
          setValue={(val) => handleReminderChange("custom", val)}
        />
        {reminder.custom && (
          <input
            type="number"
            className={classes.customInput}
            placeholder={t3("reminders.customPlaceholderText")}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
          />
        )}
      </div>
    </>
  );
}
