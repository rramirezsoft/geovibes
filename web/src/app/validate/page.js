'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { verifyEmail } from '@/api/auth';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Image from 'next/image';
import Loading from '../components/loading';

const schema = z.object({
  verificationCode: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'El código solo debe contener números'),
});

export default function ValidateEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const inputRefs = useRef([]);
  const email = Cookies.get('pendingEmail');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { verificationCode: '' },
  });

  const code = watch('verificationCode');

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, '');
    if (!val) return;

    const newCode = code.split('');
    newCode[index] = val;
    const joined = newCode.join('').slice(0, 6);
    setValue('verificationCode', joined);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      const newCode = code.split('');
      if (newCode[index]) {
        newCode[index] = '';
        setValue('verificationCode', newCode.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const prevCode = code.split('');
        prevCode[index - 1] = '';
        setValue('verificationCode', prevCode.join(''));
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (!/^\d$/.test(key) && key.length === 1) {
      e.preventDefault(); // Bloquea todo lo que no sea dígito
    }
  };

  const onSubmit = async (data) => {
    setMessage('');
    try {
      const accessToken = Cookies.get('accessToken');
      await verifyEmail(data.verificationCode, accessToken);
      Cookies.remove('accessToken');
      Cookies.remove('pendingEmail');
      router.push('/login');
    } catch (err) {
      const parsed = parseApiError(err);
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  const handleResend = () => {
    // TODO: lógica real de reenvío
    setMessage('Código reenviado.');
    setResendCountdown(30);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-baloo relative">
      {/* Fondo móvil */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/img/validate/bg-mobile.png"
          alt="GeoVibes Mobile Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Columna izquierda */}
      <div className="w-full md:w-1/2 relative flex items-start md:items-center justify-center pt-20 pb-12 px-6 md:p-8">
        {/* Fondo desktop */}
        <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-tr from-[#402103] via-[#2a1d0b] to-[#1c1306]" />

        {/* Brillos decorativos */}
        <div className="hidden md:block absolute top-10 left-10 w-48 h-48 bg-orange-700 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden md:block absolute bottom-16 right-16 w-32 h-32 bg-yellow-800 opacity-20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md space-y-6 text-center">
          <Image
            src="/img/logo/geo.png"
            alt="GeoVibes Logo"
            width={50}
            height={50}
            className="mx-auto mb-2"
          />
          <h1 className="text-4xl">Verifica tu correo</h1>

          <p className="text-md text-orange-200">
            Hemos enviado un código de verificación a <br />
            <span className="text-white">{email || 'tucorreo@example.com'}</span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoFocus={i === 0}
                  required
                  value={code[i] || ''}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="w-12 h-12 text-center rounded-lg bg-[#1f2b3a]/80 text-white text-xl border border-orange-400 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              ))}
            </div>
            {errors.verificationCode && (
              <p className="text-red-400 text-sm">{errors.verificationCode.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#402103] via-[#2a1d0b] to-[#1c1306] text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-xl font-normal flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loading size="sm" /> : 'Verificar código'}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-orange-200">
            ¿No recibiste el código?
            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className="ml-2 text-orange-400 hover:underline disabled:opacity-40"
            >
              {resendCountdown > 0 ? `Reenviar en ${resendCountdown}s` : 'Reenviar código'}
            </button>
          </div>

          {message && (
            <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-md text-sm text-center">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Imagen fondo derecha (desktop) */}
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
