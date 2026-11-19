import { MarketingNav } from "@/components/marketing/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | WebEarn",
  description: "Get in touch with WebEarn. We're here to help with your website needs or answer questions about our affiliate program.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="default" className="mb-4">
            <MessageSquare className="w-3 h-3 mr-2" />
            Get in Touch
          </Badge>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Have questions about our services or affiliate program? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Email</h3>
                <a 
                  href="mailto:oguchidubem52@gmail.com"
                  className="text-primary hover:underline text-sm"
                >
                  oguchidubem52@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-success/10 mb-4">
                  <Clock className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-muted">Within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Availability</h3>
                <p className="text-sm text-muted">Worldwide</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Support</h3>
                <p className="text-sm text-muted">7 days a week</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Contact Card */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Primary Email</h3>
                      <a 
                        href="mailto:oguchidubem52@gmail.com"
                        className="text-primary hover:underline flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        oguchidubem52@gmail.com
                      </a>
                      <p className="text-sm text-muted mt-2">
                        For general inquiries, website requests, and affiliate program questions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">What to include in your message:</h3>
                <ul className="space-y-2 text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Your name and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Whether you're interested in services or the affiliate program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>A brief description of your inquiry or project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Any specific questions you'd like answered</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                Quick Links
              </h2>

              <div className="space-y-4">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Need a Website?</h3>
                    <p className="text-sm text-muted mb-4">
                      Browse our services and submit a project request
                    </p>
                    <Link href="/get-a-website" className="text-primary hover:underline text-sm font-semibold">
                      Request a Website →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Want to Earn Commissions?</h3>
                    <p className="text-sm text-muted mb-4">
                      Learn about our affiliate program and sign up
                    </p>
                    <Link href="/affiliate-program" className="text-primary hover:underline text-sm font-semibold">
                      View Affiliate Program →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Already an Affiliate?</h3>
                    <p className="text-sm text-muted mb-4">
                      Access your dashboard and track your earnings
                    </p>
                    <Link href="/sign-in" className="text-primary hover:underline text-sm font-semibold">
                      Login to Dashboard →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Browse Services</h3>
                    <p className="text-sm text-muted mb-4">
                      View all available website packages and pricing
                    </p>
                    <Link href="/marketplace" className="text-primary hover:underline text-sm font-semibold">
                      View Marketplace →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Shortcut */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Looking for Answers?
          </h2>
          <p className="text-muted mb-8">
            Many common questions are answered in our FAQ sections
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/affiliate-program#faq">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="font-semibold">Affiliate Program FAQ</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="font-semibold">General FAQ</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" variant="light" />
              <p className="text-white/70 mt-4 text-sm leading-relaxed">
                Professional website development and rewarding affiliate opportunities for businesses worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/marketplace" className="text-white/70 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/affiliate-program" className="text-white/70 hover:text-white transition-colors">Affiliate Program</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/get-a-website" className="text-white/70 hover:text-white transition-colors">Request Website</Link></li>
                <li><Link href="/marketplace" className="text-white/70 hover:text-white transition-colors">View Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">For Affiliates</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sign-up" className="text-white/70 hover:text-white transition-colors">Join Program</Link></li>
                <li><Link href="/sign-in" className="text-white/70 hover:text-white transition-colors">Affiliate Login</Link></li>
                <li><Link href="/affiliate-program" className="text-white/70 hover:text-white transition-colors">Learn More</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 WebEarn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
