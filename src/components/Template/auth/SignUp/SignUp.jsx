"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import { SignUpSchema } from "@/formik/schema/SignUpSchema";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import useDimensions from "@/resources/hooks/useDimensions";
import Image from "next/image";
import useDirection from "@/resources/hooks/useDirection";

export default function SignUp() {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timer = useRef(null);
  const t = useTranslations("signUpPage");
  const router = useRouter();
  const { width } = useDimensions();
  const dir = useDirection();
  const isMobile = width < 577;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema(t),
    onSubmit: (values) => {
      console.log("Signup attempt:", values);
      // Handle signup logic here
    },
  });

  const handleCodeSubmit = () => {
    setIsCodeSent(true);
    setCountdown(30);

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
  };

  return (
    <Container className={mergeClass("containerFluid", styles.wrapper)}>
      <div className={styles.loginBox}>
        <div className={styles?.loginBoxTop}>
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
          <div className={styles.inputGroup}>
            <Input
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              type="text"
              value={formik.values.name}
              setValue={formik.handleChange("name")}
              errorText={formik.touched.name && formik.errors.name}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              type="email"
              value={formik.values.email}
              setValue={formik.handleChange("email")}
              errorText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              label={t("codeLabel")}
              label2={<span>{t("codeSubLabel")}</span>}
              className={styles.codeInput}
              placeholder={t("codePlaceholder")}
              type="text"
              value={formik.values.code}
              setValue={formik.handleChange("code")}
              errorText={formik.touched.code && formik.errors.code}
            />
            <button
              disabled={isCodeSent}
              className={styles.codeButton}
              onClick={handleCodeSubmit}
            >
              {isCodeSent
                ? t("resendCode", { time: countdown })
                : t("sendCode")}
            </button>
          </div>
          <div className={styles.inputGroup}>
            <Input
              label={t("passwordLabel")}
              placeholder={t("passwordPlaceholder")}
              type={"password"}
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
              type={"password"}
              value={formik.values.confirmPassword}
              setValue={formik.handleChange("confirmPassword")}
              errorText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              dir={dir}
            />
          </div>{" "}
        </div>
        <div className={styles?.loginBoxBottom}>
          <Button
            className={styles.signUpButton}
            onClick={formik.handleSubmit}
            type="submit"
            variant="primary"
            label={t("signUpButton")}
          />
          <div className={styles.signupLink}>
            {t("joinedUsBefore")}&nbsp;
            <Link href="/login">{t("signInLink")}</Link>
          </div>{" "}
        </div>
      </div>
    </Container>
  );
}
