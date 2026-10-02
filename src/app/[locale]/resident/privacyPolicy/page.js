import PrivacyPolicyTemplate from "@/components/Template/resident/PrivacyPolicyTemplate";
import { getApi } from "@/interceptor/server-side-getApi";
import React from "react";
export const dynamic = "force-dynamic";

export default async function page() {
  const response = await getApi("cms/page/privacyPolicyPage");
  return <PrivacyPolicyTemplate data={response?.data} />;
}
