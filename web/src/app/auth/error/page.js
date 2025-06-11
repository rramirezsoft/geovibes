import { Suspense } from 'react';
import AuthErrorClient from './components/authErrorClient';
import Image from 'next/image';
import Loading from '@/app/components/loading';

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
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

          {/* Panel izquierdo */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center p-8">
            <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-tr from-[#a84300] via-[#752e00] to-[#2e1300]" />

            <div className="hidden md:block absolute bottom-10 left-10 w-48 h-48 bg-orange-700 opacity-20 rounded-full blur-3xl animate-pulse" />
            <div className="hidden md:block absolute top-16 right-16 w-32 h-32 bg-red-800 opacity-20 rounded-full blur-2xl animate-pulse" />

            {/* Spinner */}
            <div className="relative z-10 bg-black/40 rounded-lg p-10">
              <Loading size="lg" />
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
      }
    >
      <AuthErrorClient />
    </Suspense>
  );
}
