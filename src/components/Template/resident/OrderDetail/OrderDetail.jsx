"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import RenderStatusCell from "@/components/organisms/AppTable/tableHelper";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { OrderDetailTableHeader } from "@/resources/utils/tableHeaders";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";
import moment from "moment-timezone";

export default function OrderDetail({ slug }) {
  const t = useTranslations("ordersPage.OrderDetails");
  const { Get } = useAxios();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { width } = useDimensions();
  const isMobile = width < 577;

  const fetchOrderDetail = async ({ slug }) => {
    setLoading("loading");
    const { response } = await Get({ route: `order/detail/${slug}` });
    if (response) {
      const order = response.data;
      setOrder(order);

      const formattedItems = order?.items?.map((item, index) => ({
        index: index + 1,
        id: item?._id,
        slug: item?.product?.slug,
        productName: item?.product?.name?.[locale] || item.product?.name?.en,
        categoryName:
          item.product?.category?.name?.[locale] ||
          item.product?.category?.name?.en,
        quantity: item?.quantity,
        totalPoints: item?.totalPoints,
        shippingOption: item?.shippingOption,
        status: item?.status,
      }));

      setTableData(formattedItems);
    }
    setLoading("");
  };

  useEffect(() => {
    fetchOrderDetail({ slug });
  }, []);

  if (loading === "loading") {
    return (
      <Container className={mergeClass("containerFluid")}>
        <div className={classes.spinnerContainer}>
          <SpinnerLoading />
        </div>
      </Container>
    );
  }

  if (!order) {
    return <NoDataFound />;
  }

  const { totalPoints, status, createdAt, shippingDetail, items, orderId } =
    order;

  return (
    <Container className={mergeClass("containerFluid")}>
        <div className={classes.main}>
          {isMobile && <MobileHeader title={t("title")} showBack={true} />}
          {/* {isMobile ? (
            <HeaderCard
              width={isMobile}
              title={t("title")}
              description={t("description")}
            />
          ) : ( */}
            {/* <TopHeader title={t("title")} showBackBtn /> */}
          {/* )} */}
          {
            !isMobile && (
              <TopHeader title={t("title")} showBackBtn />
            )
          }
          <div className={classes.header}>
            <div className={classes.headerLeft}>
              <h2>
                {t("orderDetail.orderId")} #{order?.orderId || "—"}
              </h2>
              <div className={classes.metaRow}>
                <div className={classes.metaItem}>
                  <span className={classes.metaLabel}>
                    {t("orderDetail.status")}
                  </span>

                  <RenderStatusCell status={status} />
                </div>
                <div className={classes.metaItem}>
                  <span className={classes.metaLabel}>
                    {t("orderDetail.orderDate")}
                  </span>
                  <span className={classes.metaValue}>
                    {moment(createdAt).format("DD/MM/YYYY • h:mm A")}
                  </span>
                </div>
                <div className={classes.metaItem}>
                  <span className={classes.metaLabel}>
                    {t("orderDetail.totalPoints")}
                  </span>
                  <span className={classes.metaValueHighlight}>
                    {totalPoints || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.grid}>
            <div className={classes.card}>
              <div className={classes.cardTitle}>
                {t("orderDetail.shippingInfo")}
              </div>
              <div className={classes.cardHeader}>
                <div className={classes.titleHeading}>
                  <span>{t("orderDetail.name")}</span>
                </div>
                <div className={classes.country}>
                  <p>{shippingDetail?.fullName || "—"}</p>
                </div>

                <div className={classes.titleHeading}>
                  <span>{t("orderDetail.address")}</span>
                </div>
                <div className={classes.country}>
                  <p>
                    {shippingDetail?.streetAddress || "—"}
                    {shippingDetail?.city ? `, ${shippingDetail.city}` : ""}
                    {shippingDetail?.country
                      ? `, ${shippingDetail.country}`
                      : ""}
                  </p>
                </div>

                <div className={classes.titleHeading}>
                  <span>{t("orderDetail.city")}</span>
                </div>
                <div className={classes.country}>
                  <p>{shippingDetail?.city || "—"}</p>
                </div>

                <div className={classes.titleHeading}>
                  <span>{t("orderDetail.country")}</span>
                </div>
                <div className={classes.country}>
                  <p>{shippingDetail?.country || "—"}</p>
                </div>
              </div>
            </div>
            <div className={mergeClass(classes.col, classes.summaryCol)}>
              <div className={classes.cardAccent}>
                <div className={classes.cardTitleRow}>
                  <div className={classes.cardTitle}>
                    {t("orderDetail.summary")}
                  </div>
                  <RenderStatusCell status={status} />
                </div>
                <div className={classes.summaryRow}>
                  <span>{t("orderDetail.orderIdLabel")}</span>
                  <strong>#{orderId || "—"}</strong>
                </div>
                <div className={classes.summaryRow}>
                  <span>{t("orderDetail.items")}</span>
                  <strong>{items?.length || 0}</strong>
                </div>
                <div className={classes.divider} />
                <div className={classes.summaryTotal}>
                  <span>{t("orderDetail.totalPoints")}</span>
                  <strong>{totalPoints || 0}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.orderItem}>
            <p> {t("orderDetail.orderItem")}</p>
            <AppTable
              tableHeader={OrderDetailTableHeader(t)}
              data={tableData}
            />
          </div>
        </div>
    </Container>
  );
}
