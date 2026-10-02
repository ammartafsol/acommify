import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { useTranslations } from "@/resources/hooks/useTranslations";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./style.module.css";
import { useFormik } from "formik";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";
import * as Yup from "yup";

export default function BookFormModal({ setShow, show, dateTime, onClick }) {
  const { user } = useSelector((state) => state.authReducer);
  const locale = useLocale();
  const t = useTranslations("modal.bookFormModal");
  const formik = useFormik({
    initialValues: {
      name: user?.fullName?.[locale] || "",
      date: moment(dateTime).format("YYYY-MM-DD") || "",
      time: moment(dateTime).format("HH:mm A") || "",
      reason: "",
      notes: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      reason: Yup.string().required(t("reasonRequired")),
      notes: Yup.string().max(500, t("notesMax")),
    }),
    onSubmit: (values) => {
      onClick(values);
    },
  });

  return (
    <ModalSkeleton setShow={setShow} show={show} header={t("header")}>
      <div className={classes.main}>
        <Input
          placeholder={t("namePlaceholder")}
          label={t("nameLabel")}
          readOnly
          value={formik.values.name}
        />
        <div className={classes.InputContainer}>
          <Input label={t("dateLabel")} value={formik.values?.date} readOnly />
          <Input label={t("timeLabel")} value={formik.values?.time} readOnly />
        </div>
        <Input
          placeholder={t("reasonPlaceholder")}
          label={t("reasonLabel")}
          value={formik.values.reason}
          setValue={formik.handleChange("reason")}
          errorText={formik.touched.reason && formik.errors.reason}
        />
        <TextArea
          placeholder={t("notesPlaceholder")}
          label={t("notesLabel")}
          value={formik.values.notes}
          setter={formik.handleChange("notes")}
          errorText={formik.touched.notes && formik.errors.notes}
        />

        <div className={classes.buttonContainer}>
          <Button variant="outlined" label={t("cancelButton")} />
          <Button
            variant="primary"
            label={t("confirmButton")}
            onClick={formik.handleSubmit}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
}
