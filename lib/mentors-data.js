import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function fetchMentors() {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("role", "==", "mentor"))
  );

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? data.displayName ?? "Mentor",
      photoURL: data.photoURL ?? "",
      skills: Array.isArray(data.skills) ? data.skills : [],
      bio: data.bio ?? "",
    };
  });
}

export async function createMentorRequest(studentId, mentorId, message) {
  await addDoc(collection(db, "mentorRequests"), {
    studentId,
    mentorId,
    message,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
