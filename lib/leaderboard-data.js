import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function fetchLeaderboard() {
  const snapshot = await getDocs(
    query(collection(db, "users"), orderBy("points", "desc"))
  );

  return snapshot.docs.map((d, index) => {
    const data = d.data();
    return {
      id: d.id,
      rank: index + 1,
      name: data.name ?? data.displayName ?? "Anonymous",
      photoURL: data.photoURL ?? "",
      points: data.points ?? 0,
      role: data.role ?? "student",
    };
  });
}
