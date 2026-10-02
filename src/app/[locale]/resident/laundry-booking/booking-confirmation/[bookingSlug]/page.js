import LaundryConfirmationTemplate from "@/components/Template/resident/LaundryConfirmationTemplate";

export default async function BookingConfirmationPage({ params }) {
  const { bookingSlug } = await params;
  return <LaundryConfirmationTemplate slug={bookingSlug} />;
}
