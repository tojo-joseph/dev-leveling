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
    const res = await axios.post(API_URL + path, data, {
      withCredentials: true,
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function logout(path: string, data: object) {
  const options = { withCredentials: true };

  try {
    const res = await axios.post(API_URL + path, data, options);
    console.log(res);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// export function getCurrentUser(): User | null {
//   if (!isBrowser()) return null;
//   const raw = window.localStorage.getItem(STORAGE_KEY);
//   if (!raw) return null;
//   try {
//     return JSON.parse(raw) as User;
//   } catch {
//     return null;
//   }
// }
