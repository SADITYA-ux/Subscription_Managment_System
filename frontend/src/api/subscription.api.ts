import apiRequest from "./apiClient";

export function createSubscription(data: { clientid: number; planid: number; startDate: string }) {
    return apiRequest("/subscriptions", "POST", data);
}

export function getAllSubscriptions() {
    return apiRequest("/subscriptions", "GET");
}

export function getSubscriptionById(id: number) {
    return apiRequest(`/subscriptions/${id}`, "GET");
}

export function getSubscriptionsByClient(clientId: number) {
    return apiRequest(`/subscriptions/client/${clientId}`, "GET");
}

export function updateSubscription(id: number, data: { planid: number }) {
    return apiRequest(`/subscriptions/${id}`, "PUT", data);
}

export function editSubscription(id: number, data: { startDate?: string; endDate?: string; status?: string }) {
    return apiRequest(`/subscriptions/edit/${id}`, "PUT", data);
}

export function deleteSubscription(id: number) {
    return apiRequest(`/subscriptions/${id}`, "DELETE");
}