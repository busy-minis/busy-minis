"use client";
import React from "react";
import { logout } from "@/utils/supabase/logout";
export default function Logout() {
  return (
    <button
      onClick={handleSignOut}
      className="px-5 py-2 text-sm bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition duration-300"
    >
      Sign Out
    </button>
  );
}

const handleSignOut = async () => {
  await logout();
  window.location.href = "/login"; // Redirect to login page after sign-out
};
