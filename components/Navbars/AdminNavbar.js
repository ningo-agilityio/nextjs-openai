import React from "react";
import Link from "next/link";
import Image from 'next/image';

export default function Navbar({ user }) {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            OpenAI Blog
          </a>
          {/* User */}
          {
            !!user ?
            <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
              <div className="items-center flex">
                <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                  <Image 
                    src={user.picture || "https://placehold.co/50x50/png"} 
                    alt={user.name || "User Avatar"} 
                    width={50} 
                    height={50}
                    className="w-full rounded-full align-middle border-none shadow-lg"
                  ></Image>
                </span>
              </div>
              <Link href="/api/auth/logout" className="text-white text-sm font-semibold px-4">Logout</Link>
            </ul>
          :
            <Link href="/api/auth/login">Login</Link>
          }
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
