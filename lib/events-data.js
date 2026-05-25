import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeEvent, toDate } from "@/lib/events-utils";

function sortEventsByDate(events) {
  return events.sort((a, b) => {
    const timeA = toDate(a.date)?.getTime() ?? 0;
    const timeB = toDate(b.date)?.getTime() ?? 0;
    return timeB - timeA;
  });
}

export async function fetchAllEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const events = snapshot.docs.map((d) => normalizeEvent(d.id, d.data()));
  return sortEventsByDate(events);
}

export async function fetchEventsByType(type) {
  const events = await fetchAllEvents();
  return events.filter((event) => event.type === type);
}

export async function fetchEventById(eventId) {
  const snapshot = await getDoc(doc(db, "events", eventId));
  if (!snapshot.exists()) return null;
  return normalizeEvent(snapshot.id, snapshot.data());
}

export async function isUserRegistered(userId, eventId) {
  const snapshot = await getDocs(
    query(
      collection(db, "registrations"),
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    )
  );
  return !snapshot.empty;
}

export async function registerForEvent(userId, eventId) {
  const alreadyRegistered = await isUserRegistered(userId, eventId);
  if (alreadyRegistered) {
    throw new Error("ALREADY_REGISTERED");
  }

  const eventRef = doc(db, "events", eventId);

  await runTransaction(db, async (transaction) => {
    const eventSnap = await transaction.get(eventRef);
    if (!eventSnap.exists()) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const data = eventSnap.data();
    const seats = data.seats ?? 0;
    const registeredCount = data.registeredCount ?? 0;

    if (seats > 0 && registeredCount >= seats) {
      throw new Error("EVENT_FULL");
    }

    const registrationRef = doc(collection(db, "registrations"));
    transaction.set(registrationRef, {
      userId,
      eventId,
      registeredAt: serverTimestamp(),
      status: "confirmed",
    });

    transaction.update(eventRef, {
      registeredCount: increment(1),
    });
  });
}
