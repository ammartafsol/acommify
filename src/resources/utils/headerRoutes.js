export const headerData = (t) => [
  {
    label: t("dashboard"),
    route: "/resident",
    icon: "/svg/dashboardIcon.svg",
  },
  {
    label: t("appointments"),
    route: "/resident/appointments",
    icon: "/svg/appointmentIcon.svg",
  },
  {
    label: t("requests"),
    route: "/resident/maintenance-requests",
    icon: "/svg/maintenanceRequest.svg",
  },
  // {
  //   label: t("allBookings"),
  //   route: "/resident/all-bookings",
  //   icon: "/svg/maintenanceRequest.svg",
  // },
  {
    label: t("accommodationGuide"),
    route: "/resident/accomodation-guide",
    icon: "/svg/RequestIcon.svg",
  },
  {
    label: t("foodStuffs"),
    route: "/resident/food-stuffs",
    icon: "/svg/foodIcon.svg",
  },
];

export const headerDataMobile = (t) => [
  {
    label: t("dashboard"),
    route: "/resident",
    icon: "/svg/dashboardIcon.svg",
  },
  {
    label: t("appointments"),
    route: "/resident/appointments",
    icon: "/svg/appointmentIcon.svg",
  },
  {
    label: t("requests"),
    route: "/resident//maintenance-requests",
    icon: "/svg/maintenanceRequest.svg",
  },
  {
    label: t("accommodationGuide"),
    route: "/resident/accomodation-guide",
    icon: "/svg/RequestIcon.svg",
  },

  {
    label: t("foodStuffs"),
    route: "/resident/food-stuffs",
    icon: "/svg/foodIcon.svg",
  },
  {
    label: t("notification"),
    route: "/resident/notifications",
    icon: "/svg/notificationHeader.svg",
  },
  {
    label: t("settings"),
    route: "/resident/settings",
    icon: "/svg/settingHeader.svg",
  },
];

export const footerDataMobile = [
  {
    route: "/resident",
    icon: "/svg/footerHome.svg",
  },
  {
    route: "/resident/profile-settings",
    icon: "/svg/footerUser.svg",
  },
  {
    route: "/resident/settings",
    icon: "/svg/footerSettings.svg",
  },
  {
    route: "/resident/all-bookings",
    icon: "/svg/footerCalender.svg",
  },
];
