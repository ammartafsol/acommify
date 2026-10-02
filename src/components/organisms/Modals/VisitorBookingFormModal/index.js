"use client";
import React, { useState } from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Input from "@/components/atoms/Input/Input";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import classes from "./style.module.css";
import Button from "@/components/atoms/Button";
import DropDown from "@/components/molecules/DropDown/DropDown";
import useDimensions from "@/resources/hooks/useDimensions";
import SuccessModal from "../SuccessModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegCalendar } from "react-icons/fa6";
import moment from "moment-timezone";

const relationshipOptions = (t) => [
  // { label: t("modal.relationshipStatus.Self"), value: "self" },
  { label: t("modal.relationshipStatus.Father"), value: "father" },
  { label: t("modal.relationshipStatus.Mother"), value: "mother" },
  { label: t("modal.relationshipStatus.Sibling"), value: "sibling" },
  { label: t("modal.relationshipStatus.Spouse"), value: "spouse" },
  { label: t("modal.relationshipStatus.Children"), value: "children" },
];

export default function VisitorBookingFormModal({
  setShow,
  show,
  t,
  selectedDate,
  selectedSlot,
  accommodation,
  onBookingSuccess,
}) {
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      // relationship: null,
      date: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : "",
      startTime: selectedSlot ? moment(selectedSlot.start).format("HH:mm") : "",
      endTime: selectedSlot ? moment(selectedSlot.end).format("HH:mm") : "",
      notes: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      // relationship: Yup.object().required("Required"),
      date: Yup.date().required("Required"),
      notes: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const visitorData = {
          visitorName: values.name,
          // relationship: values.relationship.value,
          additionalNotes: values.notes,
        };

        await onBookingSuccess(visitorData);
        setSuccessModal(true);
        setShow(false);
      } catch (error) {
        console.error("Booking failed:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      padding="20px 32px"
      header={t("modal.header")}
    >
      <div className={classes.main}>
        <Input
          placeholder={t("modal.placeholders.namePlaceholder")}
          label={t("modal.inputLabels.nameLabel")}
          value={formik.values.name}
          setValue={(value) => formik.setFieldValue("name", value)}
          errorText={formik.touched.name && formik.errors.name}
        />

        {/* <DropDown
          dropDownContainerClass={classes.dropDownContainer}
          label={t("modal.inputLabels.relationshipLabel")}
          options={relationshipOptions(t)}
          // placeholder={t("modal.placeholders.relationshipPlaceholder")}
          value={formik.values.relationship}
          setValue={(value) => formik.setFieldValue("relationship", value)}
          errorText={formik.touched.relationship && formik.errors.relationship}
        /> */}
        <div className={classes.InputContainer}>
          <Input
            label={t("modal.inputLabels.dateLabel")}
            value={formik.values.date}
            setValue={(value) => formik.setFieldValue("date", value)}
            errorText={formik.touched.date && formik.errors.date}
            type="date"
            rightIcon={<FaRegCalendar size={18} />}
            inputContainerClass={classes.dateInput}
            disabled={true} // Disable since date is already selected
          />

          <Input
            label={t("modal.inputLabels.startTimeLabel")}
            value={formik.values.startTime}
            setValue={(value) => formik.setFieldValue("startTime", value)}
            disabled={true} // Disable since time slot is already selected
          />

          <Input
            label={t("modal.inputLabels.endTimeLabel")}
            value={formik.values.endTime}
            setValue={(value) => formik.setFieldValue("endTime", value)}
            disabled={true} 
          />
        </div>
        <TextArea
          placeholder={t("modal.placeholders.notesPlaceholder")}
          label={t("modal.inputLabels.notesLabel")}
          value={formik.values.notes}
          setter={(value) => formik.setFieldValue("notes", value)}
          errorText={formik.touched.notes && formik.errors.notes}
        />
        <div
          className={
            isMobile ? classes.ButtonContainerMobile : classes?.ButtonContainer
          }
        >
          {/* {!isMobile && (
            <Button
              variant="outlined"
              label={t("modal.btns.cancel")}
              onClick={() => setShow(false)}
            />
          )} */}
          <Button
            variant="outlined"
            label={t("modal.btns.cancel")}
            onClick={() => setShow(false)}
          />
          <Button
            variant="primary"
            label={t("modal.btns.submit")}
            onClick={formik.handleSubmit}
            loading={loading}
            disabled={loading}
            showSpinner
          />
          {/* {isMobile && (
            <div className={classes.btnsMain}>
              <Button
                className={classes.visitBtn}
                variant="blue"
                label={t("modal.btns.rules")}
              />
              <Button
                className={classes.visitBtn}
                variant="blue"
                label={t("modal.btns.upcomingVisits")}
              />
            </div>
          )} */}
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          setShow={setSuccessModal}
          show={showSuccessModal}
          content={t("successModalData")}
        />
      )}
    </ModalSkeleton>
  );
}
