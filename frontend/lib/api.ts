const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
