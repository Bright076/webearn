"use client";

import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  businessName: z.string().optional(),
  websiteType: z.string().min(1, "Please select a website type"),
  budget: z.string().min(1, "Please select a budget range"),
  projectDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function GetAWebsitePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to submit request");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <MarketingNav />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white border border-border rounded-lg p-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
                Request Received!
              </h1>
              <p className="text-muted mb-6">
                Thank you for your interest. We'll reach out to you on WhatsApp within 24 hours to discuss your project.
              </p>
              <Button asChild className="w-full">
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MarketingNav />
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-border rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
                Get Your Professional Website
              </h1>
              <p className="text-muted">
                Fill out the form below and we'll reach out to discuss your project and provide a quote.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className="mt-1.5"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  {...register("whatsappNumber")}
                  className="mt-1.5"
                />
                {errors.whatsappNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.whatsappNumber.message}</p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="mt-1.5"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Business Name (Optional) */}
              <div>
                <Label htmlFor="businessName">Business Name (Optional)</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your Business Name"
                  {...register("businessName")}
                  className="mt-1.5"
                />
              </div>

              {/* Website Type */}
              <div>
                <Label htmlFor="websiteType">Website Type *</Label>
                <select
                  id="websiteType"
                  {...register("websiteType")}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select a type</option>
                  <option value="business">Business Website</option>
                  <option value="ecommerce">E-Commerce Store</option>
                  <option value="portfolio">Portfolio Website</option>
                  <option value="blog">Blog/News Website</option>
                  <option value="landing">Landing Page</option>
                  <option value="custom">Custom Project</option>
                </select>
                {errors.websiteType && (
                  <p className="text-sm text-red-600 mt-1">{errors.websiteType.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget">Budget Range *</Label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select a range</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000-5000">$2,000 - $5,000</option>
                  <option value="over-5000">Over $5,000</option>
                </select>
                {errors.budget && (
                  <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <Label htmlFor="projectDescription">Project Description (Optional)</Label>
                <textarea
                  id="projectDescription"
                  {...register("projectDescription")}
                  rows={4}
                  placeholder="Tell us more about your project..."
                  className="mt-1.5 flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>

              <p className="text-xs text-muted text-center">
                By submitting this form, you agree to be contacted via WhatsApp regarding your project.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
