import MaintenanceRequestDetail from "@/components/Template/resident/MaintenanceRequestDetail";

export default async function MaintenanceRequestDetailPage({ params }) {
  const { slug } = await params;
  return <MaintenanceRequestDetail slug={slug} />;
}
