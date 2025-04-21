"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/api/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseApiError } from "@/utils/parseError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const schema = z.object({
  nickname: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Nickname inválido"),
  email: z.string().email("Email inválido"),
  password: z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(16, "La contraseña no puede superar los 16 caracteres"),
});

export default function RegisterPage() {
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
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await registerUser(formData);

      if (result.accessToken) {
        Cookies.set("accessToken", result.accessToken, { secure: true });
      }

      router.push("/validate");
    } catch (err) {
      const parsed = parseApiError(err);
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Únete a GeoVibes</h2>

        {message && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Nickname"
            {...register("nickname")}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
