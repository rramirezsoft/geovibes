import { refreshAccessToken } from "@/api/auth";
import Cookies from "js-cookie";

export async function authFetch(url, options = {}, retry = true) {
  let accessToken = Cookies.get("accessToken");

  // Si no hay access token, intentamos refrescar antes de hacer la petición
  if (!accessToken || accessToken === "undefined") {
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        Cookies.set("accessToken", newAccessToken, {
          secure: true,
          sameSite: "Strict",
        });
        accessToken = newAccessToken;
      } else {
        throw new Error("No se pudo refrescar el token");
      }
    } catch (err) {
      console.error("❌ Error al refrescar el token:", err);
      throw err;
    }
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // Si fue 401 y aún no hemos reintentado, intentamos refrescar y reintentar
  if (response.status === 401 && retry) {
    try {
      const errorData = await response.clone().json();
      const errorMessage = errorData?.error;

      const shouldRefresh = ["NOT_TOKEN", "NOT_AUTHORIZED", "NOT_SESSION"].includes(errorMessage);

      if (shouldRefresh) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken, {
            secure: true,
            sameSite: "Strict",
          });
          return authFetch(url, options, false); // Retry
        }
      }
    } catch (err) {
      console.error("❌ Fallo en el intento de refresh tras 401:", err);
      throw err;
    }
  }

  return response;
}
