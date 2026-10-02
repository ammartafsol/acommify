"use client";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import ConfirmationBookingCard from "@/components/molecules/ConfirmationBookingCard/ConfirmationBookingCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import PassengerCard from "@/components/molecules/PassengerCard/PassengerCard";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { Link, useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import Image from "next/image";
import { useState } from "react";
import { Container } from "react-bootstrap";
import classes from "./styles.module.css";

export default function BusBookingConfirmation({ slug, confirmationId }) {
  const t = useTranslations("busBooking.bookingConfirmation");
  const { width } = useDimensions();
  // const [show, setShow] = useState(false);
  const isMobile = width < 577;
  const [termsAgreed, setTermsAgreed] = useState(false);
  const router = useRouter();

  return (
    <div className={classes.container}>
      <Container className="containerFluid">
        {isMobile ? (
          <MobileHeader title={t("title")} showBack={true} />
        ) : (
          <TopHeader title={t("title")} />
        )}

        <div className={classes.main}>
          <div className={classes.left}>
            {isMobile && (
              <div className={classes.bookingContainer}>
                <Image
                  src="/svg/Successfully.svg"
                  height={100}
                  width={100}
                  alt="bookingConfirm"
                />

                <div className={classes?.bookingDescription}>
                  <h2> {t("successful")}</h2>
                </div>
              </div>
            )}
            <div className={classes.trips}>
              <p>{t("yourTrip")}</p>

              <ConfirmationBookingCard t={t} />
            </div>
            <div className={classes.passengersList}>
              <p>{t("passengerList")}</p>
              <PassengerCard verified={false} />
            </div>
          </div>
          <div className={classes.right}>
            {/* <Checkbox
              label={t("termsAgreement")}
              value={termsAgreed}
              setValue={setTermsAgreed}
            /> */}
            
            <Checkbox
              label={
                <>
                  {t("termsAgreement")}
                  <Link
                    href="/terms-and-conditions"
                    style={{ color: "#007bff", textDecoration: "underline" }}
                  >
                    {t("termsAndConditions")}
                  </Link>
                </>
              }
              value={termsAgreed}
              setValue={setTermsAgreed}
            />

            <div className={classes.confirmationButton}>
              <Button
                label={t("confirmBooking")}
                variant={"primary"}
                className={classes.confirmBtn}
                onClick={() =>
                  router.push(
                    `/resident/bus-booking/${slug}/e-ticket/${confirmationId}`
                  )
                }
                disabled={!termsAgreed}
              />
              <div className={classes?.buttonsFooter}>
                <Button
                  label={t("rescheduleBooking")}
                  variant={"outlined"}
                  className={classes.rescheduleBtn}
                  onClick={() => router.push(`/resident/bus-booking/${slug}/`)}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
