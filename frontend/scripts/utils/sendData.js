export const sendData = async (details, url, token, method) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(url, {
      method: method || "POST",
      headers,
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error or fetch itself failed
      throw new Error("Network error: Unable to reach the server.");
    }
    throw error;
  }
};