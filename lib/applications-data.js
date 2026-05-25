import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate } from "@/lib/events-utils";

export async function fetchUserApplications(userId) {
  const snapshot = await getDocs(
    query(collection(db, "applications"), where("userId", "==", userId))
  );

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

export async function hasPendingApplication(userId, type) {
  const snapshot = await getDocs(
    query(
      collection(db, "applications"),
      where("userId", "==", userId),
      where("type", "==", type),
      where("status", "==", "pending")
    )
  );
  return !snapshot.empty;
}

export async function createApplication(userId, application) {
  const pending = await hasPendingApplication(userId, application.type);
  if (pending) {
    throw new Error("DUPLICATE_PENDING");
  }

  await addDoc(collection(db, "applications"), {
    userId,
    type: application.type,
    role: application.role,
    motivation: application.motivation,
    skills: application.skills,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
