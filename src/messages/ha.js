// src/messages/ha.js
import auth from "./auth/ha.json";
import dashboard from "./residential/dashboard/ha.json";
import appointmentPages from "./residential/appointmentPages/ha.json";
import maintenance from "./residential/maintenance/ha.json";
import settings from "./residential/settings/ha.json";
import personalProfile from "./residential/personalProfile/ha.json";
import upcomingMeetings from "./residential/upcomingMeetings/ha.json";
import common from "./common/ha.json";
import UpcomingEvents from "./residential/upcoming-events/ha.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/ha.json";
import foodStuffs from "./residential/foodStuffs/ha.json";
import busBooking from "./residential/busBooking/ha.json";
import cartOverview from "./residential/cart/ha.json";
import checkoutProcess from "./residential/checkout/ha.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/ha.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/ha.json";
import visitors from "./residential/visitorBooking/ha.json";
import designGuideline from "@/messages/residential/designGuideLine/ha.json";
import notificationPage from "@/messages/residential/notification/ha.json";
import allbooking from "@/messages/residential/allbooking/ha.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/ha.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/ha.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/ha.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/ha.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/ha.json";
import documentViewer from "@/messages/residential/documentViewer/ha.json";
import orders from "@/messages/residential/orders/ha.json";
import changePassword from "@/messages/residential/changePassword/ha.json";

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
