"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import RenderToast from "@/components/atoms/RenderToast";
import { LoginSchema } from "@/formik/schema/loginSchema";
import { Link, useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import { handleEncrypt } from "@/interceptor/encryption";
import useDimensions from "@/resources/hooks/useDimensions";
import useDirection from "@/resources/hooks/useDirection";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { saveLoginUserData } from "@/store/auth/authSlice";
import { setAvailableTokens } from "@/store/common/commonSlice";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";

export default function Login() {
  const t = useTranslations("loginPage");
  const c = useTranslations("toasts");
  const { width } = useDimensions();
  const router = useRouter();
  const isMobile = width < 577;
  const [loading, setLoading] = useState("");
  const { Post } = useAxios();
  const dispatch = useDispatch();
  const dir = useDirection();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      residentId: "",
    },
    validationSchema: LoginSchema(t),
    onSubmit: (values) => {
      console.log("Login attempt:", values);
      handleLogin(values);
    },
  });

  const handleLogin = async (values) => {
    setLoading("loading");
    const payload = {
      email: values.email,
      password: values.password,
    };
    const { response } = await Post({
      route: "auth/login",
      data: payload,
    });
    if (response) {
      console.log(response);
      const { accessToken, refreshToken } = response?.data;
      // const { role } = response?.data?.user;
      Cookies.set("_xpdx_acom-web", handleEncrypt(accessToken), { expires: 7 });
      // Cookies.set("role", role, { expires: 90 });
      Cookies.set(
        "_xpdx_rf_acom-web",
        handleEncrypt(response?.data?.refreshToken),
        {
          expires: 7,
        }
      );
      Cookies.set(
        "_xpdx_u_acom-web",
        handleEncrypt(JSON.stringify(response?.data?.user)),
        {
          expires: 90,
        }
      );

      dispatch(saveLoginUserData(response?.data));
      dispatch(
        setAvailableTokens(response?.data?.user?.foodTokens?.availableTokens)
      );
      const privacyAccepted = Boolean(
        response?.data?.user?.privacyPolicyAccepted,
      );
      if (privacyAccepted) {
        Cookies.set("_pp_accepted", "1", { expires: 90, path: "/" });
      } else {
        Cookies.remove("_pp_accepted", { path: "/" });
      }
      if (values.rememberMe) {
        Cookies.set("_xpdx_rf_acom-web", handleEncrypt(refreshToken), {
          expires: 90,
        });
      }

      router.push(
        privacyAccepted ? "/resident/" : "/privacy-policy-acceptance",
      );
      RenderToast({
        type: "success",
        message: c("loginSuccess"),
      });
    }
    setLoading("");
  };

  return (
    <Container
      className={mergeClass("containerFluid", styles.wrapper, styles.loginBox)}
    >
      <div className={styles.loginBox}>
        <div className={styles.loginBoxTop}>
          {/* responsive */}
          {isMobile ? (
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
          ) : (
            <div className={styles.header}>
              <div className={styles.icon}>
                <ReactSVG src="/svg/login.svg" className="reactSvg" />
              </div>
              <h1>{t("title")}</h1>
            </div>
          )}
          <div className={isMobile ? styles.mobileLoginMain : ""}>
            <div className={styles.loginBoxMiddle}>
              <div className={styles.inputGroup}>
                <Input
                  label={t("emailLabel")}
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  value={formik.values.email}
                  setValue={formik.handleChange("email")}
                  errorText={formik.touched.email && formik.errors.email}
                  disabled={loading}
                  onEnterClick={formik.handleSubmit}
                  dir={dir}
                />
              </div>
              <div className={styles.inputGroup}>
                <Input
                  label={t("passwordLabel")}
                  placeholder={t("passwordPlaceholder")}
                  type={"password"}
                  value={formik.values.password}
                  setValue={formik.handleChange("password")}
                  errorText={formik.touched.password && formik.errors.password}
                  disabled={loading}
                  onEnterClick={formik.handleSubmit}
                  dir={dir}
                />
                <div className={styles.forgotPassword}>
                  <Link href="/forgot-password">{t("forgotPass")}</Link>
                </div>
              </div>
              <Form.Check
                className={styles.checkbox}
                type="checkbox"
                id="rememberMe"
                label={t("rememberMe")}
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <div className={styles.loginBoxBottom}>
                <Button
                  className={styles.loginButton}
                  onClick={formik.handleSubmit}
                  type="submit"
                  variant="primary"
                  label={t("loginButton")}
                  disabled={loading}
                  loading={loading}
                  showSpinner={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
