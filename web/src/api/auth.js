'use server';

import { apiResponse } from "@/utils/apiResponse";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

// ENDPOINT: /api/auth/register
export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nickname: formData.get("nickname"),
            email: formData.get("email"),
            password: formData.get("password"),
        })
    });
    const data = await apiResponse(response, "Error al registrar usuario");
    const accessToken = response.headers.get("Authorization")?.split(" ")[1];
    return { ...data, accessToken };
}

// ENDPOINT: /api/auth/vailidate
export async function verifyEmail(verificationCode, accessToken) {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ verificationCode })
    });

    return apiResponse(response, "Error al verificar el email");
}

// ENDPOINT: /api/auth/login
export async function loginUser({ email, password }) {
    console.log("API_BASE_URL", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    });

    const data = await apiResponse(response, "Error al iniciar sesión");
    const accessToken = response.headers.get('Authorization')?.split(' ')[1];
    return { ...data, accessToken };
}

