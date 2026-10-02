"use client";
import MenuComponent from "@/components/atoms/MenuComponent";
import RenderToast from "@/components/atoms/RenderToast";
import AppointmentCard from "@/components/molecules/AppoinmentCard";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { appointmentsTableHeader } from "@/resources/utils/tableHeaders";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { TbDotsVertical } from "react-icons/tb";
import classes from "./style.module.css";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import RenderStatusCell, {
  RenderDateTimeCell,
} from "@/components/organisms/AppTable/tableHelper";
import DetailModal from "@/components/organisms/Modals/DetailModal/DetailModal";
import Image from "next/image";
import { capitalizeEachWord } from "@/resources/utils/helper";

export default function Appointments() {
  const locale = useLocale();
  const t = useTranslations("appointmentsPage.Appointments");
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [totalRecords, setTotalRecords] = useState("");
  const [search, setSearch] = useState("");
  const tabs = [
    {
      label: t("tabs.all"),
      value: "all",
    },

    {
      label: t("tabs.completed"),
      value: "completed",
    },
    {
      label: t("tabs.pending"),
      value: "pending",
    },
    {
      label: t("tabs.cancelled"),
      value: "cancelled",
    },
    {
      label: t("tabs.rejected"),
      value: "rejected",
    },
    {
      label: t("tabs.accepted"),
      value: "accepted",
    },
    {
      label: t("tabs.inprogress"),
      value: "in-progress",
    },
  ];
  // const [show, setShow] = useState(true);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const { Get, Post } = useAxios();
  const [page, setPage] = useState(1);
  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const searchDebounce = useDebounce(search, 500);
  const menuItems = [
    {
      title: t("menuItems.cancel"),
      onClick: async (e) => {
        console.log(`Cancel: ${e?.value?.slug}`);
        await cancelAppointment(e?.value?.slug);
      },
      style: {
        color: "var(--Red)",
        fontWeight: 500,
      },
    },
  ];

  const ActionItem = {
    title: "",
    key: "menu",
    style: { width: "8%" },
    renderItem: ({ data }) => {
      if (data.status === "accepted" || data.status === "cancelled") {
        return (
          <TbDotsVertical
            color="#B2B5BA"
            size={20}
            style={{ cursor: "not-allowed", opacity: 0.6 }}
          />
        );
      }
      return (
        <MenuComponent
          portal
          menuButton={
            <TbDotsVertical
              color="#B2B5BA"
              onClick={(e) => e.stopPropagation()}
              className="pointer"
              size={20}
            />
          }
          value={data}
          items={menuItems}
        />
      );
    },
  };

  const getAllAppointments = async ({
    _search = search,
    _page = page,
    _tab = selectedTab,
  }) => {
    const query = {
      search: _search?.trim(),
      page: _page,
      status: _tab?.value,
      limit: RECORDS_LIMIT,
      serviceType: "staff",
    };
    const queryParams = new URLSearchParams(query).toString();
    setLoading("loading");

    const { response } = await Get({
      route: `booking/my/all?${queryParams}`,
    });

    if (response) {
      const formattedData = response?.data?.map((item) => ({
        ...item,
        description: item?.reasonForMeeting || "",
        category: item?.serviceType || "",
        createdAt: item?.bookingStartDate,
        status: item?.status,
      }));
      setData(formattedData);
      setTotalRecords(response?.totalRecords);
    }

    setLoading("");
  };

  const cancelAppointment = async (slug) => {
    setLoading("loading");
    const { response } = await Post({
      route: `booking/cancel/${slug}`,
    });
    if (response) {
      RenderToast({
        type: "success",
        message: t("toasts.cancelSuccess"),
      });
      await getAllAppointments({
        status: selectedTab,
        search: searchDebounce,
        page: 1,
      });
    }
    setLoading("");
  };

  // useEffect(() => {
  //   getAllAppointments({
  //     status: selectedTab,
  //     search: searchDebounce,
  //     page: 1,
  //   });
  // }, [selectedTab, searchDebounce]);

  useEffect(() => {
    getAllAppointments({
      _search: searchDebounce,
      _page: page,
      _tab: selectedTab,
    });
  }, [searchDebounce, page, selectedTab]);

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        <div className={classes?.appointmentMain}>
          {isMobile && <MobileHeader title={t("title")} showBack={true} mainClass={classes.mobileHeaderMain} iconImage={"/svg/calendar.svg"} />}
          {isMobile ? (
            <HeaderCard
              width={isMobile}
              title={t("welcomeTitle")}
              description={t("description")}
              
            />
          ) : (
            <TopHeader title={t("title")} showBackBtn />
          )}
          <div className={classes.content}>
            <div className={classes.appointmentCardContainer}>
              <AppointmentCard
                t={{
                  title: t("staffAppointmentCard.title"),
                  description: t("staffAppointmentCard.description"),
                }}
                route={"appointments/staff"}
              />
              <AppointmentCard
                t={{
                  title: t("visitorBookingCard.title"),
                  description: t("visitorBookingCard.description"),
                }}
                route={"appointments/visitor-booking"}
              />
            </div>
          </div>

          {/* {!isMobile && ( */}
          <>
            {!isMobile && (
              <h4 className={classes.mt}>{t("appointmentHistory")}</h4>
            )}
            <div className={classes.TopHeader}>
              <TopHeader
                tabs={tabs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                showBackBtn={false}
                title={false}
                search={search}
                setSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                showSearch={true}
              />
            </div>

            <AppTable
              tableHeader={[...appointmentsTableHeader(t, locale)]}
              rowClassName="cursor-pointer"
              data={data}
              loading={loading}
              pagination
              page={page}
              onPageChange={(p) => {
                setPage(p);
                getAllAppointments({ _search: searchDebounce, _page: p });
              }}
              totalRecords={totalRecords}
              onRowClick={(data) => {
                setSelectedRowData(data);
                setViewDetailModal(true);
              }}
            />
          </>
          {/* )} */}
        </div>
      </div>
      <DetailModal
        setShow={setViewDetailModal}
        title={t("table.title")}
        show={viewDetailModal}
      >
        <div className={classes.modalMain}>
          <div className={classes.item}>
            <p>{t("table.purpose")}</p>
            <p>{capitalizeEachWord(selectedRowData?.description || "NA")}</p>
          </div>
          <div className={classes.item}>
            <p>{t("table.category")}</p>
            <p>{capitalizeEachWord(selectedRowData?.category || "NA")}</p>
          </div>

          <div className={classes.item}>
            <p>{t("table.dateTime")}</p>
            <RenderDateTimeCell dateTime={selectedRowData?.createdAt || "NA"} />
          </div>

          <div className={classes.item}>
            <p>{t("table.status")}</p>
            <RenderStatusCell status={selectedRowData?.status || "NA"} />
          </div>
        </div>
      </DetailModal>
    </Container>
  );
}
