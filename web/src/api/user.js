'use server';

import { apiResponse } from "@/utils/apiResponse";

const API_BASE_URL = process.env.BACKEND_URL;

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