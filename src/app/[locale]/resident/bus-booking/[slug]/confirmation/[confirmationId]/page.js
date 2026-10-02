import BusBookingConfirmation from "@/components/Template/resident/BusBookingConfirmation";
import React from "react";

export default async function ConfirmationPage({ params }) {
  const { slug, confirmationId } = await params;
  return <BusBookingConfirmation slug={slug} confirmationId={confirmationId} />;
}
