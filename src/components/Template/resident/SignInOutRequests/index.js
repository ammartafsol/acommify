"use client";
import MenuComponent from "@/components/atoms/MenuComponent";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { signInOutRequestsData } from "@/developmentContent/signInOutRequestsData";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { signInOutRequestsTableHeader } from "@/resources/utils/tableHeaders";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { TbDotsVertical, TbLogout } from "react-icons/tb";
import classes from "./style.module.css";
import useDimensions from "@/resources/hooks/useDimensions";
import useAxios from "@/interceptor/axios-functions";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { CiFileOn } from "react-icons/ci";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";

export default function SignInOutRequests() {
  const t = useTranslations("signInOutRequests.SignInOutRequests");
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const { Get } = useAxios();



  const getAllSignInOutRequests = async ({ page_ = page }) => {
    setLoading(true);
    const query = {
      page: page_ || 1,
      limit: RECORDS_LIMIT,
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({
      route: `users/checkin-checkout/logs?${queryString}`,
    });
    if (response?.status === "success") {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllSignInOutRequests({ page_: page });
  }, [page]);

  return (
    <Container className="containerFluid">
      <div className={classes.container}>
        <div className={classes?.signInOutMain}>
        {isMobile &&
          <MobileHeader
            title={t("title")}
            icon={<TbLogout size={16} color="#33B5F6" />}
            showBack
          />}
          {isMobile ? (
            <HeaderCard
              width={isMobile}
              title={t("welcomeTitle")}
              description={t("description")}
            />
          ) : (
            <TopHeader title={t("title")} onBack={() => {}} />
          )}


          <AppTable
            tableHeader={signInOutRequestsTableHeader(t)}
            data={data || []}
            loading={loading}
            totalRecords={totalRecords}
            page={page}
            onPageChange={(p) => {
              setPage(p);
              getAllSignInOutRequests({ page_: p });
            }}
          pagination
          />
        </div>
      </div>
    </Container>
  );
}
