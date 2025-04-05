export function apiResponse(response, fallbackMessage = "Ocurrió un error inseperado") {
    return response.json().then((data) => {
      if (!response.ok) {
        const firstError = data.errors?.[0]?.msg;
        const error = new Error(firstError || data.message || fallbackMessage);
        error.status = response.status;
        error.errors = data.errors || [];
        throw error;
      }
      return data;
    });
  }
  