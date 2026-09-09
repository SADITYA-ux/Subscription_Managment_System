async function apiRequest(path: string, method: string, body?: object) {
    const token = localStorage.getItem("token");
    const baseUrl = "http://localhost:3000/api";
    const url = baseUrl + path;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

export default apiRequest;