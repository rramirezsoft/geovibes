'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaInstagram, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0e1a2b] text-white px-6 md:px-12 pt-16 pb-10 font-baloo">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Image
            src="/img/logo/geovibes_logo.png"
            alt="GeoVibes Logo"
            width={180}
            height={90}
            className="h-auto"
          />
          <p className="text-gray-400 text-sm">
            GeoVibes SL — Mark your moments, share your journey.
          </p>
        </div>

        {/* Navegacion */}
        <div className="space-y-2">
          <h4 className="text-white text-base font-semibold mb-2">Explore</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition-colors">
                Register
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-white transition-colors">
                About us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-2">
          <h4 className="text-white text-base font-semibold mb-2">Legal</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto + Redes sociales */}
        <div className="space-y-3">
          <h4 className="text-white text-base font-semibold mb-2">Connect</h4>
          <p className="text-gray-300 text-sm">
            <a href="mailto:support@geovibes.com" className="hover:underline">
              support@geovibes.com
            </a>
          </p>
          <div className="flex space-x-4 text-xl text-gray-400">
            <a
              href="https://linkedin.com/in/rramirezsoft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/rramirezsoft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaGithub />
            </a>
            <a>
              <FaInstagram />
            </a>
            <a
              href="http://rramirezsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaGlobe />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} GeoVibes SL. All rights reserved.</p>
        <p className="mt-1">
          Developed by{' '}
          <a
            href="https://www.linkedin.com/in/raul-ramirez-adarve/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            rramirezsoft
          </a>
        </p>
      </div>
    </footer>
  );
}
