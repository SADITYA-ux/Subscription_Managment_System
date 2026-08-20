import apiRequest from "./apiClient";

export function getAllClients() {
    return apiRequest("/clients", "GET");
}

export function getClientById(id: number) {
    return apiRequest(`/clients/${id}`, "GET");
}

export function updateClient(id: number, data: { name?: string; address?: string; number?: string; age?: number }) {
    return apiRequest(`/clients/${id}`, "PUT", data);
}

export function deleteClient(id: number) {
    return apiRequest(`/clients/${id}`, "DELETE");
}