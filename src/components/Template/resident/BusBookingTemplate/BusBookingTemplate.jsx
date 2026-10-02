"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import BusTimeDetailCard from "@/components/molecules/BusTimeDetailCard/BusTimeDetailCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import Tabs from "@/components/molecules/Tabs/Tabs";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import CalendarComponent from "@/components/organisms/Calender/Calender";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import moment from "moment-timezone";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";

const SHIFT_TABS = [
  {
    label: "availableBusesTabs.morning",
    value: "morning",
  },
  {
    label: "availableBusesTabs.afternoon",
    value: "afternoon",
  },
  {
    label: "availableBusesTabs.evening",
    value: "evening",
  },
];

export default function BusBookingTemplate() {
  const t = useTranslations("busBooking");
  const locale = useLocale();
  const router = useRouter();
  const { width } = useDimensions();
  const isMobile = width < 577;
  const { Get } = useAxios();
  const [bookings, setBookings] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [shift, setShift] = useState(SHIFT_TABS[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [buses, setBuses] = useState([]);
  const [isTodayClicked, setIsTodayClicked] = useState(false);

  const [loading, setLoading] = useState({
    getBookings: false,
    getBuses: false,
  });

  const getBookings = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getBookings: true }));
    const sParams = new URLSearchParams({
      serviceType: "bus",
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
    const { response } = await Get({
      route: `booking/my/all?${sParams.toString()}`,
    });
    if (response?.status === "success") {
      setBookings(response?.data || []);
    }
    setLoading((prev) => ({ ...prev, getBookings: false }));
  }, [dateRange]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      getBookings();
    }
  }, [dateRange]);

  useEffect(() => {
    if (isTodayClicked) {
      setSelectedDate(new Date());
      setIsTodayClicked(false);
    }
  }, [bookings]);

  // Calendar range change handler
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

  const handleGetBuses = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getBuses: true }));
    const sParams = new URLSearchParams({
      date: moment(selectedDate).format("YYYY-MM-DD"),
      shift: shift.value,
      page: 1,
      limit: 50,
    });
    const { response } = await Get({
      route: `bus/all?${sParams.toString()}`,
    });
    if (response?.status === "success") {
      setBuses(response?.data || []);
    }
    setLoading((prev) => ({ ...prev, getBuses: false }));
  }, [shift, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      handleGetBuses();
    }
  }, [handleGetBuses]);

  const events = bookings?.map((booking, idx) => ({
    id: booking?.bookingId || idx,
    title: `${booking?.bus?.name?.[locale]} ${moment(booking?.bookingStartDate)
      .locale(locale)
      .format("h:mm a")} - ${moment(booking?.bookingEndDate)
      .locale(locale)
      .format("h:mm a")}`,
    showPrefixTitle: false,
    start: booking?.bookingStartDate,
    end: booking?.bookingEndDate,
    resource: booking,
    status: booking?.status,
  }));

  return (
    <Container className={mergeClass("containerFluid", classes.container)}>
      {isMobile ? (
        <MobileHeader
          title={t("title")}
          showBack={true}
          icon={
            <Image
              src={"/svg/buses2.svg"}
              alt="bus icon"
              height={16}
              width={16}
            />
          }
        />
      ) : (
        <TopHeader title={t("title")} />
      )}
      <div className={classes.calendarMain}>
        {/* calendar */}
        <div className={classes.calendar}>
          <Wrapper
            message={null}
            active={loading?.getBookings}
            loading={loading?.getBookings}
            zIndex={10}
          >
            <CalendarComponent
              userSelectedDate={selectedDate}
              events={events}
              onTodayClick={() => setIsTodayClicked(true)}
              onEventClick={(event) => {
                router.push(
                  `/resident/bus-booking/${
                    event?.resource?.bus?.slug
                  }?date=${moment(event?.slotStart).format(
                    "YYYY-MM-DD"
                  )}&booking=${event?.resource?.slug}`
                );
              }}
              onRangeChange={handleRangeChange}
              onDaySelect={({ date }) => setSelectedDate(date)}
            />
          </Wrapper>
        </div>

        {/* available buses */}
        <Wrapper
          active={!selectedDate}
          message={t("selectDate")}
          className={classes.rightSection}
        >
          <div className={classes.availableBuses}>
            {selectedDate && (
              <div className={classes.date}>
                <h3>
                  {moment(selectedDate).locale(locale).format("dddd, MMMM DD")}
                </h3>
              </div>
            )}

            {isMobile ? (
              <p>{t("availableTitle")}</p>
            ) : (
              <p>{t("availableBusesTitle")}</p>
            )}

            <Tabs
              ulCustom={classes.tabs}
              tabsData={SHIFT_TABS}
              selected={shift}
              setSelected={setShift}
              t={t}
            />

            <div className={classes.detailCards}>
              {loading?.getBuses ? (
                <SpinnerLoading />
              ) : buses?.length === 0 && selectedDate ? (
                <NoDataFound />
              ) : (
                buses?.map((bus, index) => (
                  <BusTimeDetailCard
                    selectedDate={selectedDate}
                    key={index}
                    data={bus}
                    t={t}
                    onClick={(e) => {
                      router.push(
                        `/resident/bus-booking/${e?.slug}?date=${moment(
                          selectedDate
                        ).format("YYYY-MM-DD")}`
                      );
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </Wrapper>
      </div>
    </Container>
  );
}

// const busCardsData = [
//   {
//     id: 1,
//     icon: "/svg/greenBus.svg",
//     title: {
//       en: "Green Bus",
//       "en-GB": "Green Bus",
//       es: "Autobús Verde",
//       fr: "Bus Vert",
//     },
//     description: {
//       en: "A convenient and eco-friendly bus service from Rathmore to Tesco.",
//       "en-GB":
//         "A reliable green bus service operating between Rathmore and Tesco.",
//       es: "Un servicio de autobús ecológico y conveniente de Rathmore a Tesco.",
//       fr: "Un service de bus écologique et pratique de Rathmore à Tesco.",
//     },
//     from: "Rathmore",
//     to: "Tesco",
//     startTime: "12:00 PM",
//     endTime: "01:15 PM",
//     date: "Feb 24, 2023",
//     duration: "1h 15m",
//     departureDate: "Nov 18, 2024, 8:00 AM",
//     seatsAvailable: 15,
//     totalSeats: 20,
//     available: true,
//     slug: "green-bus",
//   },
//   {
//     id: 2,
//     icon: "/svg/blueBus.svg",
//     title: {
//       en: "Blue Express",
//       "en-GB": "Blue Express",
//       es: "Expreso Azul",
//       fr: "Express Bleu",
//     },
//     description: {
//       en: "A premium bus service from Rathmore to Ashford with luxurious seats.",
//       "en-GB": "A high-class bus service running from Rathmore to Ashford.",
//       es: "Un servicio de autobús premium de Rathmore a Ashford con asientos lujosos.",
//       fr: "Un service de bus haut de gamme de Rathmore à Ashford avec des sièges luxueux.",
//     },
//     from: "Rathmore",
//     to: "Ashford",
//     startTime: "02:00 PM",
//     endTime: "03:30 PM",
//     date: "Feb 24, 2023",
//     duration: "1h 30m",
//     departureDate: "Nov 18, 2024, 2:00 PM",
//     seatsAvailable: 0,
//     totalSeats: 20,
//     available: false,
//     slug: "blue-express",
//   },
//   {
//     id: 3,
//     icon: "/svg/redBus.svg",
//     title: {
//       en: "Red Line",
//       "en-GB": "Red Line",
//       es: "Línea Roja",
//       fr: "Ligne Rouge",
//     },
//     description: {
//       en: "A fast bus service from Rathmore to Limerick with frequent stops.",
//       "en-GB": "A quick bus service running from Rathmore to Limerick.",
//       es: "Un servicio de autobús rápido de Rathmore a Limerick con paradas frecuentes.",
//       fr: "Un service de bus rapide de Rathmore à Limerick avec des arrêts fréquents.",
//     },
//     from: "Rathmore",
//     to: "Limerick",
//     startTime: "04:00 PM",
//     endTime: "05:15 PM",
//     date: "Feb 24, 2023",
//     duration: "1h 15m",
//     departureDate: "Nov 18, 2024, 4:00 PM",
//     seatsAvailable: 10,
//     totalSeats: 20,
//     available: true,
//     slug: "red-line",
//   },
// ];
