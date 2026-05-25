import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatEventDate, toDate } from "@/lib/events-utils";

function normalizePost(id, data) {
  const upvotes = Array.isArray(data?.upvotes) ? data.upvotes : [];
  return {
    id,
    authorId: data?.authorId ?? "",
    authorName: data?.authorName ?? "Anonymous",
    authorPhoto: data?.authorPhoto ?? "",
    title: data?.title ?? "Untitled",
    body: data?.body ?? "",
    tags: Array.isArray(data?.tags) ? data.tags : [],
    createdAt: data?.createdAt,
    createdLabel: formatEventDate(data?.createdAt),
    upvotes,
    upvoteCount: upvotes.length,
  };
}

function normalizeComment(id, data) {
  return {
    id,
    authorId: data?.authorId ?? "",
    authorName: data?.authorName ?? "Anonymous",
    authorPhoto: data?.authorPhoto ?? "",
    body: data?.body ?? "",
    createdAt: data?.createdAt,
    createdLabel: formatEventDate(data?.createdAt),
  };
}

export async function fetchAllPosts() {
  const snapshot = await getDocs(
    query(collection(db, "posts"), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((d) => normalizePost(d.id, d.data()));
}

export async function fetchPostById(postId) {
  const snapshot = await getDoc(doc(db, "posts", postId));
  if (!snapshot.exists()) return null;
  return normalizePost(snapshot.id, snapshot.data());
}

export async function fetchPostComments(postId) {
  const snapshot = await getDocs(
    query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    )
  );
  return snapshot.docs.map((d) => normalizeComment(d.id, d.data()));
}

export async function createPost(author, postData) {
  const docRef = await addDoc(collection(db, "posts"), {
    authorId: author.uid,
    authorName: author.displayName || author.name || "Member",
    authorPhoto: author.photoURL || "",
    title: postData.title,
    body: postData.body,
    tags: postData.tags,
    createdAt: serverTimestamp(),
    upvotes: [],
  });
  return docRef.id;
}

export async function upvotePost(postId, userId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) throw new Error("POST_NOT_FOUND");

  const upvotes = postSnap.data().upvotes ?? [];
  if (upvotes.includes(userId)) return false;

  await updateDoc(postRef, {
    upvotes: arrayUnion(userId),
  });
  return true;
}

export async function addComment(postId, author, body) {
  await addDoc(collection(db, "posts", postId, "comments"), {
    authorId: author.uid,
    authorName: author.displayName || author.name || "Member",
    authorPhoto: author.photoURL || "",
    body,
    createdAt: serverTimestamp(),
  });
}
