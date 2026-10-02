"use client";

import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import RenderToast from "@/components/atoms/RenderToast";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import DropDown from "@/components/molecules/DropDown/DropDown";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TimeSlots from "@/components/molecules/TimeSlots/TimeSlots";
import TimeSlots2Hour from "@/components/molecules/TimeSlots/TimeSlots2Hour";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import CalendarComponent from "@/components/organisms/Calender/Calender";
import VisitorBookingFormModal from "@/components/organisms/Modals/VisitorBookingFormModal";
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
import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";

export default function VisitorBookingTemplate() {
  const router = useRouter();
  const locale = useLocale();
  const { Get, Post } = useAxios();
  const t = useTranslations("visitors");
  const { user } = useSelector((state) => state.authReducer);
  const t1 = useTranslations("common");
  const { width } = useDimensions();
  const isMobile = useMemo(() => width < 577, [width]);
  const [isTodayClicked, setIsTodayClicked] = useState(false);

  const [show, setShow] = useState(false);
  const [accommodation, setAccommodation] = useState(null);
  const [accommodationOptions, setAccommodationOptions] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("1hour");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [data, setData] = useState([]);
  const [customValue, setCustomValue] = useState("");
  const [reminder, setReminder] = useState({
    hour: false,
    thirty: false,
    fifteen: false,
    custom: false,
  });
  const [loading, setLoading] = useState({
    getAccommodations: false,
    getSlots: false,
    booking: false,
  });

  const fetchAccommodationOptions = useCallback(
    async (signal) => {
      setLoading((prev) => ({ ...prev, getAccommodations: true }));
      const { response, error } = await Get({
        route: "accommodation/all",
        signal,
      });
      if (response?.status === "success") {
        setAccommodationOptions(
          response?.data?.map((type) => ({
            ...type,
            label: type.accommodationNumber,
            value: type.slug,
          }))
        );
      }
      if (error?.code !== "ERR_CANCELED") {
        setLoading((prev) => ({ ...prev, getAccommodations: false }));
      }
    },
    [locale]
  );

  const fetchSlots = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getSlots: true }));
    const sParams = new URLSearchParams({
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
    const { response } = await Get({
      route: `accommodation/detail/${
        accommodation?.value
      }?${sParams.toString()}`,
    });
    if (response?.status === "success") {
      setData(response?.data);
    }
    setLoading((prev) => ({ ...prev, getSlots: false }));
  }, [accommodation, dateRange]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAccommodationOptions(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchAccommodationOptions]);

  useEffect(() => {
    if (accommodation && dateRange.start && dateRange.end) {
      fetchSlots();
    }
  }, [accommodation, dateRange, fetchSlots]);

  const handleRangeChange = useCallback((e) => {
    let start, end;
    if (e.start && e.end) {
      ({ start, end } = e);
    } else if (Array.isArray(e)) {
      if (e.length === 1) {
        start = e[0];
        end = moment(e[0]).endOf("day").toDate();
      } else {
        start = e[0];
        end = moment(e[e.length - 1])
          .endOf("day")
          .toDate();
      }
    }
    start = moment(start).toISOString(true);
    end = moment(end).toISOString(true);
    setDateRange({ start, end });
  }, []);

  const handleDaySelect = useCallback(
    ({ date }) => {
      setSelectedSlot(null);
      setSelectedDuration("1hour");
      const bookedSlotsMap = new Map();
      data?.bookedSlots?.forEach((slot) => {
        const key = `${slot.start}-${slot.end}`;
        if (
          ["rejected", "cancelled"].includes(slot?.status) &&
          !slot?.userSlug
        ) {
          return;
        } else if (
          ["rejected", "cancelled"].includes(slot?.status) &&
          slot?.userSlug
        ) {
          const slotCopy = { ...slot };
          delete slotCopy.userSlug;
          bookedSlotsMap.set(key, slotCopy);
        } else {
          bookedSlotsMap.set(key, slot);
        }
      });

      const daySlots = data?.schedule?.filter(
        (e) =>
          moment(e?.start).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      );

      const slots = daySlots?.map((slot) => ({
        ...slot,
        start: moment(slot.start).local(true).format(""),
        end: moment(slot.end).local(true).format(""),
        type: bookedSlotsMap.has(`${slot.start}-${slot.end}`)
          ? bookedSlotsMap.get(`${slot.start}-${slot.end}`)?.userSlug ===
            user?.slug
            ? "your"
            : "booked"
          : "available",
      }));
      setSlots(slots || []);
      setSelectedDate(date);
    },
    [data, user?.slug]
  );

  const handleBookNow = useCallback(
    async (visitorData = null) => {
      setLoading((prev) => ({ ...prev, booking: true }));
      if (selectedSlot) {
        // Calculate reminder value in minutes
        let reminderMinutes = 0;
        if (reminder.hour) reminderMinutes = 60;
        else if (reminder.thirty) reminderMinutes = 30;
        else if (reminder.fifteen) reminderMinutes = 15;
        else if (reminder.custom && customValue) {
          const customMinutes = parseInt(customValue);
          if (!isNaN(customMinutes) && customMinutes > 0) {
            reminderMinutes = customMinutes;
          }
        }

        const payload = {
          serviceType: "accommodation",
          slug: accommodation?.value,
          bookingStartDate: moment(selectedSlot.start).toISOString(),
          bookingEndDate: moment(selectedSlot.end).toISOString(),
          duration: selectedDuration,
          ...visitorData,
          ...(Boolean(reminderMinutes) && { setReminder: reminderMinutes }),
        };
        const { response } = await Post({
          route: "booking/create",
          data: payload,
        });
        if (response?.status === "success") {
          RenderToast({
            type: "success",
            message: t("bookingSuccess"),
          });
          setSlots([]);
          setSelectedDate(null);
          setSelectedSlot(null);
          setSelectedDuration("1hour");
          setReminder({
            hour: false,
            thirty: false,
            fifteen: false,
            custom: false,
          });
          setCustomValue("");
          fetchSlots();
          setShow(false);
        }
      }
      setLoading((prev) => ({ ...prev, booking: false }));
    },
    [selectedSlot, accommodation, Post, t, fetchSlots]
  );

  useEffect(() => {
    if (isTodayClicked) {
      handleDaySelect({ date: new Date() });
      setIsTodayClicked(false);
    }
  }, [data]);

  const events = useMemo(() => {
    const seen = new Set();
    return data?.bookedSlots?.reduce((acc, slot, slotIndex) => {
      const myBooking = slot?.userSlug === user?.slug;
      if (!myBooking) return acc;
      const key = slot?.bookingSlug || slotIndex;
      if (seen.has(key)) return acc;
      seen.add(key);
      const start = moment(slot.start).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const end = moment(slot.end).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      acc.push({
        id: key,
        title: `${moment(start).format("h:mm a")} - ${moment(end).format(
          "h:mm a"
        )}`,
        start,
        end,
        myBooking,
        status: slot?.status,
        resource: {
          type: "visitor",
          count: 1,
          ...slot,
        },
      });
      return acc;
    }, []);
  }, [data, user?.slug]);

  return (
    <Container className={mergeClass(styles.main, "containerFluid")}>
      {isMobile ? (
        <MobileHeader
          title={t("VisitorBooking.title")}
          showBack
          icon={
            <Image src="/svg/visitors.svg" alt="Back" width={14} height={14} />
          }
        />
      ) : (
        <TopHeader title={t("VisitorBooking.title")} icon={false} />
      )}

      <div className={styles.dropDownContainer}>
        <DropDown
          label={t("selectAccommodation")}
          placeholder={t("selectAccommodationPlaceholder", {
            loading: loading.getAccommodations,
          })}
          disabled={loading.getAccommodations}
          options={accommodationOptions}
          value={accommodation}
          setValue={(accommodation) => {
            setAccommodation(accommodation);
            setSelectedDate(null);
            setSelectedSlot(null);
            setSlots([]);
          }}
        />
      </div>
      <div className={styles?.CalendarComponentMain}>
        <Wrapper
          active={!accommodation || loading.getSlots}
          loading={loading.getSlots}
          message={!accommodation && t("accommodationSelectMessage")}
          zIndex={10}
        >
          <CalendarComponent
            userSelectedDate={selectedDate}
            events={events || []}
            onRangeChange={handleRangeChange}
            onTodayClick={() => setIsTodayClicked(true)}
            onDaySelect={handleDaySelect}
            onEventClick={(event) => {
              router.push(
                `/resident/appointments/visitor-booking/booking-confirmation/${event?.resource?.bookingSlug}`
              );
            }}
          />
        </Wrapper>
        <Wrapper
          className={styles?.CalendarComponentRight}
          overlayClassName={styles?.overlayCustom}
          active={!selectedDate}
          message={!selectedDate && t("selectDateMessage")}
          zIndex={10}
        >
          <>
            {selectedDate && (
              <div className={styles.selectedDate}>
                <h4>{t("selectedDate")}</h4>
                <p>{moment(selectedDate).format("ddd, DD MMM YYYY")}</p>
              </div>
            )}

            {selectedDate && (
              <div className={styles.durationTabs}>
                <h4>{t("selectDuration")}</h4>
                <div className={styles.tabsContainer}>
                  <button
                    className={`${styles.durationTab} ${
                      selectedDuration === "1hour" ? styles.active : ""
                    }`}
                    onClick={() => {
                      setSelectedDuration("1hour");
                      setSelectedSlot(null);
                    }}
                  >
                    <span>{t("durations.1hour")}</span>
                  </button>
                  <button
                    className={`${styles.durationTab} ${
                      selectedDuration === "2hour" ? styles.active : ""
                    }`}
                    onClick={() => {
                      setSelectedDuration("2hour");
                      setSelectedSlot(null);
                    }}
                  >
                    <span>{t("durations.2hour")}</span>
                  </button>
                </div>
              </div>
            )}

            {selectedDuration === "1hour" ? (
              <TimeSlots
                slots={slots}
                selectedSlot={selectedSlot}
                onSlotClick={setSelectedSlot}
              />
            ) : (
              <TimeSlots2Hour
                slots={slots}
                selectedSlot={selectedSlot}
                onSlotClick={setSelectedSlot}
              />
            )}

            {selectedSlot && (
              <div className={styles.reminderSection}>
                <div className={styles.reminderHeader}>
                  <Image
                    src="/svg/bell.svg"
                    width={20}
                    height={20}
                    alt="reminder"
                  />
                  <h4>{t("reminder")}</h4>
                </div>

                <div className={styles.reminderOptions}>
                  <Checkbox
                    className={styles.reminderCheckbox}
                    label={t("reminders.reminderOptions.1hour")}
                    value={reminder.hour}
                    setValue={(val) => {
                      setReminder({
                        hour: val,
                        thirty: false,
                        fifteen: false,
                        custom: false,
                      });
                      setCustomValue("");
                    }}
                  />
                  <Checkbox
                    className={styles.reminderCheckbox}
                    label={t("reminders.reminderOptions.30min")}
                    value={reminder.thirty}
                    setValue={(val) => {
                      setReminder({
                        hour: false,
                        thirty: val,
                        fifteen: false,
                        custom: false,
                      });
                      setCustomValue("");
                    }}
                  />
                  <Checkbox
                    className={styles.reminderCheckbox}
                    label={t("reminders.reminderOptions.15min")}
                    value={reminder.fifteen}
                    setValue={(val) => {
                      setReminder({
                        hour: false,
                        thirty: false,
                        fifteen: val,
                        custom: false,
                      });
                      setCustomValue("");
                    }}
                  />
                  <Checkbox
                    className={styles.reminderCheckbox}
                    label={t("reminders.reminderOptions.custom")}
                    value={reminder.custom}
                    setValue={(val) => {
                      setReminder({
                        hour: false,
                        thirty: false,
                        fifteen: false,
                        custom: val,
                      });
                      if (!val) setCustomValue("");
                    }}
                  />
                  {reminder.custom && (
                    <input
                      type="number"
                      className={styles.customInput}
                      placeholder={t("reminders.customPlaceholderText")}
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      min="1"
                      max="1440"
                    />
                  )}
                </div>
              </div>
            )}

            <div className={styles.bookingWarning}>
              <ReactSVG
                className={mergeClass(styles.warningIcon, "reactSvg")}
                src="/svg/redClock.svg"
              />
              <p>{t("VisitorBooking.bookingWarning")}</p>
            </div>

            <div>
              <Button
                className={styles.buttons}
                variant="primary"
                label={t1("bookNow")}
                onClick={() => setShow(true)}
                disabled={!selectedSlot || loading.booking}
                loading={loading.booking}
                showSpinner
              />
            </div>
          </>
        </Wrapper>
      </div>
      {show && (
        <VisitorBookingFormModal
          setShow={setShow}
          show={show}
          t={t}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          accommodation={accommodation}
          onBookingSuccess={handleBookNow}
        />
      )}
    </Container>
  );
}
