import apiRequest from "./apiClient";

export function createStaff(data: { email: string; password: string; name: string; age: number; address: string; phone: string }) {
    return apiRequest("/staff", "POST", data);
}

export function getAllStaff() {
    return apiRequest("/staff", "GET");
}

export function updateStaff(id: number, data: { name?: string; address?: string; phone?: string; age?: number }) {
    return apiRequest(`/staff/${id}`, "PUT", data);
}

export function getStaffById(id: number) {
    return apiRequest(`/staff/${id}`, "GET");
}

export function deactivateStaff(id: number) {
    return apiRequest(`/staff/${id}`, "PUT");
}