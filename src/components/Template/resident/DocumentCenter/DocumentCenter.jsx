"use client";
import Input from "@/components/atoms/Input/Input";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import DocumentCard from "@/components/molecules/DocumentCard/DocumentCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import Pagination from "@/components/molecules/Pagination";
import Tabs from "@/components/molecules/Tabs/Tabs";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { mergeClass } from "@/resources/utils/helper";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { CiFileOn } from "react-icons/ci";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { ReactSVG } from "react-svg";
import classes from "./styles.module.css";
import { useLocale } from "next-intl";
import DocumentViewerModal from "../DocumentViewerModal/DocumentViewerModal";

export default function DocumentCenter() {
  const t = useTranslations();
  const { Get } = useAxios();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documentTabs = [
    { label: t("documentCenter.tabs.all"), value: "all" },
    {
      label: t("documentCenter.tabs.forms"),
      value: "forms",
    },
    {
      label: t("documentCenter.tabs.guidelines"),
      value: "guide-lines",
    },
    {
      label: t("documentCenter.tabs.otherDocuments"),
      value: "other-documents",
    },
  ];

  const { width } = useDimensions();
  const [selectedTab, setSelectedTab] = useState(documentTabs[0]);
  const [isGrid, setIsGrid] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const isMobile = width < 577;

  const getAllDocs = async ({
    documentType_ = selectedTab.value,
    page_ = page,
    search_ = search,
  }) => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(documentType_ !== "all" && { documentType: documentType_ }),
      page: page_ || 1,
      limit: RECORDS_LIMIT,
      search: search_?.trim(),
    });
    const { response } = await Get({
      route: `document-center/all?${params.toString()}`,
    });
    if (response?.status === "success") {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debouncedSearch === "" || debouncedSearch.length >= 3) {
      getAllDocs({
        documentType_: selectedTab.value,
        page_: page,
        search_: debouncedSearch,
      });
    }
  }, [debouncedSearch]);

  return (
    <>
      <div className={classes.main}>
        <Container className="containerFluid">
          <div className={classes.documentCenterMain}>
            <div className={classes.header}>
              {isMobile ? (
                <MobileHeader
                  icon={<CiFileOn size={16} color="#33B5F6" />}
                  title={t("documentCenter.title")}
                  showBack
                />
              ) : (
                <TopHeader
                  title={t("documentCenter.title")}
                  showFilters={false}
                  showSearch={false}
                  tabs={false}
                />
              )}

              {isMobile && (
                <div className={classes.subHeader}>
                  <Tabs
                    tabsData={documentTabs}
                    selected={selectedTab}
                    setSelected={(tab) => {
                      setSelectedTab(tab);
                      setPage(1);
                      getAllDocs({
                        documentType_: tab.value,
                        page_: 1,
                        search_: debouncedSearch,
                      });
                    }}
                    ulCustom={classes?.ulCustom}
                  />
                  <div className={classes.searchAndFilter}>
                    <Input
                      placeholder={t("common.search")}
                      value={search}
                      setValue={setSearch}
                      rightIcon={
                        width > 576 && (
                          <ReactSVG
                            src="/svg/search.svg"
                            height={16}
                            width={16}
                          />
                        )
                      }
                      leftIcon={
                        width < 576 && (
                          <ReactSVG
                            src="/svg/search.svg"
                            height={16}
                            width={16}
                          />
                        )
                      }
                      className={classes.searchInput}
                      inputContainerClass={classes.searchInputContainer}
                    />
                    <div className={classes.viewToggle}>
                      <button
                        className={`${classes.viewButton} ${
                          isGrid ? classes.active : ""
                        }`}
                        onClick={() => setIsGrid(true)}
                      >
                        <HiViewGrid size={20} />
                      </button>
                      <button
                        className={`${classes.viewButton} ${
                          !isGrid ? classes.active : ""
                        }`}
                        onClick={() => setIsGrid(false)}
                      >
                        <HiViewList size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!isMobile && (
                <>
                  <TopHeader
                    tabs={documentTabs}
                    selectedTab={selectedTab}
                    setSelectedTab={(tab) => {
                      setSelectedTab(tab);
                      setPage(1);
                      getAllDocs({
                        documentType_: tab.value,
                        page_: 1,
                        search_: debouncedSearch,
                      });
                    }}
                    showFilters={false}
                    showSearch={true}
                    showBackBtn={false}
                    title={false}
                    containerClass={classes.TopHeaderMainClass}
                    search={search}
                    setSearch={setSearch}
                  />
                  <div className={classes.desktopViewToggle}>
                    <div className={classes.viewToggle}>
                      <button
                        className={`${classes.viewButton} ${
                          isGrid ? classes.active : ""
                        }`}
                        onClick={() => setIsGrid(true)}
                      >
                        <HiViewGrid size={20} />
                      </button>
                      <button
                        className={`${classes.viewButton} ${
                          !isGrid ? classes.active : ""
                        }`}
                        onClick={() => setIsGrid(false)}
                      >
                        <HiViewList size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {loading ? (
              <SpinnerLoading className={classes.spinner} />
            ) : (
              <div
                className={mergeClass(
                  isGrid ? classes.cardsGrid : classes.cardsListMain
                )}
              >
                {data?.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    title={doc.name?.[locale]}
                    date={new Date(doc.createdAt).toLocaleDateString()}
                    data={doc}
                    slug={doc.slug}
                    isGrid={isGrid}
                    document={doc.document}
                    onClick={(doc) => {
                      setShowViewModal(true);
                      setSelectedDocument(doc);
                    }}
                  />
                ))}
              </div>
            )}
            <Pagination
              setCurrentPage={(p) => {
                setPage(p);
                getAllDocs({
                  documentType_: selectedTab.value,
                  page_: p,
                  search_: debouncedSearch,
                });
              }}
              currentPage={page}
              totalRecords={totalRecords || 0}
              limit={RECORDS_LIMIT}
            />
          </div>
        </Container>
      </div>
      {showViewModal && (
        <DocumentViewerModal
          show={showViewModal}
          setShow={() => setShowViewModal(false)}
          document={selectedDocument.document}
          docName={selectedDocument.name?.[locale]}
        />
      )}
    </>
  );
}
