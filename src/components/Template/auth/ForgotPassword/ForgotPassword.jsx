"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { emailRegex } from "@/resources/utils/regex";
import { useFormik } from "formik";
import { Container, Spinner } from "react-bootstrap";
import * as yup from "yup";
import styles from "./styles.module.css";
import Image from "next/image";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import { ReactSVG } from "react-svg";
import useDimensions from "@/resources/hooks/useDimensions";
import useAxios from "@/interceptor/axios-functions";
import { handleEncrypt } from "@/interceptor/encryption";
import RenderToast from "@/components/atoms/RenderToast";
import Cookies from "js-cookie";
import { useState } from "react";

export default function ForgotPassword() {
  const t = useTranslations("forgotPasswordPage");
  const c = useTranslations("toasts");
  const router = useRouter();
  const { width } = useDimensions();
  const [loading, setLoading] = useState(false);
  const { Post } = useAxios();
  const isMobile = width < 577;
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email(t("emailError"))
        .required(t("emailRequired"))
        .test(
          t("specialChars"),
          t("emailInvalidChars"),
          (value) => !value || emailRegex.test(value)
        ),
    }),
    onSubmit: (values) => {
      console.log("Login attempt:", values);
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    setLoading(true);
    const { response } = await Post({
      route: "auth/forgot/password",
      data: values,
    });
    if (response?.status === "success") {
      Cookies.set("_xpdx_email", handleEncrypt(values?.email));
      RenderToast({
        type: "success",
        message: c("otpCodeSent"),
      });
      // router.push("/verify-otp");
      window.location.replace("/verify-otp");
    }
    setLoading(false);
  };

  return (
    <Container className={mergeClass("containerFluid", styles.wrapper)}>
      <div className={styles.loginBox}>
        {/* responsive */}
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
                <h1>{t("title")}</h1>
              </div>
              {/* languageswitcher */}
              <div className={styles.authLayoutRight}>
                <LanguageSwitcher />
              </div>
            </div>
            {!isMobile && (
              <p
                className={mergeClass(styles.responsiveNone, styles.detailDesc)}
              >
                {t("subtitle")}
              </p>
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
            {isMobile && (
              <p
                className={mergeClass(styles.responsiveNone, styles.detailDesc)}
              >
                {t("subtitle")}
              </p>
            )}
            <div className={styles.inputGroup}>
              <Input
                label={t("emailLabel")}
                placeholder={t("emailPlaceholder")}
                type="email"
                inputContainerClass={styles.inputContainer}
                value={formik.values.email}
                setValue={formik.handleChange("email")}
                errorText={formik.touched.email && formik.errors.email}
                disabled={loading}
              />
            </div>

            <Button
              className={styles.submitBtn}
              onClick={formik.handleSubmit}
              type="submit"
              variant="primary"
              label={t("submitButton")}
              disabled={loading}
              loading={loading}
              showSpinner
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
