import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate, toDate } from "@/lib/events-utils";

export async function fetchUserCertificates(userId) {
  const snapshot = await getDocs(
    query(collection(db, "certificates"), where("userId", "==", userId))
  );

  const certificates = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      eventId: data.eventId ?? "",
      eventName: data.eventName ?? "Event",
      certificateId: data.certificateId ?? d.id,
      issuedAt: data.issuedAt,
      issuedLabel: formatEventDate(data.issuedAt),
    };
  });

  return certificates.sort((a, b) => {
    const timeA = toDate(a.issuedAt)?.getTime() ?? 0;
    const timeB = toDate(b.issuedAt)?.getTime() ?? 0;
    return timeB - timeA;
  });
}
