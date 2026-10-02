export const dynamic = "force-dynamic";

import React from "react";
import AccommodationGuide from "@/components/Template/resident/AccommodationGuide";
import { getApi } from "@/interceptor/server-side-getApi";

export default async function page() {
  const response = await getApi("cms/page/accommodationGuidePage");
  if (!response?.data) {
    return <>No Data</>;
  }
  return <AccommodationGuide data={response?.data} />;
}
