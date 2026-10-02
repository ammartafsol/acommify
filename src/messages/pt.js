// src/messages/pt.js
import auth from "./auth/pt.json";
import dashboard from "./residential/dashboard/pt.json";
import appointmentPages from "./residential/appointmentPages/pt.json";
import maintenance from "./residential/maintenance/pt.json";
import settings from "./residential/settings/pt.json";
import personalProfile from "./residential/personalProfile/pt.json";
import upcomingMeetings from "./residential/upcomingMeetings/pt.json";
import common from "./common/pt.json";
import UpcomingEvents from "./residential/upcoming-events/pt.json";
import LaundryBookingConfirmation from "./residential/laundryBookingConfirmation/pt.json";
import foodStuffs from "./residential/foodStuffs/pt.json";
import busBooking from "./residential/busBooking/pt.json";
import cartOverview from "./residential/cart/pt.json";
import checkoutProcess from "./residential/checkout/pt.json";
import accommodationGuide from "@/messages/residential/accommodationGuide/pt.json";
import laundryBooking from "@/messages/residential/laundryBookingSystem/pt.json";
import visitors from "./residential/visitorBooking/pt.json";
import designGuideline from "@/messages/residential/designGuideLine/pt.json";
import notificationPage from "@/messages/residential/notification/pt.json";
import allbooking from "@/messages/residential/allbooking/pt.json";
import signInOutRequest from "@/messages/residential/signInOutRequests/pt.json";
import myIncidentReports from "@/messages/residential/myIncidentReports/pt.json";
import privacyPolicy from "@/messages/residential/privacyPolicy/pt.json";
import visitorBookingConfirmation from "@/messages/residential/visitorBookingConfirmation/pt.json";
import staffBookingConfirmation from "@/messages/residential/staffBookingConfirmation/pt.json";
import documentViewer from "@/messages/residential/documentViewer/pt.json";
import favouritePage from "@/messages/residential/favouritePage/pt.json";
import orders from "@/messages/residential/orders/pt.json";
import changePassword from "@/messages/residential/changePassword/pt.json";

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
