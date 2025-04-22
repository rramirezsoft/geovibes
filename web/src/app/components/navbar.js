"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold">GeoVibes</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-md">
        <Link href="/login" className="hover:underline">Login</Link>
        <Link href="/register" className="hover:underline">Register</Link>
        <a href="#about" className="hover:underline">About</a>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 bg-transparent bg-opacity-20 rounded-md"
        >
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden absolute top-16 right-6 bg-white text-black rounded-lg shadow-lg p-4 space-y-2 z-20">
          <Link href="/login" className="block hover:underline" onClick={() => setShowMenu(false)}>Login</Link>
          <Link href="/register" className="block hover:underline" onClick={() => setShowMenu(false)}>Register</Link>
          <a href="#about" className="block hover:underline" onClick={() => setShowMenu(false)}>About</a>
        </div>
      )}
    </nav>
  );
}
