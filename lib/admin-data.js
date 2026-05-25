import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate } from "@/lib/events-utils";

export function generateCertificateId() {
  const segment = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CSI-VIT-${Date.now().toString(36).toUpperCase()}-${segment}`;
}

export async function createEvent(eventData) {
  const dateValue = eventData.date
    ? Timestamp.fromDate(new Date(eventData.date))
    : serverTimestamp();

  await addDoc(collection(db, "events"), {
    title: eventData.title,
    description: eventData.description,
    date: dateValue,
    type: eventData.type,
    venue: eventData.venue || "",
    seats: Number(eventData.seats) || 0,
    registeredCount: 0,
    teamSize: eventData.teamSize ? Number(eventData.teamSize) : null,
    duration: eventData.duration || "",
    createdAt: serverTimestamp(),
  });
}

export async function issueCertificate({ userId, eventName, eventId }) {
  const certificateId = generateCertificateId();

  await addDoc(collection(db, "certificates"), {
    userId,
    eventId: eventId || "",
    eventName,
    certificateId,
    issuedAt: serverTimestamp(),
  });

  return certificateId;
}

export async function addUserPoints(userId, pointsToAdd) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("USER_NOT_FOUND");
  }

  await updateDoc(userRef, {
    points: increment(Number(pointsToAdd)),
  });
}

export async function fetchAllApplications() {
  const snapshot = await getDocs(collection(db, "applications"));

  return snapshot.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        type: data.type ?? "team",
        role: data.role ?? "",
        motivation: data.motivation ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        status: data.status ?? "pending",
        createdAt: data.createdAt,
        createdLabel: formatEventDate(data.createdAt),
      };
    })
    .sort((a, b) => {
      const timeA = a.createdAt?.toDate?.()?.getTime() ?? 0;
      const timeB = b.createdAt?.toDate?.()?.getTime() ?? 0;
      return timeB - timeA;
    });
}

export async function updateApplicationStatus(applicationId, status) {
  await updateDoc(doc(db, "applications", applicationId), { status });
}
