export function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

export function formatEventDate(value) {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return "Date TBA";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getEventTitle(event) {
  return event?.title ?? event?.name ?? "Untitled Event";
}

export function getSeatsRemaining(event) {
  const seats = event?.seats ?? 0;
  const registered = event?.registeredCount ?? 0;
  return Math.max(0, seats - registered);
}

export function normalizeEvent(id, data) {
  return {
    id,
    title: getEventTitle(data),
    description: data?.description ?? "",
    date: data?.date ?? data?.startDate ?? data?.eventDate,
    dateLabel: formatEventDate(data?.date ?? data?.startDate ?? data?.eventDate),
    type: (data?.type ?? "workshop").toLowerCase(),
    venue: data?.venue ?? "",
    seats: data?.seats ?? 0,
    registeredCount: data?.registeredCount ?? 0,
    seatsRemaining: getSeatsRemaining(data),
    teamSize: data?.teamSize ?? null,
    duration: data?.duration ?? null,
  };
}
