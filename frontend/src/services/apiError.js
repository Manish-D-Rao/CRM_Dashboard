export async function getApiErrorMessage(response, fallbackMessage) {
  try {
    const body = await response.json();
    const detail = body?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = detail.map((issue) => issue?.msg).filter(Boolean);
      if (messages.length > 0) {
        return messages.join("; ");
      }
    }
  } catch {
    // Fall back when the response body is not valid JSON.
  }

  return fallbackMessage;
}
