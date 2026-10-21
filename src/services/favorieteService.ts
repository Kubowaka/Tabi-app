import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";

export const getFavorites = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const q = query(collection(db, "favorites"), where("userId", "==", user.uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addFavorite = async (spot: any) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await addDoc(collection(db, "favorites"), {
    userId: user.uid,
    spotId: spot.id,
    name: spot.displayName?.text ?? "",
    address: spot.formattedAddress ?? "",
    imageName: spot.photos?.[0]?.name ?? "",
    description: spot.editorialSummary?.text ?? spot.formattedAddress ?? "",
    primaryType: spot.primaryType ?? "",
  });
};

export const deleteFavorite = async (favoriteId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await deleteDoc(doc(db, "favorites", favoriteId));
};
