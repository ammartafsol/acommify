import moment from "moment";

export function asText(value, locale) {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") return value[locale] || value.en || "";
  return "";
}

export function personName(item, locale) {
  return (
    asText(item?.user?.fullName, locale) ||
    asText(item?.resident?.fullName, locale) ||
    asText(item?.assignedTo?.fullName, locale) ||
    asText(item?.fullName, locale)
  );
}

export function houseValue(item) {
  const value =
    item?.accommodation?.accommodationNumber ||
    item?.user?.accommodation?.accommodationNumber ||
    item?.houseNumber ||
    item?.house ||
    "";
  return value == null ? "" : String(value);
}

export function roomValue(item, locale) {
  const room = item?.roomNumber ?? item?.room;
  if (room == null || room === "") return "";
  if (typeof room === "object") {
    return asText(room.name, locale) || String(room.roomNumber || room.number || "");
  }
  return String(room);
}

export function capitalizeFirst(value) {
  const text = String(value || "");
  const trimmed = text.trimStart();
  if (!trimmed) return "";
  const lead = text.length - trimmed.length;
  return text.slice(0, lead) + trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

export function jobTitle(item, locale) {
  return (
    asText(item?.title, locale) ||
    capitalizeFirst(asText(item?.description, locale)) ||
    asText(item?.category?.name, locale)
  );
}

export function jobPriority(item) {
  const raw = String(
    item?.category?.severity || item?.severity || item?.priority || item?.priorityLevel || "",
  ).toLowerCase();
  if (raw.includes("high") || raw === "urgent") return "high";
  if (raw.includes("medium") || raw.includes("med")) return "medium";
  if (raw.includes("low")) return "low";

  const status = String(item?.status || "").toLowerCase();
  if (["escalated", "urgent", "rejected", "high"].includes(status)) return "high";
  if (["pending", "under-review", "under review", "medium"].includes(status)) return "medium";
  return "low";
}

export function jobCode(item) {
  const raw = item?.requestId || item?.ticketId || item?.code || item?.reference;
  if (raw) {
    const text = String(raw);
    return text.startsWith("#") ? text : `#${text}`;
  }
  const source = String(item?._id || item?.slug || "");
  const digits = source.replace(/\D/g, "").slice(-5);
  if (digits) return `#${digits.padStart(5, "0")}`;
  return source ? `#${source.slice(-5).toUpperCase()}` : "";
}

export function formatListTime(date, t) {
  if (!date) return "";
  const value = moment(date);
  if (!value.isValid()) return "";
  const time = value.format("HH:mm");
  if (value.isSame(moment(), "day")) return t("jobs.today", { time });
  if (value.isSame(moment().subtract(1, "day"), "day")) return t("jobs.yesterday", { time });
  return value.format("DD MMM YYYY, HH:mm");
}

export function formatReported(date, t) {
  if (!date) return "";
  const value = moment(date);
  if (!value.isValid()) return "";
  const time = value.format("HH:mm");
  if (value.isSame(moment(), "day")) return t("detail.reportedToday", { time });
  if (value.isSame(moment().subtract(1, "day"), "day")) {
    return t("detail.reportedYesterday", { time });
  }
  return t("detail.reportedOn", { date: value.format("DD MMM YYYY, HH:mm") });
}

export function placeLabel(prefix, value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.toLowerCase().includes(String(prefix).toLowerCase())) return text;
  return `${prefix} ${text}`;
}

export function documentKey(doc) {
  if (!doc) return "";
  if (typeof doc === "string") return doc;
  return doc.url || doc.key || doc.path || "";
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "heic", "heif"];

export function isImageFile(doc) {
  const key = documentKey(doc).split("?")[0].split("#")[0];
  const extension = key.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTENSIONS.includes(extension);
}
