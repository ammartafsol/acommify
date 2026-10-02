import StaffConfirmationTemplate from "@/components/Template/resident/StaffConfirmationTemplate/StaffConfirmationTemplate";

export default async function StaffBookingConfirmationPage({ params }) {
  const { bookingSlug } = await params;
  return <StaffConfirmationTemplate slug={bookingSlug} />;
}
