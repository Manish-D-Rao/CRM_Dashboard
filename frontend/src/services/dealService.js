import { getApiErrorMessage } from "./apiError.js";

const API_URL = "http://localhost:8000/api";

export async function getDeals() {
  const response = await fetch(`${API_URL}/deals/`);

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to fetch deals"),
    );
  }

  return response.json();
}

export async function createDeal(deal) {
  const response = await fetch(`${API_URL}/deals/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deal),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to create deal"),
    );
  }

  return response.json();
}

export async function updateDeal(id, deal) {
  const response = await fetch(`${API_URL}/deals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deal),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to update deal"),
    );
  }

  return response.json();
}

export async function deleteDeal(id) {
  const response = await fetch(`${API_URL}/deals/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to delete deal"),
    );
  }
}
