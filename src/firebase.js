import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";

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

export async function createStarsInvoice(packName, pack) {
  const BOT_TOKEN = process.env.REACT_APP_TG_BOT_TOKEN;
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `${packName} Coin Pack`,
      description: `${pack.coins} coins + bonuses for Duky Farm`,
      payload: packName,
      currency: "XTR",
      prices: [{ label: packName, amount: pack.stars }],
      provider_token: "",
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
  return data.result;
}

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

export async function saveTournamentScore(telegramId, name, dailyScore, weeklyScore) {
  const ref = doc(db, "tournament", String(telegramId));
  await setDoc(ref, {
    telegramId: String(telegramId),
    name: name || "Duck Farmer",
    dailyScore:  Math.floor(dailyScore  || 0),
    weeklyScore: Math.floor(weeklyScore || 0),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function fetchLeaderboard(type = "daily", maxPlayers = 20) {
  const field = type === "weekly" ? "weeklyScore" : "dailyScore";
  const q = query(collection(db, "tournament"), orderBy(field, "desc"), limit(maxPlayers));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
