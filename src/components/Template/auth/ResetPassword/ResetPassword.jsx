"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import RenderToast from "@/components/atoms/RenderToast";
import { updatePasswordSchema } from "@/formik/schema/updatePasswordSchema";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import { handleDecrypt } from "@/interceptor/encryption";
import useDimensions from "@/resources/hooks/useDimensions";
import useDirection from "@/resources/hooks/useDirection";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";

export default function ResetPassword() {
  const c = useTranslations("toasts");
  const t = useTranslations("resetPasswordPage");
  const router = useRouter();
  const { Post } = useAxios();
  const [loading, setLoading] = useState(false);
  const { width } = useDimensions();
  const isMobile = width < 577;
  const email = handleDecrypt(Cookies.get("_xpdx_email"));
  const code = handleDecrypt(Cookies.get("_xpdx_code"));
  const dir = useDirection();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordSchema(t),
    onSubmit: (values) => {
      console.log("Login attempt:", values);
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading("loading");

    const payload = {
      email: email,
      password: values?.password,
      confirmPassword: values?.confirmPassword,
      code: code,
    };

    const { response } = await Post({
      route: `auth/reset/password`,
      data: payload,
    });

    if (response) {
      RenderToast({
        type: "success",
        message: c("passwordResetSuccess"),
      });
      Cookies.remove("email");
      Cookies.remove("code");
      router.push("/login");
    }
    setLoading("");
  };
  useEffect(() => {
    if (!email || !code) {
      RenderToast({
        type: "error",
        message: !email ? c("noEmailFound") : c("otpCodeExpired"),
      });
      router.push("/forgot-password");
    }
  }, []);

  return (
    <>
      <Container className={mergeClass("containerFluid", styles.wrapper)}>
        <div className={styles.loginBox}>
          {isMobile ? (
            <>
              <div className={styles.responsiveheaderMain}>
                <div className={styles.responsiveNone}>
                  <Image
                    src="/svg/autoMobileLogo.svg"
                    height={41}
                    width={41}
                    alt="logo"
                  />
                </div>
                <div className={styles.headerMain}>
                  <div className={styles.icon}>
                    <ReactSVG src="/svg/login.svg" className="reactSvg" />
                  </div>
                  <h1>{t("title")}</h1>
                </div>
                {/* languageswitcher */}
                <div className={styles.authLayoutRight}>
                  <LanguageSwitcher />
                </div>
              </div>
              {!isMobile && (
                <p className={styles.detailDesc}>{t("subtitle")}</p>
              )}
            </>
          ) : (
            <div className={styles.header}>
              <h1>{t("title")}</h1>
              <p>{t("subtitle")}</p>
            </div>
          )}

          <div className={isMobile ? styles.mobileLoginMain : ""}>
            <div className={styles.loginBoxMiddle}>
              {isMobile && <p className={styles.detailDesc}>{t("subtitle")}</p>}
              <div className={styles.inputGroup}>
                <Input
                  label={t("passwordLabel")}
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  disabled={loading}
                  value={formik.values.password}
                  setValue={formik.handleChange("password")}
                  errorText={formik.touched.password && formik.errors.password}
                  dir={dir}
                />
              </div>
              <div className={styles.inputGroup}>
                <Input
                  label={t("confirmPasswordLabel")}
                  placeholder={t("confirmPasswordPlaceholder")}
                  type="password"
                  disabled={loading}
                  value={formik.values.confirmPassword}
                  setValue={formik.handleChange("confirmPassword")}
                  errorText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  dir={dir}
                />
              </div>
              <Button
                className={styles.submitBtn}
                onClick={formik.handleSubmit}
                type="submit"
                variant="primary"
                label={t("submitButton")}
                disabled={loading}
                showSpinner
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
