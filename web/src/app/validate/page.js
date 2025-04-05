"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { verifyEmail } from "@/api/auth";
import { parseApiError } from "@/utils/parseError"; 
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export default function ValidateEmailPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Validando...");

    try {
      await verifyEmail(code, accessToken);
      Cookies.remove("accessToken");
      router.push("/login");
    } catch (err) {
      const message = parseApiError(err);
      setMessage(ERROR_MESSAGES[message] || message || ERROR_MESSAGES.DEFAULT);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verifica tu email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Código de verificación"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
          >
            Verificar
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
