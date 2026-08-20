import apiRequest from "./apiClient";

export function createPayment(data: { subid: number; amount: string; portal: string; accountno?: string; status?: string }) {
    return apiRequest("/payments", "POST", data);
}

export function getAllPayments() {
    return apiRequest("/payments", "GET");
}

export function getPaymentById(id: number) {
    return apiRequest(`/payments/${id}`, "GET");
}

export function getPaymentsBySubscription(subId: number) {
    return apiRequest(`/payments/subscription/${subId}`, "GET");
}

export function updatePayment(id: number, data: { status?: string; amount?: string; portal?: string; accountno?: string }) {
    return apiRequest(`/payments/${id}`, "PUT", data);
}