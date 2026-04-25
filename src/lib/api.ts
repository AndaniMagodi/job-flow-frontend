const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

console.log("API URL:", BASE_URL);

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Something went wrong");
  }

  return res.json();
}

export const api = {
  get:    <T>(url: string)                => request<T>(url),
  post:   <T>(url: string, body: unknown) => request<T>(url, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(url: string, body: unknown) => request<T>(url, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  <T>(url: string, body: unknown) => request<T>(url, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(url: string)               => request<T>(url, { method: "DELETE" }),
};