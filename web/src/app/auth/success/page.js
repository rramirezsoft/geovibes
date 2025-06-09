'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Obtenemos el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
      // Guardamos el token en cookie
      Cookies.set('accessToken', accessToken, { secure: true });

      // limpiamos la URL para que no quede el token visible
      window.history.replaceState({}, document.title, '/auth/success');

      // Redirigimos al dashboard
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <p>Cargando sesión...</p>;
}
