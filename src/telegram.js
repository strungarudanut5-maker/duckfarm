// Returns Telegram WebApp user if running inside Telegram, null otherwise
export function getTelegramUser() {
  try {
    const tg = window.Telegram?.WebApp;
    if (!tg) return null;
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (!user?.id) return null;
    return user; // { id, first_name, last_name, username, language_code }
  } catch {
    return null;
  }
}

export function getTelegramApp() {
  return window.Telegram?.WebApp || null;
}

// Unique player key: Telegram ID if in TG, fallback to localStorage UUID
export function getPlayerId() {
  const tgUser = getTelegramUser();
  if (tgUser) return String(tgUser.id);
  let id = localStorage.getItem("duky_player_id");
  if (!id) {
    id = "local_" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("duky_player_id", id);
  }
  return id;
}
