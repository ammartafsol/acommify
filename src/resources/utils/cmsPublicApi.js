import { getApi } from "@/interceptor/server-side-getApi";

export const SLUG_TO_PAGE_NAME = {
  "terms-and-conditions": "termsAndConditionsPage",
  "privacy-policy": "privacyPolicyPage",
  "data-processing-agreement": "dataProcessingAgreementPage",
  "cookie-policy": "cookiePolicyPage",
  "accessibility-statement": "accessibilityStatementPage",
};

export const LEGAL_SLUGS = Object.keys(SLUG_TO_PAGE_NAME);

export const getLocalized = (field, locale) =>
  field?.[locale] || field?.en || "";

export const getPublicPage = async (pageName) => {
  if (!pageName) return null;
  const response = await getApi(`cms/public/page/${pageName}`);
  return response?.data ?? null;
};

export const getLegalLinks = async () => {
  const response = await getApi("cms/public/legal-links");
  return Array.isArray(response?.data) ? response.data : [];
};
