import RenderStatusCell, {
  RenderDateTimeCell,
} from "@/components/organisms/AppTable/tableHelper";
export const OrderDetailTableHeader = (t) => [
  {
    key: "index",
    title: "#",
    style: { width: "5%" },
  },
  {
    key: "productName",
    title: t("orderDetailsHeader.product"),
    style: { width: "20%" },
  },
  {
    key: "categoryName",
    title: t("orderDetailsHeader.category"),
    style: { width: "15%" },
  },

  {
    key: "shippingOption",
    title: t("orderDetailsHeader.shippingType"),
    style: { width: "15%" },
    renderItem: ({ item }) => (
      <RenderStatusCell status={`${item}`.replace(/-/g, " & ")} />
    ),
  },
  {
    key: "quantity",
    title: t("orderDetailsHeader.quantity"),
    style: { width: "10%" },
  },
  {
    key: "totalPoints",
    title: t("orderDetailsHeader.totalPoints"),
    style: { width: "10%" },
  },
  {
    key: "status",
    title: t("orderDetailsHeader.status"),
    style: { width: "15%" },
    renderItem: ({ item }) => <RenderStatusCell status={item} />,
  },
];
export function maintenanceRequestsTableHeader(t, locale, selectedTab = null) {
  const headers = [
    // {
    //   key: "appointmentType",
    //   title: "Appointment Type",
    //   styles: { width: "18%" },
    // },
    // { key: "user", title: "Person Name", styles: { width: "20%" } },
    { key: "description", title: t("table.purpose"), styles: { width: "15%" } },
    {
      key: "category",
      title: t("table.category"),
      styles: { width: "15%" },
      renderItem: ({ data }) => data?.category?.name?.[locale] || "NA",
    },
    {
      key: "createdAt",
      title: t("table.dateTime"),
      styles: { width: "15%" },
      renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
    },

    {
      key: "status",
      title: t("table.status"),
      styles: { width: "12%" },
      renderItem: ({ item }) => <RenderStatusCell status={item} />,
    },
    {
      key: "comment",
      title: t("table.comment"),
      styles: { width: "20%" },
      renderItem: ({ data }) => data?.comment || "-",
    },
  ];

  const shouldShowResolvedBy =
    selectedTab?.value === "all" || selectedTab?.value === "completed";

  if (shouldShowResolvedBy) {
    headers.push({
      key: "assignedTo",
      title: t("table.resolvedBy"),
      styles: { width: "13%" },
      renderItem: ({ data }) =>
        data?.status === "completed"
          ? data?.assignedTo?.fullName?.[locale]
          : "-",
    });
  }

  return headers;
}

export function signInOutRequestsTableHeader(t) {
  return [
    {
      key: "accommodation",
      title: t("tableHeaders.accommodation"),
      style: { width: "33%" },
      renderItem: ({ data }) => data?.accommodation?.accommodationNumber || "-",
    },
    {
      key: "checkIn",
      title: t("tableHeaders.checkIn"),
      style: { width: "33%" },
      renderItem: ({ item }) =>
        item ? <RenderDateTimeCell dateTime={item} /> : "-",
    },
    {
      key: "checkOut",
      title: t("tableHeaders.checkOut"),
      style: { width: "33%" },
      renderItem: ({ item }) =>
        item ? (
          <RenderDateTimeCell dateTime={item} />
        ) : (
          <span style={{ color: "var( --Dark-blue)" }}>
            {t("tableHeaders.currentlyCheckedIn")}
          </span>
        ),
    },
  ];
}

export function myIncidentReportsTableHeader(t, locale) {
  return [
    {
      key: "incidentId",
      title: t("tableHeaders.incidentId"),
      style: { width: "8%" },
    },
    {
      key: "title",
      title: t("tableHeaders.title"),
      style: { width: "14%" },
      renderItem: ({ data }) => data?.title?.[locale] || "NA",
    },
    {
      key: "description",
      title: t("tableHeaders.description"),
      style: { width: "30%" },
      renderItem: ({ data }) => data?.description?.[locale] || "NA",
    },
    {
      key: "severity",
      title: t("tableHeaders.severity"),
      style: { width: "8%" },
    },
    {
      key: "createdAt",
      title: t("tableHeaders.dateTime"),
      style: { width: "16%" },
      renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
    },
    {
      key: "status",
      title: t("tableHeaders.status"),
      style: { width: "10%" },
      renderItem: ({ item }) => <RenderStatusCell status={item} />,
    },
    {
      key: "completedDate",
      title: t("tableHeaders.completedDate"),
      style: { width: "14%" },
      renderItem: ({ data }) =>
        data?.completedDate && data?.status === "resolved" ? (
          <RenderDateTimeCell dateTime={data?.completedDate} />
        ) : (
          "-"
        ),
    },
  ];
}

export function appointmentsTableHeader(t, locale) {
  return [
    { key: "description", title: t("table.purpose"), styles: { width: "20%" } },
    {
      key: "category",
      title: t("table.category"),
      styles: { width: "18%" },
    },
    {
      key: "createdAt",
      title: t("table.dateTime"),
      styles: { width: "20%" },
      renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
    },

    {
      key: "status",
      title: t("table.status"),
      styles: { width: "20%" },
      renderItem: ({ item }) => <RenderStatusCell status={item} />,
    },
  ];
}

export function ordersTableHeader(t) {
  return [
    {
      key: "orderId",
      title: t("table.orderID"),
      style: { width: "25%" },
      renderItem: ({ item }) => <span>#{item}</span>,
    },
    {
      key: "totalPoints",
      title: t("table.totalPoints"),
      style: { width: "25%" },
    },
    {
      key: "status",
      title: t("table.status"),
      style: { width: "25%" },
      renderItem: ({ item }) => <RenderStatusCell status={item} />,
    },
    {
      key: "createdAt",
      title: t("table.orderDate"),
      style: { width: "25%" },
      renderItem: ({ item }) => <RenderDateTimeCell dateTime={item} />,
    },

    // { key: "location", title: "Location", styles: { width: "14%" } },
  ];
}
