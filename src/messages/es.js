// src/messages/es.js
import auth from "./auth/es.json";
import dashboard from "./residential/dashboard/es.json";
import appointmentPages from "./residential/appointmentPages/es.json";
import maintenance from "./residential/maintenance/es.json";
import settings from "./residential/settings/es.json";
import personalProfile from "./residential/personalProfile/es.json";
import upcomingMeetings from "./residential/upcomingMeetings/es.json";
import common from "./common/es.json";
import UpcomingEvents from "./residential/upcoming-events/es.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/es.json";
import foodStuffs from "./residential/foodStuffs/es.json";
import busBooking from "./residential/busBooking/es.json";
import cartOverview from "./residential/cart/es.json";
import checkoutProcess from "./residential/checkout/es.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/es.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/es.json";
import visitors from "./residential/visitorBooking/es.json";
import designGuideline from "@/messages/residential/designGuideLine/es.json";
import notificationPage from "@/messages/residential/notification/es.json";
import allbooking from "@/messages/residential/allbooking/es.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/es.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/es.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/es.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/es.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/es.json";
import documentViewer from "@/messages/residential/documentViewer/es.json";
import favouritePage from "@/messages/residential/favouritePage/es.json";
import orders from "@/messages/residential/orders/es.json";
import changePassword from "@/messages/residential/changePassword/es.json";

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
