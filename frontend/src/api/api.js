const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getCustomers() {
  const response = await fetch(`${API_BASE_URL}/customers/`);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}

export async function getLeads() {
  const response = await fetch(`${API_BASE_URL}/leads/`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
}

export async function getDeals() {
  const response = await fetch(`${API_BASE_URL}/deals/`);

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  return response.json();
}
