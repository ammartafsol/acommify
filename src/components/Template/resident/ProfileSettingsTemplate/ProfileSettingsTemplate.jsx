"use client";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import PhoneInput from "@/components/atoms/PhoneInput/PhoneInput";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import DropDown from "@/components/molecules/DropDown/DropDown";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import UploadPhoto from "@/components/molecules/UploadPhoto";
import { personalProfileSchema } from "@/formik/schema/personalProfileSchema";
import { languageObject, languageOptions } from "@/i18n";
import { usePathname, useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import useDirection from "@/resources/hooks/useDirection";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { createFormData, handleLanguageChange } from "@/resources/utils/helper";
import { updateUser } from "@/store/auth/authSlice";
import { useFormik } from "formik";
import moment from "moment-timezone";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { IoAddOutline, IoCalendarOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import classes from "./styles.module.css";
import { setAvailableTokens } from "@/store/common/commonSlice";

export default function ProfileSettingsTemplate() {
  const t = useTranslations("personalProfilePage");
  const pathname = usePathname();
  const { user } = useSelector((state) => state.authReducer);
  const router = useRouter();
  const { Patch, Post } = useAxios();
  const direction = useDirection();
  const [dir, setDir] = useState(direction);
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions?.find((l) => l.value === user?.defaultLanguage) ||
      languageOptions[0]
  );
  const langOptions = languageOptions;
  const localLang = useLocale();

  const [activeLanguage, setActiveLanguage] = useState(localLang);

  const relationshipOptions = [
    {
      label: t("relationshipOptions.father"),
      value: "father",
    },
    {
      label: t("relationshipOptions.mother"),
      value: "mother",
    },
    {
      label: t("relationshipOptions.sibling"),
      value: "sibling",
    },
    {
      label: t("relationshipOptions.spouse"),
      value: "spouse",
    },
    {
      label: t("relationshipOptions.children"),
      value: "children",
    },
  ];

  const genderOptions = [
    {
      label: t("genderOptions.male"),
      value: "male",
    },
    {
      label: t("genderOptions.female"),
      value: "female",
    },
    {
      label: t("genderOptions.other"),
      value: "other",
    },
  ];

  const schoolPlacementOptions = [
    { value: "placed", label: "Placed" },
    { value: "not-placed", label: "Not Placed" },
  ];

  const transportTypeOptions = [
    { value: "bus", label: "Bus" },
    { value: "carpool", label: "Carpool" },
    { value: "family", label: "Family" },
  ];

  const locale = useLocale();
  const { width } = useDimensions();
  const isMobile = width < 577;
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const updateMeHandler = async (values) => {
    setLoading("submitting");

    const payload = {
      defaultLanguage: selectedLanguage?.value || "en",
      photo: values.photo,
      fullName: values.generalInformation.fullName,
      callingCode: values.generalInformation.callingCode,
      dob: values.generalInformation.dob || "",
      phoneNumber: values.generalInformation.phoneNumber?.slice(
        values.generalInformation.callingCode?.length
      ),
      email: values.generalInformation.email,
      userId: values.generalInformation.residentIdNumber,
      accommodation: {
        accommodationNumber: values.generalInformation.houseNumber,
      },
      familyMembers: values.familyMembers
        .map((fm) => {
          const memberData = {
            fullName: fm.fullName,
            relationship: fm.relationship?.value,
            trcNumber: fm.trcNumber,
            ...(fm.dob && { dob: fm.dob }),
            ...(fm._id && { _id: fm._id }),
            ...(fm.gender && { gender: fm.gender?.value || fm.gender }),
            ...(fm.relationship?.value === "children" && {
              schoolPlacement: fm.schoolPlacement?.value,
              ...(fm.schoolPlacement?.value === "placed" && {
                schoolName: fm.schoolName,
                year: fm.year,
                transportType: fm.transportType?.value,
                books: fm.books?.filter((book) => book && book.trim() !== ""),
              }),
            }),
          };
          return Object.keys(memberData).length > 0 ? memberData : false;
        })
        .filter(Boolean),
    };

    const myself = {
      fullName: values.generalInformation.fullName,
      relationship: "self",
      dob: values.generalInformation.dob || "",
      ...(values.generalInformation.gender && {
        gender:
          values.generalInformation.gender?.value ||
          values.generalInformation.gender,
      }),
    };
    payload.familyMembers?.unshift(myself);

    const { response } = await Patch({
      route: "users/update/me",
      data: payload,
    });

    if (response) {
      dispatch(updateUser(response?.data));
      dispatch(setAvailableTokens(response?.data?.foodTokens?.availableTokens));
      setSelectedLanguage(
        languageOptions?.find(
          (l) => l.value === response?.data?.defaultLanguage
        ) || languageOptions[0]
      );
      if (locale !== response?.data?.defaultLanguage) {
        handleLanguageChange(router, pathname, response?.data?.defaultLanguage);
      }
      setIsEdit(false);
      RenderToast({
        type: "success",
        message: t("toasts.updateSuccess"),
      });
    }

    setLoading("");
  };

  const formik = useFormik({
    initialValues: {
      photo: user?.photo,
      generalInformation: {
        fullName: user?.fullName || languageObject,
        dob: moment(user?.familyMembers[0]?.dob).format("YYYY-MM-DD") || "",
        residentIdNumber: user?.userId || "",
        houseNumber: user?.accommodation?.accommodationNumber || "N/A",
        callingCode: user?.callingCode || "+1",
        gender: user?.familyMembers?.[0]?.gender
          ? genderOptions.find(
              (g) => g.value === user?.familyMembers?.[0]?.gender
            ) || ""
          : "",
        phoneNumber: user?.phoneNumber
          ? `${user?.callingCode}${user?.phoneNumber}`
          : "",
        email: user?.email || "",
      },
      familyMembers: (user?.familyMembers?.slice(1) || []).map((fm) => ({
        fullName: fm.fullName || languageObject,
        relationship: fm.relationship
          ? relationshipOptions.find((r) => r.value === fm.relationship)
          : null,
        dob: fm.dob ? moment(fm.dob).format("YYYY-MM-DD") : "",
        schoolName: fm.schoolName || languageObject,
        trcNumber: fm.trcNumber || "",
        schoolPlacement: fm.schoolPlacement
          ? schoolPlacementOptions.find((sp) => sp.value === fm.schoolPlacement)
          : null,
        year: fm.year || "",
        transportType: fm.transportType
          ? transportTypeOptions.find((tt) => tt.value === fm.transportType)
          : null,
        books: fm.books && fm.books.length > 0 ? fm.books : [""],
        _id: fm._id,
        gender: fm.gender
          ? genderOptions.find((g) => g.value === fm.gender) || ""
          : "",
      })),
    },
    enableReinitialize: true,
    validationSchema: personalProfileSchema(t),
    onSubmit: (values) => {
      updateMeHandler(values);
    },
  });

  const UploadPhotoHandler = async (val) => {
    if (!val) return [];
    setLoading("uploading");

    const formData = createFormData({ image: val });
    const { response } = await Post({
      route: "media/upload",
      data: formData,
      isFormData: true,
    });

    if (response?.status === "success") {
      const keys = response?.data?.image?.map((image) => image?.key) || [];
      formik.setFieldValue("photo", keys[0]);
    } else {
      RenderToast({ type: "error", message: "Failed to upload" });
    }
    setLoading("");
  };

  const handleAddFamilyMember = () => {
    const newMember = {
      fullName: languageObject,
      relationship: null,
      dob: "",
      schoolName: languageObject,
      schoolPlacement: null,
      year: "",
      transportType: null,
      books: [""],
      gender: "",
    };

    // Get current family members from formik values
    const currentFamilyMembers = formik.values.familyMembers || [];
    const updatedFamilyMembers = [...currentFamilyMembers, newMember];

    // Update formik state
    formik.setFieldValue("familyMembers", updatedFamilyMembers);
  };

  const removeFamilyMember = (index) => {
    const updatedFamilyMembers = [...formik.values.familyMembers];
    updatedFamilyMembers.splice(index, 1);

    // Update formik state
    formik.setFieldValue("familyMembers", updatedFamilyMembers);
  };

  return (
    <>
      <div className={classes.container}>
        <Container className="containerFluid">
          {isMobile ? (
            <MobileHeader
              icon={
                <Image
                  src={"/svg/user.svg"}
                  height={15}
                  width={12}
                  alt="user icon"
                />
              }
              title={t("personalProfile.title")}
              showBack
            />
          ) : (
            <TopHeader
              icon={
                <Image
                  src={"/svg/user.svg"}
                  height={15}
                  width={12}
                  alt="user icon"
                />
              }
              title={t("personalProfile.title")}
            />
          )}
          <div className={classes.card}>
            <HeaderCard
              width={isMobile}
              title={t("personalProfile.welcomeTitle")}
              description={t("personalProfile.welcomeDescription")}
            />
          </div>

          <Button
            customStyle={{
              maxWidth: isMobile ? "100%" : "fit-content",
              marginBlock: "0 20px",
              marginInlineStart: "auto",
            }}
            variant={"primary"}
            label={t("personalProfile.viewIncident")}
            className={classes.openCameraBtn}
            onClick={() => router.push("profile-settings/my-incident-reports")}
          />
          {loading === "submitting" ? (
            <SpinnerLoading />
          ) : (
            <div className={classes.main}>
              {/* General Information */}
              <div className={classes.top}>
                <div className={classes.left}>
                  {loading === "uploading" ? (
                    <div className={classes.uploadPhotoLoading}>
                      <SpinnerLoading />
                    </div>
                  ) : (
                    <UploadPhoto
                      photo={formik.values.photo}
                      setPhoto={(photo) => UploadPhotoHandler(photo)}
                      mainClass={classes.uploadPhotoMain}
                      title={user?.fullName?.[locale]}
                      disabled={loading === "submitting" || !isEdit}
                    />
                  )}
                </div>

                <div className={classes.right}>
                  <div className={classes.generalInfo}>
                    <h2 className={classes.sectionTitle}>
                      {t("personalProfile.preferredLanguage")}
                    </h2>
                    <DropDown
                      placeholder={t("personalProfile.selectLanguage")}
                      value={selectedLanguage}
                      setValue={(val) => setSelectedLanguage(val)}
                      options={langOptions}
                      dropDownContainerClass={classes.dropdownInp}
                      disabled={loading === "submitting" || !isEdit}
                      error={
                        formik.touched.generalInformation?.language &&
                        formik.errors.generalInformation?.language
                      }
                    />
                    <h2 className={classes.sectionTitle}>
                      {t("personalProfile.generalInformation")}
                    </h2>
                    <div className={classes.generalInfoForm}>
                      <Input
                        label={t("form.labels.fullName")}
                        value={
                          formik.values?.generalInformation.fullName?.[locale]
                        }
                        setValue={(val) =>
                          formik.setFieldValue(
                            `generalInformation.fullName.${locale}`,
                            val
                          )
                        }
                        errorText={
                          formik.touched.generalInformation?.fullName &&
                          formik.errors.generalInformation?.fullName
                        }
                        disabled={loading === "submitting" || !isEdit}
                      />
                      <Input
                        inputContainerClass={classes.inpContainer}
                        label={t("form.labels.email")}
                        placeholder={t("form.placeholders.email")}
                        value={formik.values.generalInformation.email}
                        onChange={formik.handleChange}
                        name="generalInformation.email"
                        errorText={
                          formik.touched.generalInformation?.email &&
                          formik.errors.generalInformation?.email
                        }
                        disabled={true}
                      />
                      <Input
                        inputContainerClass={classes.inpContainer}
                        label={t("form.labels.residentIdNumber")}
                        placeholder={t("form.placeholders.residentIdNumber")}
                        value={
                          formik.values.generalInformation.residentIdNumber
                        }
                        onChange={formik.handleChange}
                        name="generalInformation.residentIdNumber"
                        errorText={
                          formik.touched.generalInformation?.residentIdNumber &&
                          formik.errors.generalInformation?.residentIdNumber
                        }
                        disabled={true}
                      />

                      <Input
                        inputContainerClass={classes.inpContainer}
                        label={t("form.labels.houseNumber")}
                        placeholder={t("form.placeholders.houseNumber")}
                        value={formik.values.generalInformation.houseNumber}
                        onChange={formik.handleChange}
                        name="generalInformation.houseNumber"
                        errorText={
                          formik.touched.generalInformation?.houseNumber &&
                          formik.errors.generalInformation?.houseNumber
                        }
                        disabled={true}
                      />
                      <Input
                        type="date"
                        inputContainerClass={classes.inpContainer}
                        label={t("form.labels.dob")}
                        placeholder={t("form.placeholders.dobPlaceholder")}
                        setValue={(val) =>
                          formik.setFieldValue("generalInformation.dob", val)
                        }
                        max={moment().format("YYYY-MM-DD")}
                        value={
                          formik.values.generalInformation.dob
                            ? moment(
                                formik.values.generalInformation.dob
                              ).format("YYYY-MM-DD")
                            : ""
                        }
                        className={classes.dateInput}
                        name="generalInformation.dob"
                        errorText={
                          formik.touched.generalInformation?.dob &&
                          formik.errors.generalInformation?.dob
                        }
                        disabled={loading === "submitting" || !isEdit}
                        rightIcon={
                          <IoCalendarOutline color="var(--primary)" size={18} />
                        }
                        rightIconClass={classes.calendarIcon}
                      />

                      <PhoneInput
                        className={classes.phoneInput}
                        label={t("form.labels.phoneNumber")}
                        placeholder={t("form.placeholders.phoneNumber")}
                        value={formik.values.generalInformation.phoneNumber}
                        setValue={(val) =>
                          formik.setFieldValue(
                            "generalInformation.phoneNumber",
                            val || "+44"
                          )
                        }
                        errorText={
                          formik.touched.generalInformation?.phoneNumber &&
                          formik.errors.generalInformation?.phoneNumber
                        }
                        onCountryChange={(code) => {
                          formik.setFieldValue(
                            "generalInformation.callingCode",
                            code
                          );
                        }}
                        disabled={loading === "submitting" || !isEdit}
                      />
                      <DropDown
                        label={t("form.labels.gender")}
                        placeholder={t("form.placeholders.gender")}
                        options={genderOptions}
                        value={formik.values.generalInformation.gender}
                        setValue={(val) =>
                          formik.setFieldValue("generalInformation.gender", val)
                        }
                        dropDownContainerClass={classes.dropdownInp}
                        disabled={loading === "submitting" || !isEdit}
                        error={
                          formik.touched.generalInformation?.gender &&
                          formik.errors.generalInformation?.gender
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Members Section */}
              <div className={classes.bottom}>
                <div className={classes.addFamilyMembers}>
                  <div className={classes.addFamilyMemberHeader}>
                    <h2 className={classes.sectionTitle}>
                      {t("personalProfile.familyMembers")}
                    </h2>
                    <div
                      className={`${classes.addIcon} ${
                        !isEdit ? classes.disabledIcon : ""
                      }`}
                      onClick={isEdit ? handleAddFamilyMember : undefined}
                      style={{
                        cursor: isEdit ? "pointer" : "not-allowed",
                        opacity: isEdit ? 1 : 0.5,
                      }}
                    >
                      <HiPlus size={16} color="#fff" />
                    </div>
                  </div>

                  {formik.values.familyMembers.map((familyMember, index) => (
                    <Fragment key={index}>
                      <p className={classes.familyMemberLabel}>
                        Family Member: {index + 1}
                        <BiTrash
                          className={`c-p ${
                            !isEdit ? classes.trashDisabledIcon : ""
                          }`}
                          onClick={
                            isEdit ? () => removeFamilyMember(index) : undefined
                          }
                          color={"#FF0000"}
                          size={20}
                        />
                      </p>
                      <div key={index} className={classes.familyMembersInputs}>
                        <Input
                          dir={dir}
                          label={t("form.labels.familyMemberFullName")}
                          placeholder={t(
                            "form.placeholders.familyMemberFullName"
                          )}
                          value={familyMember?.fullName?.[activeLanguage] || ""}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].fullName.${activeLanguage}`,
                              val
                            )
                          }
                          errorText={
                            formik.touched.familyMembers?.[index]?.fullName?.[
                              activeLanguage
                            ] &&
                            formik.errors.familyMembers?.[index]?.fullName?.[
                              activeLanguage
                            ]
                          }
                          disabled={loading === "submitting" || !isEdit}
                          type="text"
                        />
                        {/* add trc number input */}

                        {/* <Input
                          dir={dir}
                          label={t("form.labels.familyMemberFullName")}
                          placeholder={t(
                            "form.placeholders.familyMemberFullName"
                          )}
                          value={familyMember?.fullName?.[activeLanguage] || ""}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].fullName.${activeLanguage}`,
                              val
                            )
                          }
                          errorText={
                            formik.touched.familyMembers?.[index]?.fullName?.[
                              activeLanguage
                            ] &&
                            formik.errors.familyMembers?.[index]?.fullName?.[
                              activeLanguage
                            ]
                          }
                          disabled={loading === "submitting" || !isEdit}
                          type="text"
                        /> */}
                        {/* add trc number input */}
                        <Input
                          dir={dir}
                          label={t("form.labels.trcNumber")}
                          placeholder={t("form.placeholders.trcNumber")}
                          value={familyMember?.trcNumber || ""}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].trcNumber`,
                              val
                            )
                          }
                          errorText={
                            formik.touched.familyMembers?.[index]?.trcNumber &&
                            formik.errors.familyMembers?.[index]?.trcNumber
                          }
                          disabled={loading === "submitting" || !isEdit}
                          type="text"
                        />
                        <DropDown
                          dir={dir}
                          label={t("form.labels.relationship")}
                          placeholder={t("form.placeholders.relationship")}
                          options={relationshipOptions}
                          dropDownContainerClass={
                            classes.dropDownContainerClass
                          }
                          value={familyMember?.relationship || ""}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].relationship`,
                              val
                            )
                          }
                          error={
                            formik.touched.familyMembers?.[index]
                              ?.relationship &&
                            formik.errors.familyMembers?.[index]?.relationship
                          }
                          disabled={loading === "submitting" || !isEdit}
                        />
                        {familyMember?.relationship?.value === "children" && (
                          <>
                            <DropDown
                              dir={dir}
                              label={t("form.labels.schoolPlacement")}
                              placeholder={t(
                                "form.placeholders.schoolPlacement"
                              )}
                              options={schoolPlacementOptions}
                              dropDownContainerClass={
                                classes.dropDownContainerClass
                              }
                              value={familyMember?.schoolPlacement || ""}
                              setValue={(val) =>
                                formik.setFieldValue(
                                  `familyMembers[${index}].schoolPlacement`,
                                  val
                                )
                              }
                              disabled={loading === "submitting" || !isEdit}
                              error={
                                formik.touched.familyMembers?.[index]
                                  ?.schoolPlacement &&
                                formik.errors.familyMembers?.[index]
                                  ?.schoolPlacement
                              }
                            />
                            {familyMember?.schoolPlacement?.value ===
                              "placed" && (
                              <>
                                <Input
                                  dir={dir}
                                  label={t("form.labels.schoolName")}
                                  placeholder={t(
                                    "form.placeholders.schoolName"
                                  )}
                                  value={
                                    familyMember?.schoolName?.[
                                      activeLanguage
                                    ] || ""
                                  }
                                  setValue={(val) =>
                                    formik.setFieldValue(
                                      `familyMembers[${index}].schoolName.${activeLanguage}`,
                                      val
                                    )
                                  }
                                  errorText={
                                    formik.touched.familyMembers?.[index]
                                      ?.schoolName?.[activeLanguage] &&
                                    formik.errors.familyMembers?.[index]
                                      ?.schoolName?.[activeLanguage]
                                  }
                                  disabled={loading === "submitting" || !isEdit}
                                  type="text"
                                />
                                <Input
                                  dir={dir}
                                  label={t("form.labels.year")}
                                  placeholder={t("form.placeholders.year")}
                                  value={familyMember?.year || ""}
                                  setValue={(val) =>
                                    formik.setFieldValue(
                                      `familyMembers[${index}].year`,
                                      val
                                    )
                                  }
                                  errorText={
                                    formik.touched.familyMembers?.[index]
                                      ?.year &&
                                    formik.errors.familyMembers?.[index]?.year
                                  }
                                  disabled={loading === "submitting" || !isEdit}
                                  type="text"
                                />
                                <DropDown
                                  dir={dir}
                                  label={t("form.labels.transportType")}
                                  placeholder={t(
                                    "form.placeholders.transportType"
                                  )}
                                  options={transportTypeOptions}
                                  dropDownContainerClass={
                                    classes.dropDownContainerClass
                                  }
                                  value={familyMember?.transportType || ""}
                                  setValue={(val) =>
                                    formik.setFieldValue(
                                      `familyMembers[${index}].transportType`,
                                      val
                                    )
                                  }
                                  error={
                                    formik.touched.familyMembers?.[index]
                                      ?.transportType &&
                                    formik.errors.familyMembers?.[index]
                                      ?.transportType
                                  }
                                  disabled={loading === "submitting" || !isEdit}
                                />
                                <div className={classes.booksContainer}>
                                  <div className={classes.booksLabelContainer}>
                                    <label>{t("form.labels.books")}</label>
                                    <div
                                      className={`${classes.addBookIcon} ${
                                        !isEdit ? classes.disabledIcon : ""
                                      }`}
                                      onClick={
                                        isEdit
                                          ? () => {
                                              const updatedBooks = [
                                                ...familyMember.books,
                                                "",
                                              ];
                                              formik.setFieldValue(
                                                `familyMembers[${index}].books`,
                                                updatedBooks
                                              );
                                            }
                                          : undefined
                                      }
                                      style={{
                                        cursor: isEdit
                                          ? "pointer"
                                          : "not-allowed",
                                        opacity: isEdit ? 1 : 0.5,
                                      }}
                                    >
                                      <IoAddOutline size={18} />
                                    </div>
                                  </div>
                                  {familyMember?.books?.map(
                                    (book, bookIndex) => (
                                      <div
                                        key={bookIndex}
                                        className={classes.bookInputContainer}
                                      >
                                        <Input
                                          dir={dir}
                                          placeholder={t(
                                            "form.placeholders.books"
                                          )}
                                          value={book}
                                          setValue={(val) =>
                                            formik.setFieldValue(
                                              `familyMembers[${index}].books[${bookIndex}]`,
                                              val
                                            )
                                          }
                                          errorText={
                                            formik.touched.familyMembers?.[
                                              index
                                            ]?.books &&
                                            formik.errors.familyMembers?.[index]
                                              ?.books
                                          }
                                          disabled={
                                            loading === "submitting" || !isEdit
                                          }
                                          type="text"
                                        />
                                        {familyMember.books.length > 1 && (
                                          <div
                                            className={`${
                                              classes.removeBookIcon
                                            } ${
                                              !isEdit
                                                ? classes.disabledIcon
                                                : ""
                                            }`}
                                            onClick={
                                              isEdit
                                                ? () => {
                                                    const updatedBooks =
                                                      familyMember.books.filter(
                                                        (_, i) =>
                                                          i !== bookIndex
                                                      );
                                                    formik.setFieldValue(
                                                      `familyMembers[${index}].books`,
                                                      updatedBooks
                                                    );
                                                  }
                                                : undefined
                                            }
                                            style={{
                                              cursor: isEdit
                                                ? "pointer"
                                                : "not-allowed",
                                              opacity: isEdit ? 1 : 0.5,
                                            }}
                                          >
                                            <BiTrash size={18} />
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        )}
                        <DropDown
                          dir={dir}
                          label={t("form.labels.gender")}
                          placeholder={t("form.placeholders.gender")}
                          options={genderOptions}
                          dropDownContainerClass={
                            classes.dropDownContainerClass
                          }
                          value={familyMember?.gender || ""}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].gender`,
                              val
                            )
                          }
                          disabled={loading === "submitting" || !isEdit}
                          error={
                            formik.touched.familyMembers?.[index]?.gender &&
                            formik.errors.familyMembers?.[index]?.gender
                          }
                        />
                        <Input
                          dir={dir}
                          label={t("form.labels.dob")}
                          placeholder={t("form.placeholders.dobPlaceholder")}
                          type="date"
                          value={familyMember?.dob}
                          setValue={(val) =>
                            formik.setFieldValue(
                              `familyMembers[${index}].dob`,
                              val
                            )
                          }
                          max={moment().format("YYYY-MM-DD")}
                          errorText={
                            formik.touched.familyMembers?.[index]?.dob &&
                            formik.errors.familyMembers?.[index]?.dob
                          }
                          disabled={loading === "submitting" || !isEdit}
                          className={classes.dateInput}
                          rightIconClass={classes.calendarIcon}
                          rightIcon={
                            <IoCalendarOutline
                              color="var(--primary)"
                              size={18}
                            />
                          }
                        />
                      </div>
                    </Fragment>
                  ))}

                  <div className={classes.saveChangesBtn}>
                    {isEdit ? (
                      <Button
                        variant="primary"
                        label={t("form.labels.saveChanges")}
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        showSpinner
                        className={classes.saveBtn}
                        onClick={() => formik.handleSubmit()}
                      />
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        label={t("form.labels.editProfile")}
                        className={classes.saveBtn}
                        onClick={() => setIsEdit(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
