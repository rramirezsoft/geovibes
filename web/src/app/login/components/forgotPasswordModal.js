'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestPasswordReset } from '@/api/auth';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Loading from '@/app/components/loading';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isOpen) {
      setStatus(null);
      setMessage('');
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async ({ email }) => {
    setStatus(null);
    setMessage('');
    try {
      await requestPasswordReset(email);
      setStatus('success');
      setMessage('Te hemos enviado un correo con instrucciones para restablecer tu contraseña.');
      reset();
    } catch (err) {
      const parsed = parseApiError(err);
      setStatus('error');
      setMessage(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1f2b3a] text-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-4 text-white text-xl hover:text-red-400"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">¿Olvidaste tu contraseña?</h2>
        <p className="text-sm text-blue-300 mb-4 text-center">
          Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
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

        {status === 'success' ? (
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-lg font-normal"
          >
            Cerrar
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              {...register('email')}
              className="w-full p-3 rounded-lg bg-[#2b3c4d]/90 text-white border border-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#1d274d] via-[#2c223b] to-[#181b2c] text-white p-3 rounded-lg transition-all hover:opacity-90 shadow-md text-lg font-normal flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? <Loading size="sm" /> : 'Enviar correo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
