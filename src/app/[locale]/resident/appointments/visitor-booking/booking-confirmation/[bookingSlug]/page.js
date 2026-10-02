import VisitorConfirmationTemplate from "@/components/Template/resident/VisitorConfirmationTemplate/VisitorConfirmationTemplate";

export default async function VisitorConfirmationPage({ params }) {
  const { bookingSlug } = await params;
  return <VisitorConfirmationTemplate slug={bookingSlug} />;
}
