'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-16 pt-16 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        {/* Company Info */}
        <div>
          <Image
            src="/img/logo/geovibes_logo.png"
            alt="GeoVibes Logo"
            width={160}
            height={80}
            className="h-auto mb-4"
          />
          <p className="text-gray-400">GeoVibes SL — Mark your moments, share your journey.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:underline">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="mailto:support@geovibes.com" className="hover:underline">
                support@geovibes.com
              </a>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:underline">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a
                href="https://linkedin.com/in/rramirezsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/rramirezsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaGithub /> GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/rramirezsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaTwitter /> Twitter
              </a>
            </li>
            <li>
              <a
                href="http://rramirezsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaGlobe /> rramirezsoft.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center text-gray-500">
        <p>© {new Date().getFullYear()} GeoVibes SL. All rights reserved.</p>
        <p>
          Developed by{' '}
          <a
            href="https://www.linkedin.com/in/raul-ramirez-adarve/"
            className="text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            rramirezsoft
          </a>
        </p>
      </div>
    </footer>
  );
}
