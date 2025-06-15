'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getUser, uploadProfilePicture } from '@/api/user';
import { logoutUser } from '@/api/auth';
import { parseApiError } from '@/utils/parseError';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import Image from 'next/image';
import Loading from '../components/loading';
import { FaSignOutAlt, FaEnvelope, FaUser, FaUserTag } from 'react-icons/fa';
import CropModal from './components/cropModal';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file) setSelectedFile(file);

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const updatedData = await uploadProfilePicture(formData);
      setUser(updatedData.user); // actualiza el usuario con la nueva foto
    } catch (err) {
      console.error('❌ Error al subir la foto de perfil:', err);
      alert('Hubo un problema al subir la imagen.');
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Sidebar de perfil */}
        <aside className="bg-[#1f2937] rounded-xl shadow-lg p-6 flex flex-col items-center text-center space-y-4">
          <div
            className="relative w-32 h-32 rounded-full p-1"
            style={{
              border: '3px solid #d1d5db',
              backgroundClip: 'padding-box',
              backgroundColor: 'transparent',
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={user.profilePicture || '/img/placeholder.png'}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="object-cover w-full h-full rounded-full"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              id="profilePictureInput"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            <label
              htmlFor="profilePictureInput"
              className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100 transition"
              title="Cambiar foto de perfil"
            >
              {/* Icono cámara */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{user.nickname}</h2>
            <p className="text-sm text-blue-300">
              {user.name} {user.lastName}
            </p>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <FaEnvelope /> {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white flex items-center gap-2"
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </aside>

        {/* Área principal (actividades futuras) */}
        <main className="md:col-span-2 bg-[#111827] rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Bienvenido, {user.nickname} 👋</h1>

          {/* Contenido futuro del feed o estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-[#1f2937] p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Actividad reciente</h2>
              <p className="text-gray-400 text-sm">
                Aquí podrías ver tus publicaciones, likes, etc.
              </p>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
              <p className="text-gray-400 text-sm">N° de amigos, posts, interacciones...</p>
            </div>
          </div>
        </main>
      </div>
      {selectedFile && (
        <CropModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onCropComplete={async (croppedFile) => {
            const formData = new FormData();
            formData.append('profilePicture', croppedFile);

            try {
              const updatedData = await uploadProfilePicture(formData);
              setUser(updatedData.user);
            } catch (err) {
              alert('Error al subir imagen recortada');
              console.error(err);
            }
          }}
        />
      )}
    </div>
  );
}
