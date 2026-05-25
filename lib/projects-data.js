import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate, toDate } from "@/lib/events-utils";

function normalizeProject(id, data) {
  return {
    id,
    title: data?.title ?? "Untitled Project",
    description: data?.description ?? "",
    techStack: Array.isArray(data?.techStack) ? data.techStack : [],
    teamMembers: Array.isArray(data?.teamMembers) ? data.teamMembers : [],
    githubUrl: data?.githubUrl ?? "",
    demoUrl: data?.demoUrl ?? "",
    coverImage: data?.coverImage ?? "",
    createdAt: data?.createdAt,
    createdLabel: formatEventDate(data?.createdAt),
  };
}

export async function fetchAllProjects() {
  const snapshot = await getDocs(collection(db, "projects"));
  const projects = snapshot.docs.map((d) => normalizeProject(d.id, d.data()));

  return projects.sort((a, b) => {
    const timeA = toDate(a.createdAt)?.getTime() ?? 0;
    const timeB = toDate(b.createdAt)?.getTime() ?? 0;
    return timeB - timeA;
  });
}

export async function createProject(userId, projectData) {
  const docRef = await addDoc(collection(db, "projects"), {
    title: projectData.title,
    description: projectData.description,
    techStack: projectData.techStack,
    teamMembers: [userId],
    githubUrl: projectData.githubUrl || "",
    demoUrl: projectData.demoUrl || "",
    coverImage: projectData.coverImage || "",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
