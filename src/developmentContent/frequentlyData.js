"use client";
import { useLocale } from "next-intl";

export const frequentlyAccordions = [
  {
    _id: 1,
    title: {
      en: "What are the opening hours?",
      es: "¿Cuáles son los horarios de apertura?",
      fr: "Quels sont les horaires d'ouverture ?",
    },
    content: {
      en: "Our office is open from 9 AM to 6 PM, Monday to Friday.",
      es: "Nuestra oficina está abierta de 9:00 a 18:00, de lunes a viernes.",
      fr: "Notre bureau est ouvert de 9h à 18h, du lundi au vendredi.",
    },
  },
  {
    _id: 2,
    title: {
      en: "Where can I store personal items?",
      es: "¿Dónde puedo guardar mis objetos personales?",
      fr: "Où puis-je ranger mes effets personnels ?",
    },
    content: {
      en: "You can store personal items in the lockers provided on-site.",
      es: "Puede guardar sus objetos personales en los casilleros disponibles en el lugar.",
      fr: "Vous pouvez ranger vos effets personnels dans les casiers mis à disposition sur place.",
    },
  },
  {
    _id: 3,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
  {
    _id: 4,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
  {
    _id: 5,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
  {
    _id: 6,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
  {
    _id: 7,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
  {
    _id: 8,
    title: {
      en: "Is there Wi-Fi available on the bus?",
      es: "¿Hay Wi-Fi disponible en el autobús?",
      fr: "Y a-t-il du Wi-Fi disponible dans le bus ?",
    },
    content: {
      en: "Yes, Wi-Fi is available on all our buses for free.",
      es: "Sí, hay Wi-Fi disponible en todos nuestros autobuses de forma gratuita.",
      fr: "Oui, le Wi-Fi est disponible gratuitement dans tous nos bus.",
    },
  },
];

// export const servicesCardData = [
//   {
//     _id: "1",
//     title: {
//       en: "Laundry Services",
//       es: "Servicios de Lavandería",
//       fr: "Services de Blanchisserie",
//     },
//     description: {
//       en: "Find everything you need to know about using our on-site laundry facilities.",
//       "en-GB":
//         "Find everything you need to know about using our on-site laundry facilities.",
//       es: "Encuentre toda la información que necesita sobre el uso de nuestras instalaciones de lavandería.",
//       fr: "Trouvez tout ce que vous devez savoir sur l'utilisation de nos installations de blanchisserie sur place.",
//     },
//     leftIcon: "/svg/bookinglaundry.svg",

//     detail: [
//       {
//         _id: "1",
//         title: {
//           en: "Locate Facilities",
//           "en-GB": "Locate Facilities",
//           es: "Ubicar instalaciones",
//           fr: "Localiser les installations",
//         },
//         content: {
//           en: "Laundry services are available beside the manager's office.",
//           "en-GB":
//             "Laundry services are available beside the manager's office.",
//           es: "Los servicios de lavandería están disponibles junto a la oficina del gerente.",
//           fr: "Les services de blanchisserie sont disponibles à côté du bureau du responsable.",
//         },
//       },
//       {
//         _id: "2",
//         title: {
//           en: "Access",
//           "en-GB": "Access",
//           es: "Acceso",
//           fr: "Accès",
//         },
//         content: {
//           en: "The laundries are open to the public.",
//           "en-GB": "The laundries are open to the public.",
//           es: "Las lavanderías están abiertas al público.",
//           fr: "Les blanchisseries sont ouvertes au public.",
//         },
//       },
//       {
//         _id: "3",
//         title: {
//           en: "How to Operate",
//           "en-GB": "How to Operate",
//           es: "Cómo Operar",
//           fr: "Comment Utiliser",
//         },
//         content: {
//           en: "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           "en-GB":
//             "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           es: "Para la lavadora, use un token etiquetado 'lavar'. Una carga grande requiere dos tokens de lavado.",
//           fr: "Pour la machine à laver, utilisez un jeton étiqueté 'lavage'. Une grande charge nécessite deux jetons de lavage.",
//         },
//       },
//       {
//         _id: "4",
//         title: {
//           en: "Dryer Instructions",
//           "en-GB": "Dryer Instructions",
//           es: "Instrucciones de la Secadora",
//           fr: "Instructions pour le Sèche-linge",
//         },
//         content: {
//           en: "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           "en-GB":
//             "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           es: "Para la secadora, use un token de cobre simple. Una carga grande necesita un token de cobre grande.",
//           fr: "Pour le sèche-linge, utilisez un jeton en cuivre simple. Une grande charge nécessite un jeton en cuivre large.",
//         },
//       },
//       {
//         _id: "5",
//         title: {
//           en: "Hours",
//           "en-GB": "Hours",
//           es: "Horario",
//           fr: "Heures",
//         },
//         content: {
//           en: "8 AM - 5:30 PM",
//           "en-GB": "8 AM - 5:30 PM",
//           es: "8:00 - 17:30",
//           fr: "8h00 - 17h30",
//         },
//       },
//     ],

//     myVideo: "/video/video.mp4",
//   },
//   {
//     _id: "2",
//     title: {
//       en: "Maintenance Requests",
//       "en-GB": "Maintenance Requests",
//       es: "Solicitudes de Mantenimiento",
//       fr: "Demandes de Maintenance",
//     },
//     description: {
//       en: "Find everything you need to know about using our on-site maintenance services.",
//       "en-GB":
//         "Find everything you need to know about using our on-site maintenance services.",
//       es: "Encuentre toda la información que necesita sobre el uso de nuestros servicios de mantenimiento en el lugar.",
//       fr: "Trouvez tout ce que vous devez savoir sur l'utilisation de nos services de maintenance sur place.",
//     },
//     leftIcon: "/svg/request.svg",
//     myVideo: "/video/video.mp4",
//     detail: [
//       {
//         _id: "1",
//         title: {
//           en: "Locate Facilities",
//           "en-GB": "Locate Facilities",
//           es: "Ubicar instalaciones",
//           fr: "Localiser les installations",
//         },
//         content: {
//           en: "Laundry services are available beside the manager's office.",
//           "en-GB":
//             "Laundry services are available beside the manager's office.",
//           es: "Los servicios de lavandería están disponibles junto a la oficina del gerente.",
//           fr: "Les services de blanchisserie sont disponibles à côté du bureau du responsable.",
//         },
//       },
//       {
//         _id: "2",
//         title: {
//           en: "Access",
//           "en-GB": "Access",
//           es: "Acceso",
//           fr: "Accès",
//         },
//         content: {
//           en: "The laundries are open to the public.",
//           "en-GB": "The laundries are open to the public.",
//           es: "Las lavanderías están abiertas al público.",
//           fr: "Les blanchisseries sont ouvertes au public.",
//         },
//       },
//       {
//         _id: "3",
//         title: {
//           en: "How to Operate",
//           "en-GB": "How to Operate",
//           es: "Cómo Operar",
//           fr: "Comment Utiliser",
//         },
//         content: {
//           en: "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           "en-GB":
//             "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           es: "Para la lavadora, use un token etiquetado 'lavar'. Una carga grande requiere dos tokens de lavado.",
//           fr: "Pour la machine à laver, utilisez un jeton étiqueté 'lavage'. Une grande charge nécessite deux jetons de lavage.",
//         },
//       },
//       {
//         _id: "4",
//         title: {
//           en: "Dryer Instructions",
//           "en-GB": "Dryer Instructions",
//           es: "Instrucciones de la Secadora",
//           fr: "Instructions pour le Sèche-linge",
//         },
//         content: {
//           en: "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           "en-GB":
//             "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           es: "Para la secadora, use un token de cobre simple. Una carga grande necesita un token de cobre grande.",
//           fr: "Pour le sèche-linge, utilisez un jeton en cuivre simple. Une grande charge nécessite un jeton en cuivre large.",
//         },
//       },
//       {
//         _id: "5",
//         title: {
//           en: "Hours",
//           "en-GB": "Hours",
//           es: "Horario",
//           fr: "Heures",
//         },
//         content: {
//           en: "8 AM - 5:30 PM",
//           "en-GB": "8 AM - 5:30 PM",
//           es: "8:00 - 17:30",
//           fr: "8h00 - 17h30",
//         },
//       },
//     ],
//   },
//   {
//     _id: "3",
//     title: {
//       en: "Visitor Policy",
//       "en-GB": "Visitor Policy",
//       es: "Política de Visitantes",
//       fr: "Politique des Visiteurs",
//     },
//     myVideo: "/video/video.mp4",
//     description: {
//       en: "Find everything you need to know about our on-site visitor policy.",
//       "en-GB":
//         "Find everything you need to know about our on-site visitor policy.",
//       es: "Encuentre toda la información que necesita sobre nuestra política de visitantes en el lugar.",
//       fr: "Trouvez tout ce que vous devez savoir sur notre politique des visiteurs sur place.",
//     },
//     leftIcon: "/svg/users2.svg",
//     detail: [
//       {
//         _id: "1",
//         title: {
//           en: "Locate Facilities",
//           "en-GB": "Locate Facilities",
//           es: "Ubicar instalaciones",
//           fr: "Localiser les installations",
//         },
//         content: {
//           en: "Laundry services are available beside the manager's office.",
//           "en-GB":
//             "Laundry services are available beside the manager's office.",
//           es: "Los servicios de lavandería están disponibles junto a la oficina del gerente.",
//           fr: "Les services de blanchisserie sont disponibles à côté du bureau du responsable.",
//         },
//       },
//       {
//         _id: "2",
//         title: {
//           en: "Access",
//           "en-GB": "Access",
//           es: "Acceso",
//           fr: "Accès",
//         },
//         content: {
//           en: "The laundries are open to the public.",
//           "en-GB": "The laundries are open to the public.",
//           es: "Las lavanderías están abiertas al público.",
//           fr: "Les blanchisseries sont ouvertes au public.",
//         },
//       },
//       {
//         _id: "3",
//         title: {
//           en: "How to Operate",
//           "en-GB": "How to Operate",
//           es: "Cómo Operar",
//           fr: "Comment Utiliser",
//         },
//         content: {
//           en: "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           "en-GB":
//             "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           es: "Para la lavadora, use un token etiquetado 'lavar'. Una carga grande requiere dos tokens de lavado.",
//           fr: "Pour la machine à laver, utilisez un jeton étiqueté 'lavage'. Une grande charge nécessite deux jetons de lavage.",
//         },
//       },
//       {
//         _id: "4",
//         title: {
//           en: "Dryer Instructions",
//           "en-GB": "Dryer Instructions",
//           es: "Instrucciones de la Secadora",
//           fr: "Instructions pour le Sèche-linge",
//         },
//         content: {
//           en: "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           "en-GB":
//             "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           es: "Para la secadora, use un token de cobre simple. Una carga grande necesita un token de cobre grande.",
//           fr: "Pour le sèche-linge, utilisez un jeton en cuivre simple. Une grande charge nécessite un jeton en cuivre large.",
//         },
//       },
//       {
//         _id: "5",
//         title: {
//           en: "Hours",
//           "en-GB": "Hours",
//           es: "Horario",
//           fr: "Heures",
//         },
//         content: {
//           en: "8 AM - 5:30 PM",
//           "en-GB": "8 AM - 5:30 PM",
//           es: "8:00 - 17:30",
//           fr: "8h00 - 17h30",
//         },
//       },
//     ],
//   },
//   {
//     _id: "4",
//     title: {
//       en: "Transport Information",
//       "en-GB": "Transport Information",
//       es: "Información de Transporte",
//       fr: "Informations sur le Transport",
//     },

//     myVideo: "/video/video.mp4",
//     description: {
//       en: "Find everything you need to know about on-site transport services and schedules.",
//       "en-GB":
//         "Find everything you need to know about on-site transport services and schedules.",
//       es: "Encuentre toda la información que necesita sobre los servicios y horarios de transporte en el lugar.",
//       fr: "Trouvez tout ce que vous devez savoir sur les services et horaires de transport sur place.",
//     },
//     leftIcon: "/svg/buses2.svg",
//     detail: [
//       {
//         _id: "1",
//         title: {
//           en: "Locate Facilities",
//           "en-GB": "Locate Facilities",
//           es: "Ubicar instalaciones",
//           fr: "Localiser les installations",
//         },
//         content: {
//           en: "Laundry services are available beside the manager's office.",
//           "en-GB":
//             "Laundry services are available beside the manager's office.",
//           es: "Los servicios de lavandería están disponibles junto a la oficina del gerente.",
//           fr: "Les services de blanchisserie sont disponibles à côté du bureau du responsable.",
//         },
//       },
//       {
//         _id: "2",
//         title: {
//           en: "Access",
//           "en-GB": "Access",
//           es: "Acceso",
//           fr: "Accès",
//         },
//         content: {
//           en: "The laundries are open to the public.",
//           "en-GB": "The laundries are open to the public.",
//           es: "Las lavanderías están abiertas al público.",
//           fr: "Les blanchisseries sont ouvertes au public.",
//         },
//       },
//       {
//         _id: "3",
//         title: {
//           en: "How to Operate",
//           "en-GB": "How to Operate",
//           es: "Cómo Operar",
//           fr: "Comment Utiliser",
//         },
//         content: {
//           en: "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           "en-GB":
//             "For the washing machine, use a token labelled 'wash'. A big load requires two wash tokens.",
//           es: "Para la lavadora, use un token etiquetado 'lavar'. Una carga grande requiere dos tokens de lavado.",
//           fr: "Pour la machine à laver, utilisez un jeton étiqueté 'lavage'. Une grande charge nécessite deux jetons de lavage.",
//         },
//       },
//       {
//         _id: "4",
//         title: {
//           en: "Dryer Instructions",
//           "en-GB": "Dryer Instructions",
//           es: "Instrucciones de la Secadora",
//           fr: "Instructions pour le Sèche-linge",
//         },
//         content: {
//           en: "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           "en-GB":
//             "For the dryer, use a plain copper token. A large load in the dryer needs one large copper token.",
//           es: "Para la secadora, use un token de cobre simple. Una carga grande necesita un token de cobre grande.",
//           fr: "Pour le sèche-linge, utilisez un jeton en cuivre simple. Une grande charge nécessite un jeton en cuivre large.",
//         },
//       },
//       {
//         _id: "5",
//         title: {
//           en: "Hours",
//           "en-GB": "Hours",
//           es: "Horario",
//           fr: "Heures",
//         },
//         content: {
//           en: "8 AM - 5:30 PM",
//           "en-GB": "8 AM - 5:30 PM",
//           es: "8:00 - 17:30",
//           fr: "8h00 - 17h30",
//         },
//       },
//     ],
//   },
// ];
export const contactInformation = [
  {
    id: 1,
    info: {
      en: "555-0199",
      "en-GB": "555-0199",
      es: "555-0199",
      fr: "555-0199",
    },
    icon: "/dev-images/addressIcon.svg",
  },
  {
    id: 2,
    info: {
      en: "support@accommodation.com",
      "en-GB": "support@accommodation.com",
      es: "support@accommodation.com",
      fr: "support@accommodation.com",
    },
    icon: "/dev-images/emailIcon.svg",
  },
  {
    id: 3,
    info: {
      en: "555-0199",
      "en-GB": "555-0199",
      es: "555-0199",
      fr: "555-0199",
    },
    icon: "/dev-images/dateIcon.svg",
  },
];
export function downloadable(data) {
  return [
    {
      id: 1,
      info: {
        en: "House Rules",
        "en-GB": "House Rules",
        es: "Reglas de la Casa",
        fr: "Règles de la Maison",
      },
      icon: "/svg/PDF.svg",
      // fileUrl: "/files/test.pdf",
      fileUrl: data?.additionalResources?.documents[0],
    },
    {
      id: 2,
      info: {
        en: "Service Schedules",
        "en-GB": "Service Schedules",
        es: "Horarios de Servicio",
        fr: "Horaires des Services",
      },
      icon: "/svg/PDF.svg",
      fileUrl: data?.additionalResources?.documents[1],
    },
    {
      id: 3,
      info: {
        en: "Procedures",
        "en-GB": "Procedures",
        es: "Procedimientos",
        fr: "Procédures",
      },
      icon: "/svg/PDF.svg",
      fileUrl: data?.additionalResources?.documents[2],
    },
    {
      id: 4,
      info: {
        en: "Service Rules",
        "en-GB": "Service Rules",
        es: "Reglas del Servicio",
        fr: "Règles du Service",
      },
      icon: "/svg/PDF.svg",
      fileUrl: data?.additionalResources?.documents[3],
    },
  ];
}

export const tabOptions = (t) => [
  { label: t("additionalResources.download"), value: "download" },
  { label: t("additionalResources.contact"), value: "contact" },
];
export const tabOptionsFrequently = (t) => [
  { label: t("frequently.tabs.generalinquiries"), value: "inquiry" },
  { label: t("frequently.tabs.visitorPolicies"), value: "visitor" },
  { label: t("frequently.tabs.serviceInformation"), value: "service" },
];

export function servicesCardData(data, locale) {
  return [
    {
      _id: "1",
      title: data?.laundryService?.title?.[locale] ?? "",
      description: data?.laundryService?.description?.[locale] ?? "",
      leftIcon: "/svg/bookinglaundry.svg",
      myVideo: data?.laundryService?.video || null,
    },
    {
      _id: "2",
      title: data?.maintenanceRequest?.title?.[locale] ?? "",
      description: data?.maintenanceRequest?.description?.[locale] ?? "",
      leftIcon: "/svg/bookinglaundry.svg",
      myVideo: data?.maintenanceRequest?.video || null,
    },
    {
      _id: "3",
      title: data?.visitorPolicy?.title?.[locale] ?? "",
      description: data?.visitorPolicy?.description?.[locale] ?? "",
      leftIcon: "/svg/bookinglaundry.svg",
      myVideo: data?.visitorPolicy?.video || null,
    },
    {
      _id: "4",
      title: data?.transportInformation?.title?.[locale] ?? "",
      description: data?.transportInformation?.description?.[locale] ?? "",
      leftIcon: "/svg/bookinglaundry.svg",
      myVideo: data?.transportInformation?.video || null,
    },
  ];
}
