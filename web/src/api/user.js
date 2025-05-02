import { apiResponse } from "@/utils/apiResponse";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

// ENDPOINT: /api/user (GET)
export async function getUser(accessToken) {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    return apiResponse(response, "Error al obtener el usuario");
}