import OrderDetail from "@/components/Template/resident/OrderDetail/OrderDetail";
import React from "react";

export default async function OrderDetailPage({ params }) {
  const slug = (await params)?.slug;
  return <OrderDetail slug={slug} />;
}
