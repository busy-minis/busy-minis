"use client";
import React from "react";
import { logout } from "@/utils/supabase/logout";

export default function LogoutButton() {
  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login"; // Redirect to login page after sign-out
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-colors"
    >
      Sign Out
    </button>
  );
}
