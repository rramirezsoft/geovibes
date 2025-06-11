'use client';

import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaUserPlus, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 relative z-50 text-white font-baloo">
      {/* Logo */}
      <div className="text-2xl font-bold">GeoVibes</div>

      {/* Desktop */}
      <div className="hidden md:flex space-x-8 text-md items-center">
        <Link href="/login" className="hover:underline hover:text-blue-300 transition-colors">
          Login
        </Link>
        <Link href="/register" className="hover:underline hover:text-purple-300 transition-colors">
          Register
        </Link>
        <a href="#about" className="hover:underline hover:text-gray-300 transition-colors">
          About
        </a>
      </div>

      {/* Menu hamburguesa */}
      <div className="md:hidden z-50">
        <button
          onClick={() => setShowMenu(true)}
          className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          <FaBars className="text-2xl text-white" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[65%] max-w-[240px] z-50 transform transition-transform duration-300 ease-in-out bg-[#0e1a2bf2] backdrop-blur-md ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Boton de cerrar */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowMenu(false)}
            className="text-white text-2xl hover:text-gray-300 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Header Logo */}
        <Link
          href="/"
          onClick={() => setShowMenu(false)}
          className="flex items-center px-6 space-x-3 mb-4"
        >
          <Image
            src="/img/logo/geo.png"
            alt="GeoVibes Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-white text-xl">GeoVibes</span>
        </Link>

        <hr className="border-gray-600 mx-6 mb-4" />

        {/* Sidebar */}
        <div className="flex flex-col px-6 text-white text-md">
          <Link
            href="/login"
            onClick={() => setShowMenu(false)}
            className="flex items-center space-x-3 py-2 hover:text-blue-400 transition-colors"
          >
            <FaUser />
            <span>Login</span>
          </Link>
          <hr className="border-gray-700/40 my-1" />

          <Link
            href="/register"
            onClick={() => setShowMenu(false)}
            className="flex items-center space-x-3 py-2 hover:text-purple-400 transition-colors"
          >
            <FaUserPlus />
            <span>Register</span>
          </Link>
          <hr className="border-gray-700/40 my-1" />

          <a
            href="#about"
            onClick={() => setShowMenu(false)}
            className="flex items-center space-x-3 py-2 hover:text-gray-300 transition-colors"
          >
            <FaInfoCircle />
            <span>About us</span>
          </a>
        </div>
      </div>

      {/* Blur overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
        />
      )}
    </nav>
  );
}
