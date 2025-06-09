'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '../components/loading';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña inválida'),
});

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const oAuthUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;

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
      const result = await loginUser(data);

      if (result.accessToken) {
        Cookies.set('accessToken', result.accessToken, {
          secure: true,
          sameSite: 'None',
          expires: 1 / 12,
        });
        router.push('/dashboard');
      }
    } catch (err) {
      const parsed = parseApiError(err);
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-baloo relative">
      {/* Fondo para móviles */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/img/login/bg-mobile.png"
          alt="GeoVibes Earth Mobile"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Parte izquierda: Formulario */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8">
        {/* Fondo degradado SOLO en desktop */}
        <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-tr from-[#001f4d] via-[#1d1a3b] to-[#0d102f]" />

        {/* Brillos decorativos sutiles */}
        <div className="hidden md:block absolute bottom-10 left-10 w-48 h-48 bg-blue-700 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden md:block absolute top-16 right-16 w-32 h-32 bg-purple-800 opacity-20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="text-center">
            <Image
              src="/img/logo/geo.png"
              alt="GeoVibes Logo"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl">Inicia sesión</h1>
          </div>

          {message && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              {...register('email')}
              className="w-full p-3 rounded-lg bg-[#1f2b3a]/80 text-white border border-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Contraseña"
              required
              {...register('password')}
              className="w-full p-3 rounded-lg bg-[#1f2b3a]/80 text-white border border-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#1d274d] via-[#2c223b] to-[#181b2c] text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-xl font-normal flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? <Loading size="sm" /> : 'Entrar'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-blue-500"></div>
            <span className="mx-4 text-blue-300 text-sm">O</span>
            <div className="flex-grow border-t border-blue-500"></div>
          </div>

          <button
            className="w-full mt-4 bg-black/70 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
            onClick={() => (window.location.href = oAuthUrl)}
          >
            <Image
              src="/img/logo/google.png"
              alt="Google Icon"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
              priority
            />
            Inicia sesión con Google
          </button>

          <p className="text-center text-md text-blue-200 mt-4">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="text-center text-sm text-blue-300 mt-2">
            <Link href="/forgot-password" className="hover:underline">
              ¿Olvidaste tu contraseña?
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
