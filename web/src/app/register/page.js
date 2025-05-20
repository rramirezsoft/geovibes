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
import Image from "next/image";
import Link from "next/link";

const schema = z.object({
  nickname: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Nickname inválido"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0c2a] text-white font-baloo">
      {/* Left - Formulario con fondo degradado */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-8 overflow-hidden">
        {/* Fondo degradado animado para escritorio */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-[#1a1a3d] via-[#14142a] to-[#0b0c2a] opacity-70 blur-sm z-0" />
        {/* Efecto decorativo (líneas o brillos sutiles) */}
        <div className="hidden md:block absolute top-10 left-10 w-40 h-40 bg-purple-800 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden md:block absolute bottom-10 right-10 w-32 h-32 bg-blue-700 opacity-20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="text-center">
            <Image
              src="/img/geovibes_logo.png"
              alt="GeoVibes Logo"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
          </div>

          {message && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Nickname"
              required
              {...register("nickname")}
              className="w-full p-3 rounded-lg bg-[#1c1d3d] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nickname && (
              <p className="text-red-400 text-sm">{errors.nickname.message}</p>
            )}

            <input
              type="email"
              placeholder="Correo electrónico"
              required
              {...register("email")}
              className="w-full p-3 rounded-lg bg-[#1c1d3d] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              required
              {...register("password")}
              className="w-full p-3 rounded-lg bg-[#1c1d3d] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white p-3 rounded-lg font-semibold transition-all"
            >
              Registrarse
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400 text-sm">O</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button className="w-full mt-4 bg-black text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition">
            <Image
              src="/img/google.png"
              alt="Google Icon"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
              priority
            />
            Regístrate con Google
          </button>

          <p className="text-center text-sm text-gray-300 mt-2">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Imagen con overlay oscuro */}
      <div className="hidden md:block md:w-1/2 relative h-screen">
        <Image
          src="/img/ld-bg-desktop.png"
          alt="GeoVibes Earth"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
