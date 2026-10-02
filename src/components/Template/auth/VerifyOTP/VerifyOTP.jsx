"use client";
import Button from "@/components/atoms/Button";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import { handleDecrypt, handleEncrypt } from "@/interceptor/encryption";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import OTPInput from "react-otp-input";
import { ReactSVG } from "react-svg";
import * as yup from "yup";
import styles from "./styles.module.css";

export default function VerifyOTP() {
  const c = useTranslations("toasts");
  const router = useRouter();
  const [isCodeSent, setIsCodeSent] = useState(true);
  const { width } = useDimensions();
  const [countdown, setCountdown] = useState(60);
  const timer = useRef(null);
  const t = useTranslations("verificationPage");
  const [loading, setLoading] = useState(false);
  const email = handleDecrypt(Cookies.get("_xpdx_email"));
  const { Post } = useAxios();
  const isMobile = width < 577;
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: yup.object().shape({
      code: yup
        .string()
        .min(4, "Code must be 4 digits")
        .required(t("codeRequired")),
    }),
    onSubmit: (values) => {
      console.log("OTP verification attempt:", values);
      handleSubmit(values);
    },
  });

  useEffect(() => {
    timer.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCodeSent(false);
          clearInterval(timer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, []);

  const handleSubmit = async (values) => {
    setLoading("loading");
    const payload = {
      email,
      code: values.code,
      fromForgotPassword: true,
    };
    const { response } = await Post({
      route: "auth/verify/otp",
      data: payload,
    });
    if (response) {
      Cookies.set("_xpdx_code", handleEncrypt(values?.code));
      RenderToast({
        type: "success",
        message: c("otpVerified"),
      });
      // router.push("/reset-password");
      window.location.replace("/reset-password");
    }
    setLoading("");
  };

  const handleResendOTP = async () => {
    setLoading("resend");
    const { response } = await Post({
      route: "auth/resend/otp",
      data: { email },
    });
    if (response) {
      RenderToast({
        type: "info",
        message: c("otpCodeSent"),
      });
      setIsCodeSent(true);
      setCountdown(60);
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCodeSent(false);
            clearInterval(timer.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setLoading("");
  };

  // if (!email || !code) {
  //   RenderToast({
  //     type: "error",
  //     message: !email ? c("noEmailFound") : c("otpCodeExpired"),
  //   });
  //   router.push("/login");
  //   return null;
  // }

  if (!email) {
    RenderToast({
      type: "error",
      message: c("noEmailFound"),
    });
    router.push("/login");
  }

  return (
    <Container className={mergeClass("containerFluid", styles.wrapper)}>
      <div className={styles.loginBox}>
        {isMobile ? (
          <>
            {" "}
            {/* responsive */}
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
            {!isMobile && <p className={styles.detailDesc}>{t("subtitle")}</p>}
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
            <div className={styles.otpContainer}>
              <OTPInput
                value={formik.values.code}
                onChange={formik.handleChange("code")}
                numInputs={4}
                separator={<span className={styles.separator}></span>}
                inputStyle={styles.otpInput}
                containerStyle={styles.otpWrapper}
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus
              />
              {formik.touched.code && formik.errors.code && (
                <p className={styles.error}>*{formik.errors.code}</p>
              )}
            </div>

            <div className={styles.resendSection}>
              <Button
                loading={loading === "resend"}
                showSpinner={loading === "resend"}
                disabled={isCodeSent}
                className={styles.codeButton}
                onClick={handleResendOTP}
                label={t("resendCode", { time: countdown })}
              />
            </div>

            <Button
              className={styles.submitBtn}
              onClick={formik.handleSubmit}
              type="submit"
              variant="primary"
              disabled={loading === "loading"}
              label={t("verifyButton")}
              loading={loading === "loading"}
              showSpinner
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
