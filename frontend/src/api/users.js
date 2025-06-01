import { client } from "./constants";

export async function userLogout() {
  const response = await client.get("accounts/logout");
  return response;
}

export async function userLogin(token) {
  const response = await client.post("accounts/login", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { user: response.data };
}

export async function getCurrentUserId() {
  const response = await client.get("accounts/me");
  return response.data.userId;
}
