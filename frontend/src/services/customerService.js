import { getApiErrorMessage } from "./apiError.js";

const API_URL = "http://localhost:8000/api";

export async function getCustomers() {
  const response = await fetch(`${API_URL}/customers/`);

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to fetch customers"),
    );
  }

  return response.json();
}

export async function createCustomer(customer) {
  const response = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to create customer"),
    );
  }

  return response.json();
}

export async function updateCustomer(id, customer) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to update customer"),
    );
  }

  return response.json();
}

export async function deleteCustomer(id) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Failed to delete customer"),
    );
  }
}
