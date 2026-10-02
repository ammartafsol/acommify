import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import classes from "./AreYouSureModal.module.css";
import { useTranslations } from "@/resources/hooks/useTranslations";

export default function AreYouSureModal({ show, setShow, loading, onConfirm, onSuccess = () => {} }) {
  const t = useTranslations("areYouSureModal");
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      maxWidth="400px"
      padding="30px"
      borderRadius="24px"
      // header={t("title")}
    className={classes.modal}
    >
      <div className={classes.container}>
        <p className={classes.title}>{t("title")}</p>
        <p className={classes.message}>{t("description")}</p>
        <div className={classes.actions}>
          <Button
            label={t("cancel")}
            variant={"outlined"}
            onClick={() => {
              setShow(false);
              onSuccess();
            }}
          />
          <Button
            variant={"primary"}
            onClick={onConfirm}
            label={loading ? t("loading") : t("confirm")}
            loading={loading}
            showSpinner
            disabled={loading}
            className={classes.confirmButton}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
}
