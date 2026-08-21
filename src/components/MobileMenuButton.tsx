"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

export function MobileMenuButton({ sidebarId }: { sidebarId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    const sidebar = document.getElementById(sidebarId);
    if (sidebar) {
      sidebar.classList.toggle('hidden');
      setIsOpen(!isOpen);
    }
  };

  return (
    <button
      className="text-white p-2"
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
