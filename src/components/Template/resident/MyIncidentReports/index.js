"use client";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import IncidentReportViewModal from "@/components/organisms/Modals/IncidentReportViewModal";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { myIncidentReportsTableHeader } from "@/resources/utils/tableHeaders";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./style.module.css";

export default function MyIncidentReports() {
  const t = useTranslations("myIncidentReports.MyIncidentReports");
  const { width } = useDimensions();
  const { Get } = useAxios();
  const isMobile = width < 577;
  const [search, setSearch] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [data, setData] = useState();
  const [loading, setLoading] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const locale = useLocale();

  const tabs = [
    {
      label: t("tabs.all"),
      value: "all",
    },
    {
      label: t("tabs.resolved"),
      value: "resolved",
    },
    {
      label: t("tabs.underReview"),
      value: "under-review",
    },
    {
      label: t("tabs.escalated"),
      value: "escalated",
    },
  ];

  const filterOptions = [
    {
      label: t("filterStatus.all"),
      value: "all",
    },
    {
      label: t("filterStatus.low"),
      value: "low",
    },
    {
      label: t("filterStatus.medium"),
      value: "medium",
    },
    {
      label: t("filterStatus.high"),
      value: "high",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [filter, setFilter] = useState(filterOptions[0]);

  async function getData({
    _search = search,
    _page = page,
    status,
    severity,
  } = {}) {
    const params = new URLSearchParams({
      search: _search?.trim(),
      page: _page,
      limit: RECORDS_LIMIT,
      status: status?.value,
      severity: severity?.value,
    });
    setLoading(true);
    const { response } = await Get({
      route: `incident-reports/my/all?${params.toString()}`,
    });

    if (response) {
      const data = response?.data;
      setData(data);
      setTotalRecords(response?.totalRecords);
    }

    setLoading(false);
  }

  useEffect(() => {
    getData({
      _search: debounceSearch,
      _page: 1,
      status: selectedTab,
      severity: filter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, selectedTab, filter]);

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        {isMobile ? (
          <MobileHeader title={t("title")} showBack />
        ) : (
          <TopHeader title={t("title")} tabs={false} />
        )}

        <div className={classes.TopHeader}>
          <TopHeader
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            showBackBtn={false}
            title={false}
            search={search}
            setSearch={setSearch}
            showSearch={true}
            showFilters={true}
            filterValue={filter}
            setFilterValue={setFilter}
            filterOptions={filterOptions}
          />
        </div>

        <AppTable
          tableHeader={[...myIncidentReportsTableHeader(t, locale)]}
          data={data}
          pagination
          page={page}
          loading={loading}
          onPageChange={(p) => {
            setPage(p);
            getData({ _page: p, _search: debounceSearch });
          }}
          // tableMinWidth={1400}
          totalRecords={totalRecords}
          onRowClick={(data) => {
            setSelectedIncident(data);
            setShowViewModal(true);
          }}
        />
      </div>

      {/* Modal */}
      {showViewModal && (
        <IncidentReportViewModal
          show={showViewModal}
          setShow={setShowViewModal}
          incidentData={selectedIncident}
        />
      )}
    </Container>
  );
}
