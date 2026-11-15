import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";

// Google Places APIから取得するスポット情報の型
type FavoriteSpot = {
  id: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  photos?: {
    name?: string;
  }[];
  editorialSummary?: {
    text?: string;
  };
  primaryType?: string;
};

// Firestoreに保存するお気に入り情報の型
type Favorite = {
  id: string;
  userId: string;
  spotId: string;
  name: string;
  address: string;
  imageName: string;
  description: string;
  primaryType: string;
};

// お気に入り一覧を取得
export const getFavorites = async (): Promise<Favorite[]> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const q = query(collection(db, "favorites"), where("userId", "==", user.uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((favoriteDoc) => {
    const data = favoriteDoc.data();

    return {
      id: favoriteDoc.id,
      userId: data.userId ?? "",
      spotId: data.spotId ?? "",
      name: data.name ?? "",
      address: data.address ?? "",
      imageName: data.imageName ?? "",
      description: data.description ?? "",
      primaryType: data.primaryType ?? "",
    };
  });
};

// お気に入りを登録
export const addFavorite = async (spot: FavoriteSpot) => {
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

// お気に入りを削除
export const deleteFavorite = async (favoriteId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const favoriteRef = doc(db, "favorites", favoriteId);
  const favoriteSnapshot = await getDoc(favoriteRef);

  if (!favoriteSnapshot.exists()) {
    throw new Error("お気に入りが見つかりません");
  }

  const favoriteData = favoriteSnapshot.data();

  if (favoriteData.userId !== user.uid) {
    throw new Error("このお気に入りを削除する権限がありません");
  }

  await deleteDoc(favoriteRef);
};
