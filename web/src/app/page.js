"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-transparent text-white">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="GeoVibes Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">GeoVibes</h1>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/login" className="hover:underline">Login</a>
          <a href="/register" className="hover:underline">Register</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#features" className="hover:underline">Features</a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 bg-white rounded-md">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {showMenu && (
        <div className="md:hidden bg-white p-4 rounded-md shadow-lg space-y-2">
          <a href="/login" className="block hover:underline">Login</a>
          <a href="/register" className="block hover:underline">Register</a>
          <a href="#about" className="block hover:underline">About</a>
          <a href="#features" className="block hover:underline">Features</a>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Mark Your Moments, Share Your Journey</h2>
        <p className="text-lg md:text-2xl mb-6">Discover and share your experiences around the world with GeoVibes.</p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-3 bg-blue-500 rounded-md text-white hover:bg-blue-600">Login</a>
          <a href="/register" className="px-6 py-3 bg-purple-500 rounded-md text-white hover:bg-purple-600">Register</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="p-8 bg-white rounded-2xl shadow-lg m-4">
        <h3 className="text-3xl font-bold mb-2">About GeoVibes</h3>
        <p>GeoVibes is a platform to mark and share your experiences, whether its a trip, a dinner, or a concert.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="p-8 bg-white rounded-2xl shadow-lg m-4">
        <h3 className="text-3xl font-bold mb-2">Features</h3>
        <ul className="list-disc pl-6">
          <li>Mark locations on the map.</li>
          <li>Share your experiences with photos and stories.</li>
          <li>Explore what others have shared.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 text-white mt-auto">
        <p>&copy; 2025 GeoVibes. Developed by [Tu Nombre].</p>
      </footer>
    </div>
  );
}