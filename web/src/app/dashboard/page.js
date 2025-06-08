'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getUser } from '@/api/user';
import { logoutUser } from '@/api/auth';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Image from 'next/image';
import Loading from '../components/loading';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('accessToken');

  const handleLogout = async () => {
    try {
      await logoutUser(accessToken);
      Cookies.remove('accessToken');
      router.push('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(accessToken);
        setUser(userData.user);
      } catch (err) {
        const parsed = parseApiError(err);
        setError(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken]);

  if (loading) return <Loading size="lg" overlay />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dashboard</h2>

        <div className="flex items-center justify-center mb-6">
          <Image
            src={user.profilePicture || '/img/placeholder.png'}
            alt="Foto de perfil"
            className="rounded-full object-cover"
            width={128}
            height={128}
            priority
          />
        </div>

        <div className="space-y-4 text-gray-800">
          <div>
            <strong>Nombre:</strong>
            <p>
              {user.name} {user.lastName}
            </p>
          </div>
          <div>
            <strong>Nickname:</strong>
            <p>{user.nickname}</p>
          </div>
          <div>
            <strong>Email:</strong>
            <p>{user.email}</p>
          </div>
          <div>
            <strong>Fecha de nacimiento:</strong>
            <p>{new Date(user.birthDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
