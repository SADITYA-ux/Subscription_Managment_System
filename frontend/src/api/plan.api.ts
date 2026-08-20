import apiRequest from "./apiClient";

export function getAllPlans() {
    return apiRequest("/plans", "GET");
}

export function getPlanById(id: number) {
    return apiRequest(`/plans/${id}`, "GET");
}

export function createPlan(data: { pname: string; duration: number; price: string }) {
    return apiRequest("/plans", "POST", data);
}

export function updatePlan(id: number, data: { pname?: string; duration?: number; price?: string }) {
    return apiRequest(`/plans/${id}`, "PUT", data);
}

export function deletePlan(id: number) {
    return apiRequest(`/plans/${id}`, "DELETE");
}