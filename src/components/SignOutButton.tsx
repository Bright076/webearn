"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Sign Out
      </Button>
    </form>
  );
}
