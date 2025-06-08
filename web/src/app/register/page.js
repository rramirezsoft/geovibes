'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/api/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '../components/loading';

const schema = z.object({
  nickname: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Nickname inválido'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(16, 'La contraseña no puede superar los 16 caracteres'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('nickname', data.nickname);
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await registerUser(formData);

      if (result.accessToken) {
        Cookies.set('accessToken', result.accessToken, { secure: true });
      }

      router.push('/validate');
    } catch (err) {
      const parsed = parseApiError(err);
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-baloo relative">
      {/* Fondo para móviles (pantalla completa) */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/img/register/bg-mobile.png"
          alt="GeoVibes Earth Mobile"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Parte izquierda: Formulario con fondo degradado (solo desktop) */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8">
        {/* Fondo degradado naranja SOLO en desktop */}
        <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-tr from-[#a84300] via-[#752e00] to-[#2e1300]" />

        {/* Brillos decorativos sutiles */}
        <div className="hidden md:block absolute bottom-10 left-10 w-48 h-48 bg-orange-700 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden md:block absolute top-16 right-16 w-32 h-32 bg-red-800 opacity-20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="text-center">
            <Image
              src="/img/logo/geo.png"
              alt="GeoVibes Logo"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl">Únete a nosotros</h1>
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
              {...register('nickname')}
              className="w-full p-3 rounded-lg bg-[#2b1e1e]/80 text-white border border-orange-500 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.nickname && <p className="text-red-400 text-sm">{errors.nickname.message}</p>}

            <input
              type="email"
              placeholder="Correo electrónico"
              required
              {...register('email')}
              className="w-full p-3 rounded-lg bg-[#2b1e1e]/80 text-white border border-orange-500 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Contraseña"
              required
              {...register('password')}
              className="w-full p-3 rounded-lg bg-[#2b1e1e]/80 text-white border border-orange-500 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#3b1d1b] via-[#2c223b] to-[#181b2c] text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-xl font-normal flex items-center justify-center"
            >
              {isSubmitting ? <Loading size="sm" /> : 'Registrarse'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-orange-500"></div>
            <span className="mx-4 text-orange-300 text-sm">O</span>
            <div className="flex-grow border-t border-orange-500"></div>
          </div>

          <button className="w-full mt-4 bg-black/70 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition">
            <Image
              src="/img/logo/google.png"
              alt="Google Icon"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
              priority
            />
            Regístrate con Google
          </button>

          <p className="text-center text-md text-orange-200 mt-2">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-orange-400 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Parte derecha (desktop): Imagen de fondo */}
      <div className="hidden md:block md:w-1/2 relative h-screen">
        <Image
          src="/img/landing/bg-desktop.png"
          alt="GeoVibes Earth"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>
    </div>
  );
}
