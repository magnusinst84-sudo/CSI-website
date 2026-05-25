"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useUserProfile(user) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (!user) {
      setProfile({});
      return;
    }

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  return profile;
}
