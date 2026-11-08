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
  setDoc,
  serverTimestamp,
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

export type Plan = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
};

/**
 * 共有中の旅行プランを最新データに同期する
 */
const syncActivePlanShares = async (planId: string, userId: string) => {
  // 旅行プランを取得
  const planRef = doc(db, "plans", planId);
  const planSnapshot = await getDoc(planRef);

  if (!planSnapshot.exists()) return;

  const planData = planSnapshot.data();

  // 所有者以外からの同期を防ぐ
  if (planData.userId !== userId) return;

  // 最新の予定を取得
  const schedulesQuery = query(
    collection(db, "schedules"),
    where("planId", "==", planId),
    where("userId", "==", userId),
  );

  const schedulesSnapshot = await getDocs(schedulesQuery);

  const schedules = schedulesSnapshot.docs.map((scheduleDoc) => {
    const data = scheduleDoc.data();

    return {
      id: scheduleDoc.id,
      day: data.day ?? "",
      title: data.title ?? "",
      startTime: data.startTime ?? "",
      endTime: data.endTime ?? "",
      memo: data.memo ?? "",
    };
  });

  // この旅行プランの共有設定を取得
  const sharesQuery = query(
    collection(db, "planShares"),
    where("planId", "==", planId),
    where("ownerId", "==", userId),
  );

  const sharesSnapshot = await getDocs(sharesQuery);

  // 有効な共有データだけ最新状態に更新
  for (const share of sharesSnapshot.docs) {
    if (share.data().isActive !== true) continue;

    await updateDoc(share.ref, {
      plan: {
        title: planData.title ?? "",
        startDate: planData.startDate ?? "",
        endDate: planData.endDate ?? "",
      },
      schedules,
      updatedAt: serverTimestamp(),
    });
  }
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

export const getPlans = async (): Promise<Plan[]> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const q = query(collection(db, "plans"), where("userId", "==", user.uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title ?? "",
      startDate: data.startDate ?? "",
      endDate: data.endDate ?? "",
    };
  });
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

  await syncActivePlanShares(planId, user.uid);
};

export const deleteSchedule = async (scheduleId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const scheduleRef = doc(db, "schedules", scheduleId);
  const scheduleSnapshot = await getDoc(scheduleRef);

  if (!scheduleSnapshot.exists()) {
    throw new Error("予定が見つかりません");
  }

  const scheduleData = scheduleSnapshot.data();

  if (scheduleData.userId !== user.uid) {
    throw new Error("この予定を削除する権限がありません");
  }

  await deleteDoc(scheduleRef);

  await syncActivePlanShares(scheduleData.planId, user.uid);
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

  const scheduleRef = doc(db, "schedules", scheduleId);
  const scheduleSnapshot = await getDoc(scheduleRef);

  if (!scheduleSnapshot.exists()) {
    throw new Error("予定が見つかりません");
  }

  const scheduleData = scheduleSnapshot.data();

  if (scheduleData.userId !== user.uid) {
    throw new Error("この予定を編集する権限がありません");
  }

  await updateDoc(scheduleRef, {
    day,
    title,
    startTime,
    endTime,
    memo,
  });

  await syncActivePlanShares(scheduleData.planId, user.uid);
};

// タイトル・開始日・終了日をまとめて更新
// タイトル・開始日・終了日をまとめて更新
export const updatePlanDetails = async (
  planId: string,
  title: string,
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

  const planData = planSnapshot.data();

  if (planData.userId !== user.uid) {
    throw new Error("この旅行プランを編集する権限がありません");
  }

  // タイトル・開始日・終了日を1回の updateDoc で更新
  await updateDoc(planRef, {
    title,
    startDate,
    endDate,
    updatedAt: serverTimestamp(),
  });

  // 有効な共有データも同期
  await syncActivePlanShares(planId, user.uid);
};

/**
 * 共有リンクを発行する
 */

export const createPlanShare = async (planId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  // 旅行情報を取得
  const planRef = doc(db, "plans", planId);
  const planSnapshot = await getDoc(planRef);

  if (!planSnapshot.exists()) {
    throw new Error("旅行プランが見つかりません");
  }

  const planData = planSnapshot.data();

  if (planData.userId !== user.uid) {
    throw new Error("共有する権限がありません");
  }

  // 予定を取得
  const schedulesQuery = query(
    collection(db, "schedules"),
    where("planId", "==", planId),
    where("userId", "==", user.uid),
  );

  const schedulesSnapshot = await getDocs(schedulesQuery);

  const schedules = schedulesSnapshot.docs.map((scheduleDoc) => {
    const data = scheduleDoc.data();

    return {
      id: scheduleDoc.id,
      day: data.day,
      title: data.title ?? "",
      startTime: data.startTime,
      endTime: data.endTime,
      memo: data.memo ?? "",
    };
  });

  console.log("共有データの保存処理を開始します");

  // 既存の共有設定を確認
  const sharesQuery = query(
    collection(db, "planShares"),
    where("planId", "==", planId),
    where("ownerId", "==", user.uid),
  );

  const sharesSnapshot = await getDocs(sharesQuery);

  const activeShare = sharesSnapshot.docs.find(
    (share) => share.data().isActive === true,
  );

  // const shareRef = activeShare
  //   ? activeShare.ref
  //   : doc(collection(db, "planShares"));

  const token = activeShare
    ? activeShare.id
    : crypto.randomUUID() + crypto.randomUUID();

  // 共有データを保存
  await setDoc(doc(db, "planShares", token), {
    planId,
    ownerId: user.uid,
    token,
    isActive: true,
    members: {},
    plan: {
      title: planData.title ?? "",
      startDate: planData.startDate ?? "",
      endDate: planData.endDate ?? "",
    },
    schedules,
    createdAt: activeShare ? activeShare.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log("共有データを保存しました:", token);
  console.log("共有データの保存が完了しました");

  return token;
};

/**
 * 共有リンクを無効化する
 */
export const disablePlanShare = async (planId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  const sharesQuery = query(
    collection(db, "planShares"),
    where("planId", "==", planId),
    where("ownerId", "==", user.uid),
  );

  const sharesSnapshot = await getDocs(sharesQuery);

  for (const share of sharesSnapshot.docs) {
    await updateDoc(share.ref, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  }
};

/**
 * 共有トークンから共有情報を取得する
 * ゲスト用ページで使用
 */
export const getPlanShareByToken = async (token: string) => {
  if (!token || token.length > 200) {
    return null;
  }

  const shareRef = doc(db, "planShares", token);
  const shareSnapshot = await getDoc(shareRef);

  if (!shareSnapshot.exists()) {
    return null;
  }

  const shareData = shareSnapshot.data();

  if (shareData.isActive !== true || shareData.token !== token) {
    return null;
  }

  return {
    plan: {
      id: shareData.planId,
      title: shareData.plan?.title ?? "",
      startDate: shareData.plan?.startDate ?? "",
      endDate: shareData.plan?.endDate ?? "",
    },
    schedules: Array.isArray(shareData.schedules) ? shareData.schedules : [],
  };
};

/**
 * 有効な共有トークンから共有データを取得する
 * ※ ログイン中の所有者向けの関数。
 * ゲスト向けの公開には、別途Firestoreルールの設計が必要。
 */
export const getPlanShareForOwner = async (token: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  if (!token || token.length > 200) {
    return null;
  }

  const shareRef = doc(db, "planShares", token);
  const shareSnapshot = await getDoc(shareRef);

  if (!shareSnapshot.exists()) {
    return null;
  }

  const shareData = shareSnapshot.data();

  if (shareData.isActive !== true || shareData.ownerId !== user.uid) {
    return null;
  }

  const planRef = doc(db, "plans", shareData.planId);
  const planSnapshot = await getDoc(planRef);

  if (!planSnapshot.exists()) {
    return null;
  }

  const planData = planSnapshot.data();

  if (planData.userId !== user.uid) {
    return null;
  }

  const schedulesQuery = query(
    collection(db, "schedules"),
    where("planId", "==", shareData.planId),
    where("userId", "==", user.uid),
  );

  const schedulesSnapshot = await getDocs(schedulesQuery);

  return {
    plan: {
      id: planSnapshot.id,
      title: planData.title,
      startDate: planData.startDate,
      endDate: planData.endDate,
    },
    schedules: schedulesSnapshot.docs.map((scheduleDoc) => {
      const data = scheduleDoc.data();

      return {
        id: scheduleDoc.id,
        day: data.day,
        title: data.title ?? "",
        startTime: data.startTime,
        endTime: data.endTime,
        memo: data.memo ?? "",
      };
    }),
  };
};
