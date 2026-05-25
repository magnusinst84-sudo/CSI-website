import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

function formatDate(value) {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getEventName(eventData) {
  return eventData?.title ?? eventData?.name ?? "Untitled Event";
}

export async function fetchDashboardData(userId) {
  const [
    userSnap,
    usersLeaderboardSnap,
    registrationsSnap,
    certificatesSnap,
    applicationsSnap,
  ] = await Promise.all([
    getDoc(doc(db, "users", userId)),
    getDocs(query(collection(db, "users"), orderBy("points", "desc"))),
    getDocs(query(collection(db, "registrations"), where("userId", "==", userId))),
    getDocs(query(collection(db, "certificates"), where("userId", "==", userId))),
    getDocs(
      query(
        collection(db, "applications"),
        where("userId", "==", userId),
        where("status", "==", "pending")
      )
    ),
  ]);

  const profile = userSnap.exists() ? userSnap.data() : {};
  const points = profile.points ?? 0;

  const leaderboardDocs = usersLeaderboardSnap.docs;
  const rankIndex = leaderboardDocs.findIndex((d) => d.id === userId);
  const leaderboardRank = rankIndex >= 0 ? rankIndex + 1 : leaderboardDocs.length + 1;

  const registrationDocs = registrationsSnap.docs;
  const eventsRegistered = registrationDocs.length;

  const certificateDocs = certificatesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
  const certificatesEarned = certificateDocs.length;

  const eventIds = [
    ...new Set(
      registrationDocs.map((d) => d.data().eventId).filter(Boolean)
    ),
  ];

  const eventMap = new Map();
  await Promise.all(
    eventIds.map(async (eventId) => {
      const eventSnap = await getDoc(doc(db, "events", eventId));
      if (eventSnap.exists()) {
        eventMap.set(eventId, { id: eventSnap.id, ...eventSnap.data() });
      }
    })
  );

  const now = new Date();
  const upcomingEvents = registrationDocs
    .map((reg) => {
      const data = reg.data();
      const event = eventMap.get(data.eventId);
      if (!event) return null;
      const eventDate = toDate(event.date ?? event.startDate ?? event.eventDate);
      if (eventDate && eventDate < now) return null;
      return {
        id: reg.id,
        eventId: data.eventId,
        name: getEventName(event),
        date: eventDate,
        dateLabel: formatDate(event.date ?? event.startDate ?? event.eventDate),
        type: (event.type ?? "workshop").toLowerCase(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (!a.date) return -1;
      if (!b.date) return 1;
      return a.date - b.date;
    });

  const recentCertificates = certificateDocs
    .map((cert) => ({
      id: cert.id,
      eventName: cert.eventName ?? cert.event ?? "Certificate",
      issuedAt: cert.issuedAt ?? cert.issuedDate,
      issuedLabel: formatDate(cert.issuedAt ?? cert.issuedDate),
    }))
    .sort((a, b) => {
      const dateA = toDate(a.issuedAt)?.getTime() ?? 0;
      const dateB = toDate(b.issuedAt)?.getTime() ?? 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const pendingApplications = applicationsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      role: data.role ?? data.position ?? "Member",
      type: data.type ?? data.applicationType ?? "General",
      status: data.status,
    };
  });

  return {
    profile,
    stats: {
      points,
      leaderboardRank,
      eventsRegistered,
      certificatesEarned,
    },
    upcomingEvents,
    recentCertificates,
    pendingApplications,
  };
}
