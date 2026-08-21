import { z } from "zod"

// Auth validations
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Referral validations
export const referralCodeSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/, "Invalid referral code format"),
})

// Request validations
export const websiteRequestSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  description: z.string().min(10, "Please provide more details about your project"),
  budget: z.string().optional(),
  referralCode: z.string().optional(),
})

// Withdrawal validations
export const withdrawalRequestSchema = z.object({
  amount: z.number().min(50, "Minimum withdrawal amount is $50"),
  paymentMethod: z.enum(["paypal", "bank_transfer", "other"]),
  paymentDetails: z.string().min(5, "Payment details are required"),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ReferralCodeInput = z.infer<typeof referralCodeSchema>
export type WebsiteRequestInput = z.infer<typeof websiteRequestSchema>
export type WithdrawalRequestInput = z.infer<typeof withdrawalRequestSchema>
