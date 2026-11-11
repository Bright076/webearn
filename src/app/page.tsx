import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav } from "@/components/marketing/nav";
import { Logo } from "@/components/Logo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Zap,
  DollarSign,
  Globe,
  Shield,
  Quote,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebEarn - Professional Website Development & Affiliate Program",
  description: "Get a high-quality professional website for your business or join our affiliate program to earn commission by referring clients worldwide.",
};

export default async function HomePage() {
  // Fetch real products from database
  const adminClient = createAdminClient();
  const { data: products } = await adminClient
    .from("products")
    .select("id, name, price, commission_type, commission_value, delivery_days, thumbnail_url, category_id, slug")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // Calculate commission amount for display
  const getCommissionAmount = (price: number, type: string, value: number) => {
    if (type === "percentage") {
      return (price * value) / 100;
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section - Enhanced */}
      <section className="relative py-24 lg:py-32 px-4 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-2" />
              Trusted by businesses worldwide
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight">
              Build Websites.{" "}
              <span className="text-primary">Earn Through Referrals.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              WebEarn connects businesses looking for professional websites with affiliates who earn commissions by bringing them customers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/get-a-website">
                <Button size="xl" className="w-full sm:w-auto group">
                  Request a Website
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-2">
                  Become an Affiliate
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>No upfront fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Quick payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Global payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How WebEarn Works - Enhanced */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              How WebEarn Works
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              A simple platform connecting website buyers with affiliate promoters
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Clients */}
            <Card className="border-2 hover:border-primary/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold">
                    For Customers
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Browse services</h4>
                      <p className="text-muted">Explore our marketplace of professional website packages</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Place your order</h4>
                      <p className="text-muted">Select a package and submit your requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Launch your website</h4>
                      <p className="text-muted">Receive your completed website with full support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Affiliates */}
            <Card className="border-2 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold">
                    For Affiliates
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Sign up free</h4>
                      <p className="text-muted">Create your affiliate account in under 2 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Generate referral links</h4>
                      <p className="text-muted">Get unique tracked links for any product</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Earn commissions</h4>
                      <p className="text-muted">Get paid for every successful customer referral</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link href="/sign-up">
                    <Button variant="default" className="w-full" size="lg">
                      Start Earning Today
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Preview - Enhanced */}
      {products && products.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-heading font-bold text-foreground mb-2">
                  Featured Services
                </h2>
                <p className="text-muted">Professional websites ready to promote</p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline" size="lg">
                  View All Services
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => {
                const commissionAmount = getCommissionAmount(
                  Number(product.price),
                  product.commission_type,
                  Number(product.commission_value)
                );
                
                return (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      {product.thumbnail_url ? (
                        <div className="bg-secondary/30 aspect-video relative overflow-hidden rounded-t-lg">
                          <Image
                            src={product.thumbnail_url}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-t-lg">
                          <Globe className="w-12 h-12 text-muted" />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">Price</span>
                            <span className="font-bold text-lg">${Number(product.price).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">Your Commission</span>
                            <Badge variant="success" className="text-base px-3 py-1">
                              ${commissionAmount.toLocaleString()}
                            </Badge>
                          </div>
                          {product.delivery_days && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted">Delivery</span>
                              <span className="font-semibold">{product.delivery_days} days</span>
                            </div>
                          )}
                        </div>

                        <Link href="/sign-up">
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                            Promote This Service
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose WebEarn - Enhanced */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Why Choose WebEarn
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Built for success with features that matter
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-md">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Fast Delivery
                </h3>
                <p className="text-muted">
                  Most projects delivered within 2-4 weeks with quality guaranteed
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-4">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  High Commissions
                </h3>
                <p className="text-muted">
                  Earn up to 30% on every successful client conversion
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-success/10 rounded-xl mb-4">
                  <Globe className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Global Reach
                </h3>
                <p className="text-muted">
                  Serve clients worldwide with international payment options
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Transparent
                </h3>
                <p className="text-muted">
                  Clear pricing with no hidden fees or surprise charges
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Affiliate Benefits Section - NEW */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="default" className="mb-4">
                <Users className="w-3 h-3 mr-2" />
                Affiliate Program
              </Badge>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-6">
                Turn Your Network Into Revenue
              </h2>
              <p className="text-lg text-muted mb-8">
                Join hundreds of affiliates earning consistent income by connecting businesses with professional website services.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">No Experience Required</h4>
                    <p className="text-muted text-sm">We provide all the tools and materials you need to succeed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Recurring Opportunities</h4>
                    <p className="text-muted text-sm">Every business needs a website - unlimited earning potential</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Fast Payouts</h4>
                    <p className="text-muted text-sm">Withdraw earnings via USDT or bank transfer from just $5</p>
                  </div>
                </div>
              </div>

              <Link href="/sign-up">
                <Button size="xl" className="group">
                  Join the Affiliate Program
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">30%</div>
                <div className="text-sm text-muted">Max Commission</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">$5</div>
                <div className="text-sm text-muted">Min Withdrawal</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">5-7</div>
                <div className="text-sm text-muted">Days Payout</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted">Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Trusted by Affiliates & Clients
            </h2>
            <p className="text-lg text-muted">Real experiences from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The affiliate program is well-structured and payments are consistently processed on schedule. Highly professional experience.",
                name: "Sarah K.",
                role: "Affiliate • Digital Marketing",
              },
              {
                quote: "Exceptional website design for my business. The development process was seamless and the final product exceeded expectations.",
                name: "Michael C.",
                role: "Client • E-commerce",
              },
              {
                quote: "I've generated over $2,000 in commissions simply by recommending their services. Outstanding affiliate opportunity.",
                name: "James R.",
                role: "Affiliate • Top Performer",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="hover:shadow-lg">
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-accent/20 mb-4" />
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Enhanced */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted">Everything you need to know</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <Accordion>
                <AccordionItem value="payment">
                  <AccordionTrigger value="payment">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent value="payment">
                    We accept bank transfers, credit/debit cards, and cryptocurrency (USDT). Affiliates receive payouts via USDT (TRC20/BEP20) or international bank transfer once the minimum threshold of $5 is reached. All payments are processed within 5-7 business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery">
                  <AccordionTrigger value="delivery">
                    How long does delivery take?
                  </AccordionTrigger>
                  <AccordionContent value="delivery">
                    Most projects are delivered within 2-4 weeks depending on complexity. Landing pages typically take 7 days, while full e-commerce sites may take up to 21 days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="website">
                  <AccordionTrigger value="website">
                    Do I need a website to join the affiliate program?
                  </AccordionTrigger>
                  <AccordionContent value="website">
                    No website required. Share your unique referral link through any channel: social media, email, messaging apps, or in-person networking. We provide comprehensive marketing materials and tracking tools to support your success.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="whatsapp">
                  <AccordionTrigger value="whatsapp">
                    What communication channels do you support?
                  </AccordionTrigger>
                  <AccordionContent value="whatsapp">
                    We primarily use WhatsApp for fast, efficient communication, but also support email, phone, and video conferencing for client consultations. Choose the channel that works best for you and your clients.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="multiple">
                  <AccordionTrigger value="multiple">
                    Are there limits on referrals or products?
                  </AccordionTrigger>
                  <AccordionContent value="multiple">
                    No limits whatsoever. Promote any combination of our services, make unlimited referrals, and earn uncapped commissions. Your success is our success, and we encourage you to maximize your earning potential.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA - NEW */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Whether you need a website or want to earn commissions, WebEarn has you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Browse Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="xl" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10">
                Start Earning Today
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
              <Logo size="sm" />
              <p className="text-white/70 mt-4 text-sm leading-relaxed">
                Professional website development and rewarding affiliate opportunities for businesses worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/marketplace" className="text-white/70 hover:text-white transition-colors">Marketplace</Link></li>
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
                <li><Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link></li>
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
