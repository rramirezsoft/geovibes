"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { verifyEmail } from "@/api/auth";
import { parseApiError } from "@/utils/parseError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const schema = z.object({
  verificationCode: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código solo debe contener números"),
});

export default function ValidateEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setMessage("Validando...");
    const accessToken = Cookies.get("accessToken");
    try {
      await verifyEmail(data.verificationCode, accessToken);
      Cookies.remove("accessToken");
      router.push("/login");
    } catch (err) {
      const parsed = parseApiError(err);
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verifica tu email
        </h2>

        {message && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Código de verificación"
            {...register("verificationCode")}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.verificationCode && (
            <p className="text-red-500 text-sm">
              {errors.verificationCode.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
}
