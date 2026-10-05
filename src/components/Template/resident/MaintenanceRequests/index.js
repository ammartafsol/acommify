"use client";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import MaintenanceRequestsModal from "@/components/organisms/Modals/MaintenanceRequestsModal";
import SuccessModal from "@/components/organisms/Modals/SuccessModal";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { mergeClass } from "@/resources/utils/helper";
import { maintenanceRequestsTableHeader } from "@/resources/utils/tableHeaders";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import MobileJobs from "./MobileJobs";
import classes from "./style.module.css";

export default function MaintenanceRequests() {
  const t = useTranslations("maintenance.maintenanceRequests");

  const tabs = [
    { label: t("tabs.all"), value: "all" },
    { label: t("tabs.pending"), value: "pending" },
    { label: t("tabs.approved"), value: "approved" },
    { label: t("tabs.rejected"), value: "rejected" },
    { label: t("tabs.completed"), value: "completed" },
    { label: t("tabs.escalated"), value: "escalated" },
  ];
  const { Get } = useAxios();
  const router = useRouter();
  const locale = useLocale();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { width } = useDimensions();
  const [loading, setLoading] = useState("loading");
  const [data, setData] = useState("");
  const isMobile = width < 577;
  const [totalRecords, setTotalRecords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 500);
  const handleSave = async () => {
    await getData();
  };
  const handleCloseModal = () => {
    if (loading === "loading") return;
    setShowModal(false);
  };

  async function getData({
    _search = search,
    _page = currentPage,
    _tab = selectedTab,
    _limit = RECORDS_LIMIT,
    _append = false,
  } = {}) {
    const query = {
      search: _search?.trim(),
      page: _page,
      limit: _limit,
      status: _tab?.value,
    };
    const queryString = new URLSearchParams(query).toString();
    setLoading(_append ? "more" : "loading");
    const { response } = await Get({
      route: `maintenance-request/my/all?${queryString}`,
    });
    if (response) {
      const maintenanceRequests = response?.data?.map((elem) => ({
        ...elem,
        createdAt: elem?.createdAt,
        user: elem?.user,
        description: elem?.description,
        status: elem?.status,
        category: elem?.category,
        comment: elem?.comment,
      }));
      setData((prev) =>
        _append
          ? [...(Array.isArray(prev) ? prev : []), ...(maintenanceRequests || [])]
          : maintenanceRequests || [],
      );
      setTotalRecords(response?.totalRecords || 0);
    }
    setLoading("");
  }

  useEffect(() => {
    if (!width) return;
    getData({
      _search: searchDebounce,
      _page: isMobile ? 1 : currentPage,
      _tab: selectedTab,
      _limit: isMobile ? 30 : RECORDS_LIMIT,
    });
  }, [searchDebounce, currentPage, selectedTab, isMobile, width]);

  const openJob = (item) => {
    const id = item?.slug || item?._id;
    if (!id) return;
    router.push(`/resident/maintenance-requests/${id}`);
  };

  return (
    <div className={mergeClass("containerFluid", isMobile ? classes.mobileMain : classes.main)}>
      {isMobile ? (
        <MobileJobs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={(tab) => {
            setSelectedTab(tab);
            setCurrentPage(1);
          }}
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          jobs={data}
          loading={loading}
          onOpen={openJob}
          onAdd={() => setShowModal(true)}
          canLoadMore={Array.isArray(data) && data.length < totalRecords}
          onLoadMore={() =>
            getData({
              _search: searchDebounce,
              _page: Math.floor((Array.isArray(data) ? data.length : 0) / 30) + 1,
              _tab: selectedTab,
              _limit: 30,
              _append: true,
            })
          }
        />
      ) : (
        <TopHeader
          icon={false}
          tabs={false}
          showBackBtn
          title={t("title")}
          btnLeftIcon={
            <Image src="/svg/plus.svg" alt="add" width={20} height={20} />
          }
          btnOnClick={() => {
            setShowModal(true);
          }}
          btnLabel={t("addNewRequest")}
        />
      )}

      {!isMobile && (
        <>
          <TopHeader
            tabs={tabs}
            title={false}
            showBackBtn={false}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            showSearch
            search={search}
            setSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            containerClass={classes?.topHeaderMain}
          />
          <div className={classes.MaintenanceRequests}>
            <AppTable
              tableHeader={maintenanceRequestsTableHeader(t, locale, selectedTab)}
              data={data}
              loading={loading}
              pagination
              page={currentPage}
              onRowClick={openJob}
              rowClassName={classes.clickableRow}
              onPageChange={(p) => {
                setCurrentPage(p);
                getData({ _search: searchDebounce, _page: p });
              }}
              totalRecords={totalRecords}
            />
          </div>
        </>
      )}
      {showModal && (
        <MaintenanceRequestsModal
          setShow={handleCloseModal}
          show={showModal}
          modalData={null}
          setModalData={() => {}}
          setShowSuccessModal={setShow}
          onSave={handleSave}
        />
      )}
      {show && (
        <SuccessModal
          icon="/svg/Success.svg"
          show={show}
          setShow={setShow}
          content="maintenance.maintenanceRequests.successModal"
        />
      )}
    </div>
  );
}
