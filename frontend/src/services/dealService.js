const API_URL = "http://localhost:8000/api";

export async function getDeals() {
  const response = await fetch(`${API_URL}/deals/`);

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  return response.json();
}
