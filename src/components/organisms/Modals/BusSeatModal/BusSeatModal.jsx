import Input from "@/components/atoms/Input/Input";
import { useState } from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./Style.module.css";
import Button from "@/components/atoms/Button";
import { useTranslations } from "@/resources/hooks/useTranslations";

export default function BusSeatModal({
  show,
  setShow,
  data,
  onConfirm = () => {},
}) {
  // data = { seatNumber: "A1" }
  const [passenger, setPassenger] = useState("");
  const t = useTranslations("modal.busSeatModal");
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      header={t("seatHeading", { seat: data })}
      maxWidth={"486px"}
    >
      <div className={classes.main}>
        <Input
          label={t("passengerNameLabel")}
          value={passenger}
          setValue={setPassenger}
          placeholder={t("passengerNamePlaceholder")}
          id="passengerName"
          className={classes.input}
        />
        <div className={classes.buttonContainer}>
          <Button
            label={t("cancelButton")}
            variant="secondary"
            className={classes.button}
            onClick={() => setShow(false)}
          />
          <Button
            label={t("confirmButton")}
            variant="primary"
            disabled={!passenger.trim()}
            className={classes.button}
            onClick={() => {
              // Handle confirm action here
              onConfirm({
                seatNumber: data,
                passengerName: passenger,
              });
              setShow(false);
            }}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
}
