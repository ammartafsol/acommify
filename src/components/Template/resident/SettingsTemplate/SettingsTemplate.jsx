"use client";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { signOutRequest, updateUser } from "@/store/auth/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { CiWallet } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import classes from "./SettingsTemplate.module.css";
import { useState } from "react";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";
import { MdPassword } from "react-icons/md";

export default function SettingsTemplate() {
  const router = useRouter();
  const t = useTranslations("settingsPage");
  const { width } = useDimensions();
  const dispatch = useDispatch();
  const { Post } = useAxios();
  const { user } = useSelector((state) => state.authReducer);
  const isMobile = width < 577;
  const [loading, setLoading] = useState(false);
  const isCheckedOut = user?.logs === null || user?.logs?.checkOut;

  function handleLogout() {
    sessionStorage.clear();
    router.push("/login");
    Cookies.remove("_xpdx_acom-web");
    Cookies.remove("_xpdx_rf_acom-web");
    Cookies.remove("_xpdx_u_acom-web");

    dispatch(signOutRequest());
  }

  const tabs = [
    {
      label: t("tabs.account"),
      icon: <LuUser size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/profile-settings"),
    },
    {
      label: t("tabs.changePassword"),
      icon: <MdPassword size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/settings/change-password"),
    },
    {
      label: t("tabs.pointsWallet"),
      icon: <CiWallet size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/settings/points-wallet"),
    },
    {
      label: t("tabs.notifications"),
      icon: <IoMdNotificationsOutline size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/notifications"),
    },
    {
      label: t("tabs.privacyPolicy"),
      icon: <Image src={"/svg/paper.svg"} height={24} width={24} alt="paper" />,
      onClick: () => router.push("/resident/privacyPolicy"),
    },
    {
      label: t("tabs.help"),
      icon: <AiOutlineQuestionCircle size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/settings/help-line"),
    },
    {
      label: t("tabs.orders"),
      icon: <IoCartOutline size={24} color="#8C939B" />,
      onClick: () => router.push("/resident/orders"),
    },
    {
      label: t("tabs.logout"),
      icon: (
        <Image
          src={"/svg/settingLogout.svg"}
          height={24}
          width={24}
          alt="logout"
          style={{ display: "inline-block" }}
        />
      ),
      onClick: () => handleLogout(),
      isMobile: true,
    },
  ];

  const handleCheckInOut = async () => {
    setLoading(true);
    const { response } = await Post({
      route: "users/checkin-checkout",
      data: {
        date: new Date(),
      },
    });

    if (response?.status === "success") {
      dispatch(updateUser(response?.data));
      RenderToast({
        type: "success",
        message: isCheckedOut
          ? t("toasts.checkedInSuccessfully")
          : t("toasts.checkedOutSuccessfully"),
      });
    }
    setLoading(false);
  };

  return (
    <div className={classes.main}>
      <Container className="containerFluid">
        {isMobile ? (
          <MobileHeader
            title={t("settings.title")}
            icon={<FiSettings size={16} color="#33B5F6" />}
            showBack
          />
        ) : (
          <TopHeader
            title={t("settings.title")}
            btnLabel={t("settings.logout")}
            tabs={false}
            btnOnClick={() => handleLogout()}
            btnVariant="red"
            btnLeftIcon={
              <Image
                src={"/svg/logout.svg"}
                height={24}
                width={24}
                alt="logout"
              />
            }
            btnClass={classes.logoutBtn}
            btn2Label={
              isCheckedOut ? t("btnLabels.signIn") : t("btnLabels.signOut")
            }
            btn2Variant={isCheckedOut ? "primary" : "secondary"}
            btn2OnClick={handleCheckInOut}
            btn2Disabled={loading}
            btn2Class={classes.checkOutBtn}
          ></TopHeader>
        )}
        <div className={classes.settingsMain}>
          <div className={classes.tabsMain}>
            {tabs
              ?.filter((tab) => {
                return (
                  tab.isMobile === undefined ||
                  (tab.isMobile === true && isMobile)
                );
              })
              ?.map((tab, idx) => (
                <div
                  className={classes.settingTab}
                  key={tab.label}
                  onClick={tab.onClick ? tab.onClick : undefined}
                >
                  <div>
                    <span>{tab.icon}</span>
                    <p>{tab.label}</p>
                  </div>
                  <FaChevronRight size={16} color="#8C939B" />
                </div>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
