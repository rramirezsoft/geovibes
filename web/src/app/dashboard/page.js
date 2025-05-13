"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUser } from "@/api/user"; 
import Image from "next/image"; 
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { parseApiError } from "@/utils/parseError";
import { logoutUser } from "@/api/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get("accessToken");

  const handleLogout = async () => {
  try {
    await logoutUser(accessToken); 
    Cookies.remove("accessToken"); 
    router.push("/");
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
};

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("accessToken");
      try {
        const userData = await getUser(accessToken);
        setUser(userData.user);
        setLoading(false);
      } catch (err) {
        const parsed = parseApiError(err);
        setError(ERROR_MESSAGES[parsed] || parsed || ERROR_MESSAGES.DEFAULT);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dashboard</h2>

        <div className="flex items-center justify-center mb-6">
          {/* Foto de perfil */}
          <Image
            src={user.profilePicture || "/img/placeholder.png"}
            alt="Foto de perfil"
            className="rounded-full object-cover"
            width={128}  
            height={128} 
            priority 
          />
        </div>

        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Nombre:</strong>
            <p className="text-gray-900">{user.name} {user.lastName}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Nickname:</strong>
            <p className="text-gray-900">{user.nickname}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Email:</strong>
            <p className="text-gray-900">{user.email}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Fecha de nacimiento:</strong>
            <p className="text-gray-900">{new Date(user.birthDate).toLocaleDateString()}</p>
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
