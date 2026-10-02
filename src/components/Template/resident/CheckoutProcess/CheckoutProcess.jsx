"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import RenderToast from "@/components/atoms/RenderToast";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import SuccessModal from "@/components/organisms/Modals/SuccessModal";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { updateUser } from "@/store/auth/authSlice";
import { setAvailableTokens } from "@/store/common/commonSlice";
import { useFormik } from "formik";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import * as Yup from "yup";
import styles from "./styles.module.css";

export default function CheckoutProcess() {
  const t = useTranslations("checkoutPage");
  const c = useTranslations("common");
  const dispatch = useDispatch();
  const { Get, Post } = useAxios();
  const cartData = useSelector((state) => state.cartReducer.items);
  const cartItems = cartData;
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState("");
  const { width } = useDimensions();
  const router = useRouter();
  const locale = useLocale();

  const availableTokens = useSelector(
    (state) => state?.commonReducer?.availableTokens
  );

  const user = useSelector((state) => state.authReducer.user);

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName[locale] || "",
      // streetAddress: "",
      roomHouse: user?.accommodation?.accommodationNumber || "",
      // city: "",
      // country: "",
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required(t("orderDetails.fullNameRequired")),
      // streetAddress: Yup.string().required(
      //   t("orderDetails.streetAddressRequired")
      // ),
      roomHouse: Yup.string().required(t("orderDetails.roomHouseRequired")),
      // city: Yup.string().required(t("orderDetails.cityRequired")),
      // country: Yup.string().required(t("orderDetails.countryRequired")),
    }),
    onSubmit: (values) => {
      createOrder(values);
    },
  });
  const isMobile = width < 577;

  const createOrder = async (values) => {
    setLoading("loading");

    const itemsPayload = cartItems.map((item) => ({
      itemSlug: item.slug,
      quantity: item.quantity,
    }));

    const shippingDetails = {
      fullName: values.fullName,
      roomHouse: values.roomHouse,
      //  city: values.city,
      // country: values.country,
      // streetAddress: values.streetAddress,
    };

    const payload = {
      items: itemsPayload,
      shippingDetail: shippingDetails,
    };

    const { response } = await Post({
      route: "order/create",
      data: payload,
    });
    if (response) {
      dispatch({ type: "cart/clearCart" });
      await fetchTokens();
      setModalOpen("confirm");
      RenderToast({
        type: "success",
        message: t("orderPlacedSuccess"),
      });
    }
    setLoading("");
  };

  const fetchTokens = async () => {
    setLoading("fetchingTokens");
    const { response } = await Get({ route: "users/me" });
    if (response) {
      const tokens =
        response?.data?.foodTokens?.availableTokens ||
        user?.foodTokens?.availableTokens;
      dispatch(setAvailableTokens(tokens));
      dispatch(updateUser(response?.data));
    }
    setLoading("");
  };

  const getTotalPoints = () =>
    cartItems.reduce((acc, item) => acc + item.points * item.quantity, 0);

  const handleConfirm = () => {
    const totalPoints = getTotalPoints();
    if (totalPoints > availableTokens) {
      setModalOpen("confirm-red");
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <>
      <Container className={mergeClass(styles.main, "containerFluid")}>
        {isMobile ? (
          <MobileHeader title={t("title")} showBack />
        ) : (
          <TopHeader title={t("title")}>
            <div className={styles.walletInfo}>
              <p>{t("wallet")}</p>
              <div>
                <ReactSVG
                  className="reactSvg"
                  src="/svg/points.svg"
                  width={16}
                  height={16}
                />
                <span>{c("points", { points: availableTokens })}</span>
              </div>
            </div>
          </TopHeader>
        )}

        <div className={styles.cartContainer}>
          {/* Cart */}
          <OrderDetails formik={formik} t={t} />
          {isMobile && (
            <div className={styles.walletInfo}>
              <p>{t("wallet")}</p>
              <div>
                <ReactSVG
                  className="reactSvg"
                  src="/svg/points.svg"
                  width={16}
                  height={16}
                />
                <span>{c("points", { points: availableTokens })}</span>
              </div>
            </div>
          )}
          <div className={styles.cartRight}>
            <div className={styles.cartSummary}>
              <h2>{t("orderSummary")}</h2>
              <div className={styles.cartTotal}>
                <p>
                  <span>{t("totalItems")}</span>
                  <span>{cartItems.length}</span>
                </p>
                <p>
                  <span>{t("totalPoints")}</span>
                  <span>
                    {cartItems.reduce(
                      (acc, item) => acc + item.points * item.quantity,
                      0
                    )}
                  </span>
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              label={t("confirm")}
              onClick={handleConfirm}
              loading={loading === "loading"}
              showSpinner
              disabled={cartItems.length === 0 || loading === "loading"}
            />
          </div>
        </div>
      </Container>
      <SuccessModal
        show={modalOpen === "confirm"}
        setShow={setModalOpen}
        icon="/svg/success.svg"
        content="checkoutPage.modal"
        onClose={() => router.push("/resident/food-stuffs")}
      />
      <SuccessModal
        show={modalOpen === "confirm-red"}
        setShow={setModalOpen}
        icon="/svg/unsuccess.svg"
        content="checkoutPage.unsuccessModal"
        btnStyle={{ background: "var(--Red)" }}
      />
    </>
  );
}

function OrderDetails({ formik, t }) {
  return (
    <div className={styles.orderDetails}>
      <h1>{t("orderDetails.title")}</h1>
      <Input
        value={formik.values.fullName}
        setValue={formik.handleChange("fullName")}
        label={t("orderDetails.fullNameLabel")}
        placeholder={t("orderDetails.fullNamePlaceholder")}
        errorText={formik.touched.fullName && formik.errors.fullName}
        inputContainerClass={styles.inpMain}
        className={styles.inputClass}
        disabled={formik.values.fullName}
      />
      <Input
        value={formik.values.roomHouse}
        setValue={formik.handleChange("roomHouse")}
        label={t("orderDetails.roomHouseLabel")}
        placeholder={t("orderDetails.roomHousePlaceholder")}
        errorText={formik.touched.roomHouse && formik.errors.roomHouse}
        inputContainerClass={styles.inpMain}
        className={styles.inputClass}
        disabled={formik.values.roomHouse}
      />
      {/* <Input
        value={formik.values.streetAddress}
        setValue={formik.handleChange("streetAddress")}
        label={t("orderDetails.streetAddressLabel")}
        placeholder={t("orderDetails.streetAddressPlaceholder")}
        errorText={formik.touched.streetAddress && formik.errors.streetAddress}
        inputContainerClass={styles.inpMain}
        className={styles.inputClass}
      />
      <Input
        value={formik.values.city}
        setValue={formik.handleChange("city")}
        label={t("orderDetails.cityLabel")}
        placeholder={t("orderDetails.cityPlaceholder")}
        errorText={formik.touched.city && formik.errors.city}
        inputContainerClass={styles.inpMain}
        className={styles.inputClass}
      />
      <Input
        value={formik.values.country}
        setValue={formik.handleChange("country")}
        label={t("orderDetails.countryLabel")}
        placeholder={t("orderDetails.countryPlaceholder")}
        errorText={formik.touched.country && formik.errors.country}
        inputContainerClass={styles.inpMain}
        className={styles.inputClass}
      /> */}
    </div>
  );
}
