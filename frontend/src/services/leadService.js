import { getApiErrorMessage } from "./apiError.js";

const API_URL = "http://localhost:8000/api";

export async function getLeads() {
  const response = await fetch(`${API_URL}/leads/`);

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to fetch leads"),
    );
  }

  return response.json();
}

export async function createLead(lead) {
  const response = await fetch(`${API_URL}/leads/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to create lead"),
    );
  }

  return response.json();
}

export async function updateLead(id, lead) {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to update lead"),
    );
  }

  return response.json();
}

export async function deleteLead(id) {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to delete lead"),
    );
  }
}

export async function convertLead(id) {
  const response = await fetch(`${API_URL}/leads/${id}/convert`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to convert lead"),
    );
  }

  return response.json();
}
