"use client";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import BookingCard from "@/components/molecules/BookingCard/BookingCard";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import Pagination from "@/components/molecules/Pagination";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import RenderStatusCell, {
  RenderDateTimeCell,
} from "@/components/organisms/AppTable/tableHelper";
import AreYouSureModal from "@/components/organisms/Modals/AreYouSureModal/AreYouSureModal";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { capitalizeEachWord } from "@/resources/utils/helper";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";

export default function AllBookingsTemplate() {
  const locale = useLocale();
  const t = useTranslations("allBooking");
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [totalRecords, setTotalRecords] = useState("");
  const tabs = [
    {
      label: t("tabs.all"),
      value: "all",
    },

    {
      label: "Visitor Bookings",
      value: "accommodation",
    },
    {
      label: "Bus Bookings",
      value: "bus",
    },
    {
      label: "Laundry Bookings",
      value: "laundry",
    },
    {
      label: "Staff Appointments",
      value: "staff",
    },
  ];
  // const [show, setShow] = useState(true);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const { Get, Post } = useAxios();
  const [page, setPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const ActionItem = (width) => ({
    title: "",
    key: "actions",
    style: { width: `${width}%` },
    renderItem: ({ data }) => {
      if (["completed", "cancelled", "rejected"].includes(data?.status)) {
        return null;
      }
      return (
        <div
          className={classes.cancelButton}
          onClick={(e) => {
            e.stopPropagation();
            setBookingToCancel(data?.slug);
            setShowCancelModal(true);
          }}
        >
          <p>{t("menuItems.cancel")}</p>
        </div>
      );
    },
  });

  const getAllBookings = async ({ _page = page, _tab = selectedTab }) => {
    const query = {
      page: _page,
      serviceType: _tab?.value,
      limit: RECORDS_LIMIT,
    };
    const queryParams = new URLSearchParams(query).toString();
    setLoading("loading");

    const { response } = await Get({
      route: `booking/my/all?${queryParams}`,
    });

    if (response) {
      const formattedData = response?.data?.map((item) => {
        const baseData = {
          ...item,
          bookingId: item?.bookingId,
          time: item?.bookingStartTime,
          category: item?.serviceType || "",
          createdAt: item?.bookingStartDate,
          status: item?.status || "",
        };

        // Add service-specific data
        if (item?.serviceType === "accommodation") {
          baseData.visitorName =
            item?.visitorName ||
            item?.visitor?.fullName?.[locale] ||
            item?.visitor?.fullName?.en ||
            "N/A";
        }

        if (item?.serviceType === "laundry" && item?.machine) {
          baseData.machineName =
            item.machine?.name?.[locale] || item.machine?.name?.en || "N/A";
        }

        if (item?.serviceType === "bus" && item?.bus) {
          baseData.busName =
            item.bus?.name?.[locale] || item.bus?.name?.en || "N/A";
          baseData.startingPoint =
            item.bus?.startingPointAddress?.[locale] ||
            item.bus?.startingPointAddress?.en ||
            "N/A";
          baseData.endingPoint =
            item.bus?.endingPointAddress?.[locale] ||
            item.bus?.endingPointAddress?.en ||
            "N/A";
          // Extract seat numbers - seats array contains objects with seat ID or seat object
          const seatNumbers = item?.seats
            ?.map((seat) => {
              if (typeof seat === "string") return seat;
              if (seat?.seatNumber) return seat.seatNumber;
              if (seat?.seat?.seatNumber) return seat.seat.seatNumber;
              if (seat?.passengerName) return seat.passengerName; // Fallback to passenger name
              return null;
            })
            .filter(Boolean)
            .join(", ");
          baseData.seatNumber = seatNumbers || "N/A";
        }

        if (item?.serviceType === "staff" && item?.staff) {
          baseData.staffName =
            item.staff?.fullName?.[locale] || item.staff?.fullName?.en || "N/A";
        }

        return baseData;
      });
      setData(formattedData);
      setTotalRecords(response?.totalRecords);
    }

    setLoading("");
  };

  const cancelBooking = async () => {
    if (!bookingToCancel) return;

    setLoading("cancel");
    const { response } = await Post({
      route: `booking/cancel/${bookingToCancel}`,
    });
    if (response) {
      RenderToast({
        type: "success",
        message: t("toasts.cancelSuccess"),
      });
      setShowCancelModal(false);
      setBookingToCancel(null);
      await getAllBookings({
        _page: page,
        _tab: selectedTab,
      });
    }
    setLoading("");
  };

  useEffect(() => {
    getAllBookings({
      _page: page,
      _tab: selectedTab,
    });
  }, [page, selectedTab]);

  // Get dynamic table headers based on selected tab
  const getTableHeaders = () => {
    const serviceType = selectedTab?.value;
    const baseHeaders = [];

    if (serviceType === "all") {
      baseHeaders.push(
        {
          key: "bookingId",
          title: t("table.booking"),
          style: { width: "15%" },
          renderItem: ({ item }) => <span>#{item}</span>,
        },
        {
          key: "category",
          title: t("table.category"),
          style: { width: "20%" },
          renderItem: ({ item }) => (item ? capitalizeEachWord(item) : "N/A"),
        },
        {
          key: "bookingStartDate",
          title: t("table.bookingStartDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "bookingEndDate",
          title: t("table.bookingEndDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "status",
          title: t("table.status"),
          style: { width: "15%" },
          renderItem: ({ item }) => <RenderStatusCell status={item} />,
        },
        ActionItem(10)
      );
    } else if (serviceType === "accommodation") {
      // 5 columns: Booking ID, Visitor Name, Start Date, End Date, Status
      baseHeaders.push(
        {
          key: "bookingId",
          title: t("table.booking"),
          style: { width: "15%" },
          renderItem: ({ item }) => <span>#{item}</span>,
        },
        {
          key: "visitorName",
          title: t("table.visitorName"),
          style: { width: "15%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "bookingStartDate",
          title: t("table.bookingStartDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "bookingEndDate",
          title: t("table.bookingEndDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "status",
          title: t("table.status"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderStatusCell status={item} />,
        },
        ActionItem(10)
      );
    } else if (serviceType === "laundry") {
      // 5 columns: Booking ID, Machine Name, Start Date, End Date, Status
      baseHeaders.push(
        {
          key: "bookingId",
          title: t("table.booking"),
          style: { width: "15%" },
          renderItem: ({ item }) => <span>#{item}</span>,
        },
        {
          key: "machineName",
          title: t("table.machineName"),
          style: { width: "20%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "bookingStartDate",
          title: t("table.bookingStartDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "bookingEndDate",
          title: t("table.bookingEndDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "status",
          title: t("table.status"),
          style: { width: "15%" },
          renderItem: ({ item }) => <RenderStatusCell status={item} />,
        },
        ActionItem(10)
      );
    } else if (serviceType === "staff") {
      // 5 columns: Booking ID, Staff Name, Start Date, End Date, Status
      baseHeaders.push(
        {
          key: "bookingId",
          title: t("table.booking"),
          style: { width: "15%" },
          renderItem: ({ item }) => <span>#{item}</span>,
        },
        {
          key: "staffName",
          title: t("table.staffName"),
          style: { width: "20%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "bookingStartDate",
          title: t("table.bookingStartDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "bookingEndDate",
          title: t("table.bookingEndDate"),
          style: { width: "20%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "status",
          title: t("table.status"),
          style: { width: "15%" },
          renderItem: ({ item }) => <RenderStatusCell status={item} />,
        },
        ActionItem(10)
      );
    } else if (serviceType === "bus") {
      // 8 columns: Booking ID, Bus Name, Starting Point, Ending Point, Seat Number, Start Date, End Date, Status
      // Total: 90% (ActionItem takes 10%)
      baseHeaders.push(
        {
          key: "bookingId",
          title: t("table.booking"),
          style: { width: "8%" },
          renderItem: ({ item }) => <span>#{item}</span>,
        },
        {
          key: "busName",
          title: t("table.busName"),
          style: { width: "10%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "startingPoint",
          title: t("table.startingPoint"),
          style: { width: "10%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "endingPoint",
          title: t("table.endingPoint"),
          style: { width: "10%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "seatNumber",
          title: t("table.seatNumber"),
          style: { width: "8%" },
          renderItem: ({ item }) => <span>{item || "N/A"}</span>,
        },
        {
          key: "bookingStartDate",
          title: t("table.bookingStartDate"),
          style: { width: "18%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "bookingEndDate",
          title: t("table.bookingEndDate"),
          style: { width: "18%" },
          renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
        },
        {
          key: "status",
          title: t("table.status"),
          style: { width: "8%" },
          renderItem: ({ item }) => <RenderStatusCell status={item} />,
        },
        ActionItem(10)
      );
    }

    return baseHeaders;
  };

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        <div className={classes?.appointmentMain}>
          {isMobile && <MobileHeader title={t("title")} showBack />}
          {isMobile ? (
            <HeaderCard
              width={isMobile}
              title={t("welcomeTitle")}
              description={t("description")}
            />
          ) : (
            <TopHeader title={t("title")} showBackBtn={false} />
          )}

          <React.Fragment>
            <div className={classes.TopHeader}>
              <TopHeader
                tabs={tabs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                showBackBtn={false}
                title={false}
                showSearch={false}
              />
            </div>
            {isMobile ? (
              loading === "loading" ? (
                <SpinnerLoading />
              ) : (
                <div className={classes.mobileBookingCards}>
                  {data?.map((item, i) => (
                    <BookingCard
                      t={t}
                      key={i}
                      item={item}
                      loading={loading}
                      setShowCancelModal={setShowCancelModal}
                      cancelBooking={cancelBooking}
                      setBookingToCancel={setBookingToCancel}
                      onSuccess={() => {
                        getAllBookings({
                          _page: 1,
                          _tab: selectedTab,
                        });

                        setShowCancelModal(false);
                        setBookingToCancel(null);
                      }}
                    />
                  ))}
                  {totalRecords > RECORDS_LIMIT && (
                    <Pagination
                      totalRecords={totalRecords}
                      pageSize={RECORDS_LIMIT}
                      currentPage={page}
                      setCurrentPage={setPage}
                    />
                  )}
                </div>
              )
            ) : (
              <AppTable
                tableHeader={[...getTableHeaders()]}
                // rowClassName="cursor-pointer"
                data={data}
                loading={loading === "loading"}
                pagination
                page={page}
                onPageChange={(p) => {
                  setPage(p);
                  getAllBookings({ _page: p });
                }}
                tableMinWidth={selectedTab?.value === "bus" ? 1800 : 1300}
                totalRecords={totalRecords}
                onRowClick={(data) => {
                  setSelectedRowData(data);
                  // setViewDetailModal(true);
                }}
              />
            )}
          </React.Fragment>
        </div>
      </div>

      {showCancelModal && (
        <AreYouSureModal
          show={showCancelModal}
          setShow={setShowCancelModal}
          onConfirm={cancelBooking}
          loading={loading === "cancel"}
          onSuccess={() => {
            setBookingToCancel(null);
          }}
        />
      )}
    </Container>
  );
}
