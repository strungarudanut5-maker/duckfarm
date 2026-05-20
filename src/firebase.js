import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function loadPlayerData(telegramId) {
  const ref = doc(db, "players", String(telegramId));
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function savePlayerData(telegramId, data) {
  const ref = doc(db, "players", String(telegramId));
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function createPlayer(telegramId, telegramUser) {
  const ref = doc(db, "players", String(telegramId));
  await setDoc(ref, {
    telegramId: String(telegramId),
    name: telegramUser.first_name || "Duck Farmer",
    username: telegramUser.username || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
