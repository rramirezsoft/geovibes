'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorCode, setErrorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error') || 'DEFAULT';
    setErrorCode(error);
    setErrorMessage(ERROR_MESSAGES[error] || ERROR_MESSAGES.DEFAULT);

    if (typeof window !== 'undefined' && window.history.replaceState) {
      const cleanUrl = window.location.origin + '/auth/error';
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-baloo relative">
      {/* Fondo móvil */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/img/register/bg-mobile.png"
          alt="GeoVibes Earth Mobile"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contenedor contenido */}
      <div
        className="w-full md:w-1/2 relative flex flex-col items-center justify-center p-8
                      bg-transparent md:bg-gradient-to-tr from-[#a84300] via-[#752e00] to-[#2e1300]"
      >
        <div className="max-w-md w-full space-y-6 text-center">
          <Image
            src="/img/logo/geo.png"
            alt="GeoVibes Logo"
            width={50}
            height={50}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-red-500">Error de autenticación</h1>
          <p className="text-orange-200 text-lg">{errorMessage}</p>
          <button
            onClick={() => router.push('/register')}
            className="mt-6 bg-gradient-to-r from-[#3b1d1b] via-[#2c223b] to-[#181b2c] text-white p-3 rounded-lg shadow-md hover:opacity-90 transition w-full"
          >
            Volver a registrarse
          </button>
        </div>
      </div>

      {/* Imagen lado derecho (desktop) */}
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
