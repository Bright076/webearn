import { Logo } from "@/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-sidebar text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo size="sm" />
            <p className="text-white/80 mt-4">
              Professional web development with rewarding affiliate opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
              <li><Link href="/get-a-website" className="hover:text-white">Get a Website</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Affiliates</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
              <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2026 WebEarn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
