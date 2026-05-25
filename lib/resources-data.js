import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate, toDate } from "@/lib/events-utils";

function normalizeResource(id, data) {
  return {
    id,
    title: data?.title ?? "Untitled Resource",
    description: data?.description ?? "",
    type: (data?.type ?? "link").toLowerCase(),
    url: data?.url ?? "",
    category: data?.category ?? "General",
    uploadedAt: data?.uploadedAt,
    uploadedLabel: formatEventDate(data?.uploadedAt),
  };
}

export async function fetchAllResources() {
  const snapshot = await getDocs(collection(db, "resources"));
  const resources = snapshot.docs.map((d) => normalizeResource(d.id, d.data()));

  return resources.sort((a, b) => {
    const timeA = toDate(a.uploadedAt)?.getTime() ?? 0;
    const timeB = toDate(b.uploadedAt)?.getTime() ?? 0;
    return timeB - timeA;
  });
}
