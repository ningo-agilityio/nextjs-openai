import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client'

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

export default function Admin({ children, availableTokens, posts, postId }) {
  const { user } = useUser()
  return (
    <>
      <Sidebar availableTokens={availableTokens} posts={posts} />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar user={user} />
        {/* Header */}
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12 h-screen">
          <div className="px-4 md:px-10">
            {
              user ? children : <span className="text-red-600 text-lg uppercase hidden lg:inline-block font-bold">You don't have permission access!</span>
            }
          </div>
        </div>
      </div>
    </>
  );
}
