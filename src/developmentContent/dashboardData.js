// export const activitiesData = (t) => [
//   {
//     id: 1,
//     // label: "laundry",
//     label: {
//       "en": "laundry",
//       "en-GB": "GP Consultation",
//       es: "Consulta Médica",
//       fr: "Consultation Médicale",
//     },
//     heading: t("activities.activitiesCards.laundrybooking"),
//     icon: "/dev-images/laundryIcon.svg",
//     time: "October 24 , 2:00 PM",
//   },
//   {
//     id: 2,
//     label: {
//       "en": "Bus",
//       "en-GB": "GP Consultation",
//       es: "Consulta Médica",
//       fr: "Consultation Médicale",
//     },
//     heading: t("activities.activitiesCards.BusRide"),
//     icon: "/dev-images/busIcon.svg",
//     time: "October 24 , 2:00 PM",
//   },
//   {
//     id: 3,
//     label: {
//       "en": "Appointment",
//       "en-GB": "GP Consultation",
//       es: "Consulta Médica",
//       fr: "Consultation Médicale",
//     },
//     heading: t("activities.activitiesCards.scheduleAppointmentAt"),
//     icon: "/dev-images/appointmentIcon.svg",
//     time: "October 25 , 2:00 PM",
//   },
//   {
//     id: 4,
//     label: {
//       "en": "Visitors",
//       "en-GB": "GP Consultation",
//       es: "Consulta Médica",
//       fr: "Consultation Médicale",
//     },
//     heading: t("activities.activitiesCards.VisitorSlotBooked"),
//     icon: "/dev-images/visitorsIcon.svg",
//     time: "October 24 , 2:00 PM",
//   },
// ];

export const notifications = [
  {
    id: 1,
    icon: "/svg/yellowInfo.svg",
    title: {
      en: "Your bus departs at 10:00 AM.",
      es: "Su autobús sale a las 10:00 AM.",
      fr: "Votre bus part à 10h00.",
    },
    description: {
      en: "Please be ready at the pickup point in 30 minutes.",
      es: "Por favor, esté listo en el punto de recogida en 30 minutos.",
      fr: "Veuillez être prêt au point de ramassage dans 30 minutes.",
    },
    type: "info",
    showButton: false,
  },
  {
    id: 2,
    icon: "/svg/successnotification.svg",
    title: {
      en: "Your booking was successful.",
      es: "Su reserva se realizó con éxito.",
      fr: "Votre réservation a été confirmée avec succès.",
    },

    type: "info",
    showButton: false,
  },
  {
    id: 3,
    icon: "/svg/yellowInfo.svg",
    title: {
      en: "Your bus departs at 10:00 AM.",
      es: "Su autobús sale a las 10:00 AM.",
      fr: "Votre bus part à 10h00.",
    },
    description: {
      en: "Please be ready at the pickup point in 30 minutes.",
      es: "Por favor, esté listo en el punto de recogida en 30 minutos.",
      fr: "Veuillez être prêt au point de ramassage dans 30 minutes.",
    },
    type: "success",
    showButton: false,
  },
  {
    id: 4,
    icon: "/svg/redInfo.svg",
    title: {
      en: "Your bus is running 30 minutes behind schedule.",
      es: "Tu cita es mañana a las 11:00 AM.",
      fr: "Votre rendez-vous est demain à 11h00.",
    },
    description: {
      en: "You can choose another bus or continue this trip. Thank you for your patience!",
      es: "Puede elegir otro autobús o continuar con este viaje. ¡Gracias por su paciencia!",
      fr: "Vous pouvez choisir un autre bus ou continuer ce trajet. Merci pour votre patience !",
    },
    type: "info",
    showButton: true,
  },
];

export const NewsData = [
  {
    id: 1,
    label: {
      en: "Community BBQ on October 30",
      "en-GB": "GP Consultation",
      es: "BBQ Comunitario el 30 de octubre",
      fr: "Barbecue Communautaire le 30 octobre",
    },
    description: {
      en: "Join us for a fun-filled evening with food, games, and music! RSVP by October 25",
      "en-GB":
        "Join us for a fun-filled evening with food, games, and music! RSVP by October 25",
      es: "¡Únase a nosotros para una noche llena de diversión con comida, juegos y música! Confirme su asistencia antes del 25 de octubre",
      fr: "Rejoignez-nous pour une soirée pleine de plaisir avec nourriture, jeux et musique ! RSVP avant le 25 octobre",
    },
    status: {
      en: "Upcoming Events",
      "en-GB": "Upcoming Events",
      es: "Próximos Eventos",
      fr: "Événements à venir",
    },
  },
  {
    id: 2,
    label: {
      en: "Planned Maintenance on October 28",
      "en-GB": "Planned Maintenance on October 28",
      es: "Mantenimiento Planificado el 28 de octubre",
      fr: "Maintenance Prévue le 28 octobre",
    },
    description: {
      en: "Water supply will be interrupted from 10 AM to 4 PM",
      "en-GB": "Water supply will be interrupted from 10 AM to 4 PM",
      es: "El suministro de agua se interrumpirá de 10:00 a 16:00",
      fr: "La fourniture d'eau sera interrompue de 10h à 16h",
    },
    status: {
      en: "Maintenance Notices",
      "en-GB": "Maintenance Notices",
      es: "Avisos de Mantenimiento",
      fr: "Avis de Maintenance",
    },
  },
  {
    id: 3,
    label: {
      en: "Community Event on October 23",
      "en-GB": "Community Event on October 23",
      es: "Evento Comunitario el 23 de octubre",
      fr: "Événement Communautaire le 23 octobre",
    },
    description: {
      en: "Join us for a fun-filled evening with food, games, and music! RSVP by October 25",
      "en-GB":
        "Join us for a fun-filled evening with food, games, and music! RSVP by October 25",
      es: "¡Únase a nosotros para una noche llena de diversión con comida, juegos y música! Confirme su asistencia antes del 25 de octubre",
      fr: "Rejoignez-nous pour une soirée pleine de plaisir avec nourriture, jeux et musique ! RSVP avant le 25 octobre",
    },
    status: {
      en: "Upcoming Events",
      "en-GB": "Upcoming Events",
      es: "Próximos Eventos",
      fr: "Événements à venir",
    },
  },
];
export const policyDocuments = [
  {
    id: 1,
    docs: {
      en: "Hausman St. 75",
      "en-GB": "Hausman St. 75",
      es: "Calle Hausman 75",
      fr: "75, rue Hausman",
    },
    icon: "/dev-images/addressIcon.svg",
  },
  {
    id: 2,
    docs: {
      en: "Richard@gmail.com",
      "en-GB": "Richard@gmail.com",
      es: "Richard@gmail.com",
      fr: "Richard@gmail.com",
    },
    icon: "/dev-images/emailIcon.svg",
  },
  {
    id: 3,
    docs: {
      en: "October 25, 2023",
      "en-GB": "25 October 2023",
      es: "25 de octubre de 2023",
      fr: "25 octobre 2023",
    },
    icon: "/dev-images/dateIcon.svg",
  },
  {
    id: 4,
    docs: {
      en: "Car Reg 36579",
      "en-GB": "Car Reg 36579",
      es: "Matrícula del coche 36579",
      fr: "Immatriculation du véhicule 36579",
    },
    icon: "/dev-images/carIcon.svg",
  },
];
export const bookingConfirmation = {
  date: "March 1, 2024",
  time: "1:30 PM - 2:30 PM",
  machineName: {
    en: "Machine A",
    "en-GB": "Machine A",
    es: "Máquina A",
    fr: "Machine A",
  },
};
