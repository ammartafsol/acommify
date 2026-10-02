// src/messages/ps.js
import auth from "./auth/ps.json";
import dashboard from "./residential/dashboard/ps.json";
import appointmentPages from "./residential/appointmentPages/ps.json";
import maintenance from "./residential/maintenance/ps.json";
import settings from "./residential/settings/ps.json";
import personalProfile from "./residential/personalProfile/ps.json";
import upcomingMeetings from "./residential/upcomingMeetings/ps.json";
import common from "./common/ps.json";
import UpcomingEvents from "./residential/upcoming-events/ps.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/ps.json";
import foodStuffs from "./residential/foodStuffs/ps.json";
import busBooking from "./residential/busBooking/ps.json";
import cartOverview from "./residential/cart/ps.json";
import checkoutProcess from "./residential/checkout/ps.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/ps.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/ps.json";
import visitors from "./residential/visitorBooking/ps.json";
import designGuideline from "@/messages/residential/designGuideLine/ps.json";
import notificationPage from "@/messages/residential/notification/ps.json";
import allbooking from "@/messages/residential/allbooking/ps.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/ps.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/ps.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/ps.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/ps.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/ps.json";
import documentViewer from "@/messages/residential/documentViewer/ps.json";
import favouritePage from "@/messages/residential/favouritePage/ps.json";
import orders from "@/messages/residential/orders/ps.json";
import changePassword from "@/messages/residential/changePassword/ps.json";

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
