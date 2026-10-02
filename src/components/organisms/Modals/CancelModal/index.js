import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import classes from "./Style.module.css";
import { useTranslations } from "@/resources/hooks/useTranslations";

export default function CancelModal({
  show,
  setShow,
  icon,
  title,
  btnText,
  content,
  description,
  onConfirm = () => {},
  loading,
}) {
  const t = useTranslations(content);

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      header={" "}
      maxWidth={"486px"}
    >
      <div className={classes.main}>
        <div className={classes?.topMain}>
          <Image
            src={icon}
            alt={t("iconAlt")}
            width={100}
            height={100}
            className={classes?.cancelIcon}
          />
          <div className={classes?.detail}>
            <h2>{title || t("title")}</h2>
            <p>{description || t("description")}</p>
          </div>
        </div>
        <div className={classes?.BottomMain}>
          <Button
            variant={"primary"}
            label={btnText || t("btnText1")}
            onClick={() => setShow(false)}
            className={classes?.buttons}
            disabled={loading}
            loading={loading}
            showSpinner={loading}
          />
          <Button
            className={classes?.buttons}
            variant={"outline"}
            label={btnText || t("btnText2")}
            onClick={() => {
              onConfirm();
            }}
            showSpinner={loading}
            disabled={loading}
            loading={loading}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
}
