"use client";

import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import { signOutRequest, updateUser } from "@/store/auth/authSlice";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import styles from "./styles.module.css";

export default function PrivacyPolicyAcceptance() {
  const t = useTranslations("PrivacyPolicyPage");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { Get, Post } = useAxios();
  const [policy, setPolicy] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState("loading");

  useEffect(() => {
    const loadPolicy = async () => {
      const { response } = await Get({
        route: "cms/page/privacyPolicyPage",
      });
      if (response?.data) {
        setPolicy(response.data);
      }
      setLoading("");
    };
    loadPolicy();
  }, []);

  const html =
    policy?.htmlDescription?.[locale] || policy?.htmlDescription?.en || "";

  const handleAccept = async () => {
    if (!accepted) {
      RenderToast({ type: "info", message: t("acceptRequired") });
      return;
    }
    setLoading("submitting");
    const { response } = await Post({
      route: "users/privacy-policy/accept",
    });
    if (response?.status === "success") {
      dispatch(updateUser(response.data));
      Cookies.set("_pp_accepted", "1", { expires: 90, path: "/" });
      router.replace("/resident");
    }
    setLoading("");
  };

  const handleLogout = () => {
    Cookies.remove("_xpdx_acom-web");
    Cookies.remove("_xpdx_rf_acom-web");
    Cookies.remove("_xpdx_u_acom-web");
    Cookies.remove("_pp_accepted", { path: "/" });
    dispatch(signOutRequest());
    router.replace("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.topBar}>
          <Image
            src="/svg/autoMobileLogo.svg"
            alt="Acommify"
            width={44}
            height={44}
            priority
          />
          <div className={styles.topActions}>
            <button type="button" className={styles.logout} onClick={handleLogout}>
              {t("logout")}
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.hero}>
            <div className={styles.badge} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.2 5.2 6v5.2c0 4.1 2.7 7.9 6.8 9.1 4.1-1.2 6.8-5 6.8-9.1V6L12 3.2Z"
                  fill="#fff"
                  stroke="#33B5F6"
                  strokeWidth="1.6"
                />
                <path
                  d="M9.2 12.1 11 13.9 15 9.6"
                  stroke="#33B5F6"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.heroText}>
              <h1>{t("acceptTitle")}</h1>
              <p className={styles.subtitle}>{t("acceptSubtitle")}</p>
            </div>
          </div>

          <div className={styles.content}>
            {loading === "loading" ? (
              <div
                className={styles.skeleton}
                aria-busy="true"
                aria-label={t("loading")}
              >
                <span />
                <span />
                <span />
                <span className={styles.skeletonShort} />
              </div>
            ) : html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className={styles.empty}>{t("emptyPolicy")}</p>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.consent}>
              <Checkbox
                label={t("agree")}
                value={accepted}
                setValue={setAccepted}
              />
            </div>
            <Button
              label={t("continue")}
              variant="primary"
              large
              className={styles.continue}
              onClick={handleAccept}
              disabled={
                !accepted || loading === "submitting" || loading === "loading"
              }
              loading={loading === "submitting"}
              showSpinner
            />
          </div>
        </section>
      </div>
    </div>
  );
}
