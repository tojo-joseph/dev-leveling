import axios from "axios";

export type User = {
  email: string;
};

const STORAGE_KEY = "dev-leveling-auth-user";

const API_URL = "http://localhost:5000/api/";

function isBrowser() {
  return typeof window !== "undefined";
}

export async function login(path: string, data: object) {
  try {
    const res = await axios.post(API_URL + path, data);
    console.log(res);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function logout(path: string, data: object) {
  const accessToken = localStorage.getItem("accessToken");
  const headers = { Authorization: accessToken };
  const options = { headers: headers };

  try {
    const res = await axios.post(API_URL + path, data, options);
    console.log(res);
    localStorage.removeItem("accessToken");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
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
