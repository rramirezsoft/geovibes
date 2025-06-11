'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Loading from '@/app/components/loading';

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
      Cookies.set('accessToken', accessToken, {
        secure: true,
        sameSite: 'None',
        expires: 1 / 12,
      });

      // Limpiar URL para que no quede el token visible
      window.history.replaceState({}, document.title, '/auth/success');

      // Redirigir al dashboard
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="relative w-full h-screen">
      {/* Fondo */}
      <Image
        src="/img/landing/bg-desktop.png"
        alt="Fondo Desktop"
        fill
        className="object-cover hidden md:block"
        priority
      />
      <Image
        src="/img/landing/bg-mobile.png"
        alt="Fondo Mobile"
        fill
        className="object-cover md:hidden"
        priority
      />

      {/* Capa oscura encima */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Spinner centrado */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    </div>
  );
}
