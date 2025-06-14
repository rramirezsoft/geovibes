'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/api/auth';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { parseApiError } from '@/utils/parseError';
import Loading from '@/app/components/loading';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(16, 'La contraseña no puede exceder los 16 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Obtener y limpiar token/email de la URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);

      // Eliminar parámetros de la URL sin recargar
      const cleanUrl = window.location.origin + '/reset-password';
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setStatus(null);
    setMessage('');
    try {
      await resetPassword({ token, password: data.password });
      setStatus('success');
      setMessage('Contraseña actualizada con éxito. Redirigiendo...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      const parsed = parseApiError(err);
      setStatus('error');
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a2b] flex items-center justify-center px-4 font-baloo">
      <div className="bg-[#1f2b3a] text-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Restablecer contraseña</h1>
        <p className="text-sm text-blue-300 text-center mb-6">
          Ingresa una nueva contraseña para tu cuenta <strong>{email}</strong>
        </p>

        {message && (
          <div
            className={`text-sm p-3 rounded-md mb-4 text-center ${
              status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              required
              {...register('password')}
              className="w-full p-3 pr-10 rounded-lg bg-[#2b3c4d]/90 text-white border border-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-blue-300 hover:text-blue-100"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              required
              {...register('confirmPassword')}
              className="w-full p-3 pr-10 rounded-lg bg-[#2b3c4d]/90 text-white border border-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-blue-300 hover:text-blue-100"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1d274d] via-[#2c223b] to-[#181b2c] text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-lg font-normal flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loading size="sm" /> : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
