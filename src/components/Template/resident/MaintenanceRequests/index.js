"use client";
import Button from "@/components/atoms/Button";
import MenuComponent from "@/components/atoms/MenuComponent";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import MaintenanceRequestsModal from "@/components/organisms/Modals/MaintenanceRequestsModal";
import MaintenanceRequestViewModal from "@/components/organisms/Modals/MaintenanceRequestViewModal";
import SuccessModal from "@/components/organisms/Modals/SuccessModal";
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
import { TbDotsVertical } from "react-icons/tb";
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
  const locale = useLocale();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const { width } = useDimensions();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const isMobile = width < 577;
  const [totalRecords, setTotalRecords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 500);
  const [showAreYouSureModal, setShowAreYouSureModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const menuItems = [
    {
      title: t("menuItems.edit"),
      onClick: (e) => {
        setSelectedRowData(e.value);
        setShowModal(true);
      },

      style: {
        color: "var(--Black)",
        fontWeight: 500,
      },
    },
    // {
    //   title: t("menuItems.delete"),
    //   onClick: async (e) => {
    //     setSelectedRowData(e.value);
    //     setShowAreYouSureModal(true);
    //   },
    //   style: {
    //     color: "var(--Red)",
    //     fontWeight: 500,
    //   },
    // },
  ];

  const ActionItem = {
    title: "",
    key: "menu",
    style: { width: "8%" },
    renderItem: ({ data }) => (
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
    ),
  };
  const handleSave = async () => {
    setSelectedRowData(null);
    await getData();
  };
  const handleCloseModal = () => {
    if (loading === "loading") return;
    setSelectedRowData(null);
    setShowModal(false);
  };

  async function getData({
    _search = search,
    _page = currentPage,
    _tab = selectedTab,
  } = {}) {
    const query = {
      search: _search?.trim(),
      page: _page,
      limit: RECORDS_LIMIT,
      status: _tab?.value,
    };
    const queryString = new URLSearchParams(query).toString();
    setLoading("loading");
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
      setData(maintenanceRequests || []);
      setTotalRecords(response?.totalRecords || 0);
    }
    setLoading("");
  }

  // const handleDelete = async () => {
  //   setLoading("delete");
  //   const { response } = await Patch({
  //     route: `maintenance-request/my/update/${selectedRowData?.slug}`,
  //     data: {
  //       status: "deleted",
  //     },
  //   });
  //   if (response) {
  //     RenderToast({
  //       type: "success",
  //       message: t("toasts.cancelSuccess"),
  //     });
  //     setShowAreYouSureModal(false);
  //     await getData({
  //       _search: searchDebounce,
  //       _page: currentPage,
  //       _tab: selectedTab,
  //     });
  //   }
  //   setLoading("");
  // };

  useEffect(() => {
    getData({ _search: searchDebounce, _page: currentPage, _tab: selectedTab });
  }, [searchDebounce, currentPage, selectedTab]);
  return (
    <div className={mergeClass("containerFluid", classes.main)}>
      {isMobile ? (
        <MobileHeader
          title={t("title")}
          showBack
          icon={
            <Image
              src="/svg/maintenanceIcon.svg"
              alt="maintenance"
              width={16}
              height={16}
            />
          }
        ></MobileHeader>
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

      <TopHeader
        tabs={tabs}
        title={false}
        showBackBtn={false}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        showSearch
        // showFilters
        // filterValue={filter}
        // setFilterValue={setFilter}
        // filterOptions={filterOptions}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        containerClass={classes?.topHeaderMain}
      >
        {isMobile && (
          <Button
            label={width < 520 ? "" : t("addNewRequest")}
            variant={"primary"}
            leftIcon={
              <Image src="/svg/plus.svg" alt="add" width={20} height={20} />
            }
            onClick={() => setShowModal(true)}
            className={classes.addButton}
          />
        )}
      </TopHeader>
      <div className={classes.MaintenanceRequests}>
        <AppTable
          tableHeader={[
            ...maintenanceRequestsTableHeader(t, locale, selectedTab),
            ActionItem,
          ]}
          data={data}
          loading={loading}
          pagination
          page={currentPage}
          onRowClick={(rowData) => {
            setSelectedRowData(rowData);
            setShowViewModal(true);
          }}
          onPageChange={(p) => {
            setCurrentPage(p);
            getData({ _search: searchDebounce, _page: p });
          }}
          totalRecords={totalRecords}
        />
      </div>
      {showModal && (
        <MaintenanceRequestsModal
          setShow={handleCloseModal}
          show={showModal}
          modalData={selectedRowData}
          setModalData={setSelectedRowData}
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
      {showViewModal && (
        <MaintenanceRequestViewModal
          show={showViewModal}
          setShow={setShowViewModal}
          requestData={selectedRowData}
        />
      )}
      {/* {showAreYouSureModal && (
        <AreYouSureModal
          show={showAreYouSureModal}
          setShow={setShowAreYouSureModal}
          onConfirm={handleDelete}
          loading={loading}
          onSuccess={() => {
            setSelectedRowData(null);
            setShowAreYouSureModal(false);
            getData({
              _search: searchDebounce,
              _page: currentPage,
              _tab: selectedTab,
            });
          }}
        />
      )} */}
    </div>
  );
}
