import { MarketingNav } from "@/components/marketing/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Target,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Heart,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | WebEarn",
  description: "Learn about WebEarn's mission to connect businesses with professional websites while creating earning opportunities for affiliates worldwide.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="default" className="mb-4">
            <Heart className="w-3 h-3 mr-2" />
            About WebEarn
          </Badge>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-6">
            Building Success Together
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            WebEarn connects businesses seeking professional websites with motivated affiliates 
            who earn commissions by bringing them customers. Everyone wins.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold">Our Mission</h2>
                </div>
                <p className="text-muted leading-relaxed">
                  To make professional website development accessible to every business while 
                  creating meaningful income opportunities for affiliates worldwide. We believe 
                  quality web services shouldn't be out of reach for small businesses and startups.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold">Our Vision</h2>
                </div>
                <p className="text-muted leading-relaxed">
                  To become the world's most trusted platform connecting website buyers with 
                  affiliate marketers, creating a thriving ecosystem where businesses grow and 
                  affiliates prosper through honest, transparent relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Transparency
                </h3>
                <p className="text-muted">
                  Clear pricing, honest communication, and no hidden fees. 
                  You always know exactly what you're getting and what you'll earn.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-success/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Quality
                </h3>
                <p className="text-muted">
                  Every website we deliver meets professional standards. 
                  We never compromise on quality to chase quick profits.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Speed
                </h3>
                <p className="text-muted">
                  Fast turnaround times, quick commission approvals, and 
                  prompt payouts. Your time is valuable.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Support
                </h3>
                <p className="text-muted">
                  Whether you're a client or affiliate, we're here to help 
                  you succeed with responsive, knowledgeable support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-success/10 mb-4">
                  <Globe className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Accessibility
                </h3>
                <p className="text-muted">
                  Professional services available worldwide with payment 
                  methods that work for everyone, everywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Integrity
                </h3>
                <p className="text-muted">
                  Doing the right thing even when no one's watching. 
                  Building trust through consistent, ethical business practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why WebEarn */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-6">
                Why WebEarn Exists
              </h2>
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  We started WebEarn because we saw two problems: businesses struggling to find 
                  affordable, quality website development, and talented marketers looking for 
                  legitimate, high-paying affiliate opportunities.
                </p>
                <p className="text-muted leading-relaxed">
                  Traditional agencies charge premium prices that many small businesses can't afford. 
                  Meanwhile, most affiliate programs offer tiny commissions on low-value products, 
                  making it hard to earn meaningful income.
                </p>
                <p className="text-muted leading-relaxed">
                  WebEarn bridges this gap. We deliver professional websites at fair prices while 
                  paying generous commissions to affiliates. Everyone gets value, no one gets exploited.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-success">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">For Businesses</h4>
                      <p className="text-sm text-muted">
                        Professional websites without the agency premium. Quality work delivered on time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">For Affiliates</h4>
                      <p className="text-sm text-muted">
                        High commissions on valuable services. Promote products people actually need.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">For Everyone</h4>
                      <p className="text-sm text-muted">
                        Transparent processes, fair pricing, and honest relationships built on mutual success.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Whether you need a website or want to earn commissions, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-a-website">
              <Button size="lg" className="group w-full sm:w-auto">
                Get a Website
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Become an Affiliate
              </Button>
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
