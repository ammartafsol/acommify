// src/messages/en.js
import auth from "./auth/en.json";
import dashboard from "./residential/dashboard/en.json";
import appointmentPages from "./residential/appointmentPages/en.json";
import maintenance from "./residential/maintenance/en.json";
import settings from "./residential/settings/en.json";
import personalProfile from "./residential/personalProfile/en.json";
import upcomingMeetings from "./residential/upcomingMeetings/en.json";
import common from "./common/en.json";
import UpcomingEvents from "./residential/upcoming-events/en.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/en.json";
import foodStuffs from "./residential/foodStuffs/en.json";
import busBooking from "./residential/busBooking/en.json";
import cartOverview from "./residential/cart/en.json";
import checkoutProcess from "./residential/checkout/en.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/en.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/en.json";
import visitors from "./residential/visitorBooking/en.json";
import designGuideline from "@/messages/residential/designGuideLine/en.json";
import notificationPage from "@/messages/residential/notification/en.json";
import allbooking from "@/messages/residential/allbooking/en.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/en.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/en.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/en.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/en.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/en.json";
import documentViewer from "@/messages/residential/documentViewer/en.json";
import favouritePage from "@/messages/residential/favouritePage/en.json";
import orders from "@/messages/residential/orders/en.json";
import changePassword from "@/messages/residential/changePassword/en.json";

export default {
  // Auth related
  ...auth,

  // Laundry Booking
  ...laundryBooking,

  // Dashboard
  ...dashboard,

  // Appointments Pages
  ...appointmentPages,

  // Maintenance
  ...maintenance,

  // Settings & Profile
  ...settings,

  // Food Stuffs
  ...foodStuffs,

  // Common components
  ...common,

  // Personal Profile
  ...personalProfile,

  // Upcoming Events
  ...UpcomingEvents,

  // Upcoming Meetings
  ...upcomingMeetings,

  // Laundry Booking Confirmation
  ...LaundryBookingConfirmation,

  // Upcoming Meetings
  ...upcomingMeetings,

  // Bus Booking
  ...busBooking,

  // Cart Overview
  ...cartOverview,

  // Checkout Process
  ...checkoutProcess,

  // accommodationGuide
  ...accommodationGuide,

  // Visitors
  ...visitors,

  // Design Guideline
  ...designGuideline,

  // notificationPage
  ...notificationPage,

  // allbooking
  ...allbooking,

  // signInOutRequest
  ...signInOutRequest,

  // myIncidentReports
  ...myIncidentReports,

  // privacyPolicy
  ...privacyPolicy,

  // visitorBookingConfirmation
  ...visitorBookingConfirmation,

  // staffBookingConfirmation
  ...staffBookingConfirmation,

  // documentViewer
  ...documentViewer,

  // favouritePage
  ...favouritePage,
  // orders
  ...orders,
  // changePassword
  ...changePassword,
};
