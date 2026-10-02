import { yupLanguageObjectOptional } from "@/i18n/routing";
import * as Yup from "yup";

export const personalProfileSchema = (t, locale) =>
  Yup.object({
    photo: Yup.string().optional().nullable(),
    generalInformation: Yup.object({
      fullName: Yup.object().shape({
        en: Yup.string().required(
          t("form.errors.required", { field: "Full Name" })
        ),
        ar: Yup.string(),
        uk: Yup.string(),
      }),
      dob: Yup.string()
        .required(t("form.errors.required", { field: "DOB" }))
        .test(
          "age-at-least-18",
          t("familyMemberErrors.ageAtLeast18"),
          (dob) => {
            const today = new Date();
            const birthDate = new Date(dob);
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 18;
          }
        ),

      residentIdNumber: Yup.string().required(
        t("form.errors.required", { field: "Resident ID Number" })
      ),
      houseNumber: Yup.string().required(
        t("form.errors.required", { field: "House Number" })
      ),
      phoneNumber: Yup.string().required(
        t("form.errors.required", { field: "Phone Number" })
      ),
      callingCode: Yup.string().required(
        t("form.errors.required", { field: "Country Code" })
      ),
      gender: Yup.object().required(
        t("form.errors.required", { field: "Gender" })
      ),
      email: Yup.string()
        .email(t("form.errors.invalid", { field: "Email Address" }))
        .required(t("form.errors.required", { field: "Email Address" })),
    }),

    familyMembers: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.object().shape(
          yupLanguageObjectOptional({
            fieldName: "Full name",
            selectedLocale: locale,
            translation: t("fullName.required", { locale: locale }),
          })
        ),
        relationship: Yup.object().required(
          t("familyMemberErrors.relationshipRequired")
        ),
        trcNumber: Yup.string().required(
          t("familyMemberErrors.trcNumberRequired")
        ),
        dob: Yup.string().required(t("familyMemberErrors.dobRequired")),

        // .test(
        //   "not-future-date",
        //   t("familyMemberErrors.ageAtLeast18"),
        //   function (value) {
        //     if (!value) return true; // Let required handle empty values
        //     const selectedDate = new Date(value);
        //     const today = new Date();
        //     today.setHours(0, 0, 0, 0); // Reset time to compare dates only
        //     selectedDate.setHours(0, 0, 0, 0);
        //     return selectedDate <= today;
        //   }
        // ),

        gender: Yup.object().required(t("familyMemberErrors.genderRequired")),
        schoolPlacement: Yup.object().when("relationship", {
          is: (relationship) => relationship?.value === "children",
          then: (schema) =>
            schema.required(t("familyMemberErrors.schoolPlacementRequired")),
          otherwise: (schema) => schema.notRequired(),
        }),
        schoolName: Yup.object().when(["relationship", "schoolPlacement"], {
          is: (relationship, schoolPlacement) => {
            return (
              relationship?.value === "children" &&
              schoolPlacement?.value === "placed"
            );
          },
          then: (schema) =>
            schema.shape(
              yupLanguageObjectOptional({
                fieldName: "School name",
                selectedLocale: locale,
                translation: t("schoolName.required", { locale: locale }),
              })
            ),
          otherwise: (schema) => schema.notRequired(),
        }),
        year: Yup.string().when(["relationship", "schoolPlacement"], {
          is: (relationship, schoolPlacement) => {
            return (
              relationship?.value === "children" &&
              schoolPlacement?.value === "placed"
            );
          },
          then: (schema) =>
            schema.required(t("familyMemberErrors.yearRequired")),
          otherwise: (schema) => schema.notRequired(),
        }),
        transportType: Yup.object().when(["relationship", "schoolPlacement"], {
          is: (relationship, schoolPlacement) => {
            return (
              relationship?.value === "children" &&
              schoolPlacement?.value === "placed"
            );
          },
          then: (schema) =>
            schema.required(t("familyMemberErrors.transportTypeRequired")),
          otherwise: (schema) => schema.notRequired(),
        }),
        books: Yup.array().when(["relationship", "schoolPlacement"], {
          is: (relationship, schoolPlacement) => {
            return (
              relationship?.value === "children" &&
              schoolPlacement?.value === "placed"
            );
          },
          then: (schema) =>
            schema
              .of(Yup.string())
              .test(
                "at-least-one-book",
                t("familyMemberErrors.booksMinRequired"),
                (books) => {
                  if (!books || books.length === 0) return false;
                  return books.some((book) => book && book.trim() !== "");
                }
              ),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    ),
  });
