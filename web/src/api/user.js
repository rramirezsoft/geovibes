import { apiResponse } from '@/utils/apiResponse';
import { authFetch } from '@/utils/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';

// ENDPOINT: /api/user (GET)
export async function getUser() {
  const response = await authFetch(`${API_BASE_URL}/user`, {
    method: 'GET',
  });

  return apiResponse(response, 'Error al obtener el usuario');
}
