const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch wrapper with JWT injection and JSON handling.
 */
export async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Inject JWT token if available
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

/**
 * Save auth data to localStorage.
 */
export function saveAuth(data) {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.name);
    }
}

/**
 * Clear auth data from localStorage.
 */
export function clearAuth() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
    }
}

/**
 * Get current auth state.
 */
export function getAuth() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
        token,
        role: localStorage.getItem("role"),
        name: localStorage.getItem("userName"),
    };
}
