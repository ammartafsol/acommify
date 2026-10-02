"use client";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";
import { ordersTableHeader } from "@/resources/utils/tableHeaders";
import { useRouter } from "next/navigation";
import { RECORDS_LIMIT } from "@/resources/utils/constant";

export default function OrdersTemplate() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ordersPage.Orders");
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [totalRecords, setTotalRecords] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const { Get, Post } = useAxios();
  const [page, setPage] = useState(1);
  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const getAllOrders = async ({ page }) => {
    const query = new URLSearchParams({
      page: page,
      limit: RECORDS_LIMIT,
    });
    setLoading("loading");
    const { response } = await Get({
      route: `order/my/all?${query.toString()}`,
    });
    if (response?.status === "success") {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    }
    setLoading("");
  };

  useEffect(() => {
    getAllOrders({ page: page });
  }, [page]);

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        <div className={classes?.main}>
          {isMobile && <MobileHeader title={t("title")} showBack={true} />}
          {isMobile ? (
            <HeaderCard
              width={isMobile}
              title={t("welcomeTitle")}
              description={t("description")}
            />
          ) : (
            <TopHeader title={t("title")} showBackBtn onBack={() => router.back()} />
          )}

          <AppTable
            tableHeader={ordersTableHeader(t)}
            rowClassName="cursor-pointer"
            data={data}
            loading={loading}
            pagination
            page={page}
            onRowClick={(row) => {
              router.push(`orders/orders-detail/${row?.slug}`);
            }}
            onPageChange={(p) => {
              setPage(p);
              getAllOrders({ page: p });
            }}
            totalRecords={totalRecords}
          />
        </div>
      </div>
    </Container>
  );
}


