"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { signUpAction } from "./actions";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const result = await signUpAction(data.fullName, data.email, data.password);

    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    } else if (result?.message) {
      // Email confirmation required
      setSuccessMessage(result.message);
      setIsLoading(false);
    } else if (result?.success) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-accent text-white">Affiliate Program</Badge>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Start Earning <span className="text-primary">30%</span> Commission
              </h1>
              <p className="text-lg text-muted">
                Join our affiliate program and earn generous commissions by referring clients who need professional websites.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">High Commission Rates</h3>
                  <p className="text-muted text-sm">Earn 30% on every project you refer - up to ₦360,000 per sale</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Real-Time Dashboard</h3>
                  <p className="text-muted text-sm">Track your referrals, earnings, and commissions in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Fast Payouts</h3>
                  <p className="text-muted text-sm">Withdraw your earnings anytime with a minimum of ₦5,000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Marketing Support</h3>
                  <p className="text-muted text-sm">Get access to professional marketing materials and resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full">
          <div className="bg-white border border-border rounded-lg p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-muted">
                Start earning commissions today. It's free!
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg">
                <p className="text-sm text-primary">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <p className="text-xs text-muted mt-1">Must be at least 8 characters</p>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <Label htmlFor="terms" className="text-sm text-muted">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-600 -mt-3">{errors.terms.message}</p>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mt-8 pt-8 border-t border-border space-y-4">
              <p className="text-sm font-semibold text-foreground">Why join?</p>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted">Earn 30% commission per sale</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted">Real-time earnings tracking</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted">Fast payouts (minimum ₦5,000)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted">Marketing materials included</span>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted hover:text-primary transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
