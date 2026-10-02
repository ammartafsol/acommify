import SelectSeatTemplate from "@/components/Template/resident/SelectSeatTemplate/SelectSeatTemplate";
import React from "react";

export default async function SelectSeatPage({ params, searchParams }) {
  const { slug } = await params;
  const { date, booking } = await searchParams;
  return <SelectSeatTemplate slug={slug} bookingSlug={booking} date={date} />;
}
