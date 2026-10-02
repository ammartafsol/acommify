import Button from "@/components/atoms/Button";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import DropDown from "@/components/molecules/DropDown/DropDown";
import useAxios from "@/interceptor/axios-functions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { createFormData } from "@/resources/utils/helper";
import { useFormik } from "formik";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import * as yup from "yup";
import UploadMedia from "../../UploadMedia";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./style.module.css";
import RenderToast from "@/components/atoms/RenderToast";

export default function MaintenanceRequestsModal({
  setShowSuccessModal,
  setShow,
  show,
  // data,
  modalData,
  setModalData,
  onSave = () => {},
}) {
  const { Post, Get, Patch } = useAxios();
  const t = useTranslations("maintenance.maintenanceRequests");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState("");
  const locale = useLocale();

  const getCategories = async () => {
    setLoading("categories");
    const { response } = await Get({
      route: `category/all?crudType=maintenance-request`,
    });

    if (response) {
      const allCategories = response?.data?.map((cat) => {
        return { label: cat.name[locale], value: cat.slug };
      });

      setCategories(allCategories || []);
    }
    setLoading("");
  };

  const addNewRequestHandler = async (values) => {
    setLoading("loading");

    // Separate existing files (URLs/strings) from new files (File objects)
    const existingFiles = values.media.filter(
      (file) =>
        typeof file === "string" ||
        (typeof file === "object" && file?.url && !(file instanceof File))
    );
    const newFiles = values.media.filter((file) => file instanceof File);

    // Extract file URLs/keys from existing files
    const keepDocuments = existingFiles
      .map((file) => {
        if (typeof file === "string") {
          return file;
        }
        return file?.url || file?.key || file;
      })
      .filter(Boolean); // Remove any undefined/null values

    const formData = createFormData({
      description: values.description,
      categorySlug: values.requestType?.value,
      documents: newFiles, // Only send new File objects
    });

    if (modalData && keepDocuments.length > 0) {
      keepDocuments.forEach((fileUrl) => {
        formData.append("keepDocuments[]", fileUrl);
      });
    }

    const route = modalData
      ? `maintenance-request/update/${modalData?.slug}`
      : "maintenance-request/create";
    const { response } = await (modalData ? Patch : Post)({
      route,
      data: formData,
      isFormData: true,
    });

    if (response) {
      if (!modalData) {
        setShowSuccessModal(true);
      } else {
        RenderToast({
          type: "success",
          message: t("toasts.updateSuccess"),
        });
      }
      setShow(false);
      onSave();
      formik.resetForm();
      setModalData(null);
    }
    setLoading("");
  };

  const formik = useFormik({
    initialValues: {
      description: modalData?.description || "",
      requestType:
        {
          label: modalData?.category?.name[locale],
          value: modalData?.category?.slug,
        } || null,
      media: modalData?.documents || [],
      // keepDocuments: modalData?.documents || [],
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      description: yup.string().required(t("requestForm.descriptionError")),
      requestType: yup.object().required(t("requestForm.typeError")),
      media: yup
        .array()
        .min(1, t("requestForm.mediaError"))
        .max(3, t("requestForm.mediaMaxError"))
        .required(t("requestForm.mediaError")),
    }),
    onSubmit: (values) => {
      if (modalData && modalData?.status !== "pending") {
        RenderToast({
          type: "error",
          message: t("toasts.editNotAllowed"),
        });
        return;
      }
      addNewRequestHandler(values);
    },
  });

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ModalSkeleton
      maxWidth="698px"
      header={
        modalData ? t("requestForm.modalEdit") : t("requestForm.modalTitle")
      }
      show={show}
      setShow={setShow}
    >
      {loading === "categories" ? (
        <SpinnerLoading />
      ) : (
        <div className={classes.main}>
          <TextArea
            label={t("requestForm.descriptionLabel")}
            placeholder={t("requestForm.descriptionPlaceholder")}
            value={formik.values.description}
            setter={(form) => formik.setFieldValue("description", form)}
            errorText={formik.touched.description && formik.errors.description}
          />

          <DropDown
            label={t("requestForm.typeLabel")}
            placeholder={t("requestForm.typePlaceholder")}
            dropDownContainerClass={classes.dropdown}
            options={categories}
            value={formik.values.requestType}
            setValue={(option) => formik.setFieldValue("requestType", option)}
            error={formik.touched.requestType && formik.errors.requestType}
          />

          <UploadMedia
            fileDisplayName={t("requestForm.fileDisplayName")}
            files={formik.values.media}
            handleFileChange={(files) => {
              // // Append new files to existing files
              // const currentFiles = [...formik.values.media];
              // const updatedFiles = [...currentFiles, ...files];
              formik.setFieldValue("media", files, true);
              formik.validateField("media");
            }}
            handleRemoveFile={(index) => {
              const newFiles = [...formik.values.media];
              newFiles.splice(index, 1);
              formik.validateField("media");
              formik.setFieldValue("media", newFiles, true);
            }}
            error={formik.touched.media && formik.errors.media}
            multiple={true}
            accept="image/*"
            maxFiles={3}
            maxSizeMB={5}
          />
          <div className={classes.Btn}>
            <Button
              variant={"outlined"}
              label={t("requestForm.cancelButton")}
              onClick={() => setShow(false)}
            />
            <Button
              variant={"primary"}
              label={t("requestForm.submitButton")}
              onClick={formik.handleSubmit}
              disabled={
                (modalData && modalData?.status !== "pending") ||
                loading === "loading"
              }
              loading={loading === "loading"}
              showSpinner
            />
          </div>
        </div>
      )}
    </ModalSkeleton>
  );
}
