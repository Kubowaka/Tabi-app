import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "あなたのAPIキー",
  authDomain: "あなたのプロジェクト.firebaseapp.com",
  projectId: "あなたのプロジェクトID",
  storageBucket: "あなたのプロジェクト.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXXXXXX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);