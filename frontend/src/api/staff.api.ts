import apiRequest from "./apiClient";

export function createStaff(data: { email: string; password: string; name: string; age: number; address: string; phone: string }) {
    return apiRequest("/staff", "POST", data);
}

export function getAllStaff() {
    return apiRequest("/staff", "GET");
}

export function getStaffById(id: number) {
    return apiRequest(`/staff/${id}`, "GET");
}

export function deactivateStaff(id: number) {
    return apiRequest(`/staff/${id}`, "DELETE");
}