"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDirection from "@/resources/hooks/useDirection";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { signOutRequest } from "@/store/auth/authSlice";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import classes from "./ChangePasswordTemplate.module.css";
import RenderToast from "@/components/atoms/RenderToast";

export default function ChangePasswordTemplate() {
  const { Patch } = useAxios();
  const direction = useDirection();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("changePasswordPage");
  const [dir, setDir] = useState(direction);
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object().shape({
      currentPassword: Yup.string().required(
        t("validation.currentPasswordRequired"),
      ),
      newPassword: Yup.string()
        .required(t("validation.newPasswordRequired"))
        .min(8, t("validation.passwordMinLength"))
        .max(20, t("validation.passwordMaxLength"))
        .matches(/[a-z]/, t("validation.passwordLowercase"))
        .matches(/[A-Z]/, t("validation.passwordUppercase"))
        .matches(/[0-9]/, t("validation.passwordNumber"))
        .matches(/[!@#$%^&*(),.?":{}|<>]/, t("validation.passwordSpecialChar")),
      confirmNewPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          t("validation.passwordsMustMatch"),
        )
        .required(t("validation.confirmNewPasswordRequired")),
    }),
    onSubmit: (values) => {
      handleChangePassword(values);
    },
  });

  const handleChangePassword = async (values) => {
    setLoading(true);
    const payload = {
      password: values.newPassword,
      confirmPassword: values.confirmNewPassword,
      currentPassword: values.currentPassword,
    };

    const { response } = await Patch({
      route: "auth/update/password",
      data: payload,
    });
    if (response) {
      RenderToast({
        type: "success",
        message: t("successMessage"),
      });
      formik.resetForm();
      dispatch(signOutRequest());
      sessionStorage.clear();
      router.replace("/login");
      Cookies.remove("_xpdx_acom-web");
      Cookies.remove("_xpdx_rf_acom-web");
      Cookies.remove("_xpdx_u_acom-web");
    }
    setLoading(false);
  };

  return (
    <Container className={mergeClass("containerFluid", classes.main)}>
      <TopHeader title={t("title")} showBackBtn />
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Input
          label={t("currentPassword")}
          type="password"
          placeholder={t("currentPassword")}
          value={formik.values.currentPassword}
          setValue={(val) => formik.setFieldValue("currentPassword", val)}
          errorText={
            formik.touched.currentPassword && formik.errors.currentPassword
          }
          dir={dir}
        />
        <Input
          label={t("newPassword")}
          type="password"
          placeholder={t("newPassword")}
          value={formik.values.newPassword}
          setValue={(val) => formik.setFieldValue("newPassword", val)}
          errorText={formik.touched.newPassword && formik.errors.newPassword}
          dir={dir}
        />
        <Input
          label={t("confirmNewPassword")}
          type="password"
          placeholder={t("confirmNewPassword")}
          value={formik.values.confirmNewPassword}
          setValue={(val) => formik.setFieldValue("confirmNewPassword", val)}
          errorText={
            formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword
          }
          dir={dir}
        />
        <Button
          type="submit"
          label={t("updatePasswordButton")}
          variant={"primary"}
          loading={loading}
          disabled={loading}
          showSpinner
        />
      </form>
    </Container>
  );
}
