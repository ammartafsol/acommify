// src/messages/ar.js
import auth from "./auth/ar.json";
import dashboard from "./residential/dashboard/ar.json";
import appointmentPages from "./residential/appointmentPages/ar.json";
import maintenance from "./residential/maintenance/ar.json";
import settings from "./residential/settings/ar.json";
import personalProfile from "./residential/personalProfile/ar.json";
import upcomingMeetings from "./residential/upcomingMeetings/ar.json";
import common from "./common/ar.json";
import UpcomingEvents from "./residential/upcoming-events/ar.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/ar.json";
import foodStuffs from "./residential/foodStuffs/ar.json";
import busBooking from "./residential/busBooking/ar.json";
import cartOverview from "./residential/cart/ar.json";
import checkoutProcess from "./residential/checkout/ar.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/ar.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/ar.json";
import visitors from "./residential/visitorBooking/ar.json";
import designGuideline from "@/messages/residential/designGuideLine/ar.json";
import notificationPage from "@/messages/residential/notification/ar.json";
import allbooking from "@/messages/residential/allbooking/ar.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/ar.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/ar.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/ar.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/ar.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/ar.json";
import documentViewer from "@/messages/residential/documentViewer/ar.json";
import favouritePage from "@/messages/residential/favouritePage/ar.json";
import orders from "@/messages/residential/orders/ar.json";
import changePassword from "@/messages/residential/changePassword/ar.json";

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
