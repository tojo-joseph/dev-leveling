export type User = {
  email: string;
};

const DUMMY_EMAIL = "test@example.com";
const DUMMY_PASSWORD = "Abcd1234@Aceg";
const STORAGE_KEY = "dev-leveling-auth-user";

function isBrowser() {
  return typeof window !== "undefined";
}

export function login(email: string, password: string): User | null {
  if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
    const user: User = { email };
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
