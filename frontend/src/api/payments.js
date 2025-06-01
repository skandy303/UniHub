import { client } from "./constants";

export async function createStripeAccount() {
  const response = await client.post("payments/create");
  return response;
}

export async function connectStripeAccount() {
  const response = await client.post("payments/connect");
  return response;
}

export async function validateStripeAccount(userId) {
  const response = await client.get("payments/validate?user=" + userId);
  return response;
}

export async function createStripeCheckoutSession(listingId) {
  const response = await client.post("payments/checkout?listing=" + listingId);
  return response;
}
