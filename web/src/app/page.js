"use client";

import Image from "next/image";
import Navbar from "@/app/components/navbar";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/ld-bg-desktop.png"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          priority
        />
        <Image
          src="/img/ld-bg-mobile.png"
          alt="Mobile Background"
          fill
          className="object-cover md:hidden"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white font-baloo">
        <Navbar />

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-[5%]">
          <h2 className="font-bold mb-4 leading-tight break-words">
            <span className="hidden lg:inline text-5xl xl:text-6xl">
              Mark Your Moments, Share Your Journey
            </span>
            <span className="block lg:hidden text-4xl sm:text-5xl md:text-6xl leading-snug">
              Mark Your Moments,<br />
              Share Your Journey
            </span>
          </h2>
          <div className="mb-10 w-full flex justify-center px-6">
            <Image
              src="/img/geovibes_logo.png"
              alt="GeoVibes Logo"
              width={240} 
              height={120}
              className="w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px] xl:w-[240px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 pb-10">
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
