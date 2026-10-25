import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

type Schedule = {
  id: string;
  planId: string;
  userId: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
};

export const createPlan = async (
  title: string,
  startDate: string,
  endDate: string,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const planRef = await addDoc(collection(db, "plans"), {
    title: title,
    startDate,
    endDate,
    userId: user.uid,
    createdAt: new Date(),
  });

  return planRef.id;
};

export const getPlans = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const q = query(collection(db, "plans"), where("userId", "==", user.uid));
  //collectionはPlansという箱的な、Firestorの中のPlans見てね。からのuserIDが一致する部分だけを取り出し。

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getSchedules = async (planId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const q = query(
    collection(db, "schedules"),
    where("planId", "==", planId),
    where("userId", "==", user.uid),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    planId: doc.data().planId,
    userId: doc.data().userId,
    day: doc.data().day,
    title: doc.data().title ?? "",
    startTime: doc.data().startTime,
    endTime: doc.data().endTime,
    memo: doc.data().memo,
  })) as Schedule[];
};

export const createSchedule = async (
  planId: string,
  day: string,
  title: string,
  startTime: string,
  endTime: string,
  memo: string,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await addDoc(collection(db, "schedules"), {
    planId,
    userId: user.uid,
    day,
    title,
    startTime,
    endTime,
    memo,
    createdAt: new Date(),
  });
};

export const deleteSchedule = async (scheduleId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await deleteDoc(doc(db, "schedules", scheduleId));
};

export const deletePlan = async (planId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await deleteDoc(doc(db, "plans", planId));
};

export const updateSchedule = async (
  scheduleId: string,
  day: string,
  title: string,
  startTime: string,
  endTime: string,
  memo: string,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  await updateDoc(doc(db, "schedules", scheduleId), {
    day: day,
    title: title,
    startTime: startTime,
    endTime: endTime,
    memo: memo,
  });
};

// 旅行タイトルを更新する
export const updatePlanTitle = async (planId: string, title: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const planRef = doc(db, "plans", planId);
  const planSnapshot = await getDoc(planRef);

  if (!planSnapshot.exists()) {
    throw new Error("旅行プランが見つかりません");
  }

  if (planSnapshot.data().userId !== user.uid) {
    throw new Error("この旅行プランを編集する権限がありません");
  }

  await updateDoc(planRef, {
    title: title.trim(),
  });
};

export const updatePlanDates = async (
  planId: string,
  startDate: string,
  endDate: string,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const planRef = doc(db, "plans", planId);
  const planSnapshot = await getDoc(planRef);

  if (!planSnapshot.exists()) {
    throw new Error("旅行プランが見つかりません");
  }

  if (planSnapshot.data().userId !== user.uid) {
    throw new Error("この旅行プランを編集する権限がありません");
  }

  await updateDoc(planRef, {
    startDate,
    endDate,
  });
};
