import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Get a Professional Website or Earn Money by Referring Clients
          </h1>
          <p className="text-xl text-muted mb-10 max-w-3xl mx-auto">
            We build high-quality websites for Nigerian businesses. Know someone who needs one? Refer them and earn commission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-a-website">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Get a Website
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-primary text-primary hover:bg-primary hover:text-white">
                Become an Affiliate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Clients */}
            <div className="bg-white border border-border rounded-lg p-8">
              <h3 className="text-2xl font-heading font-semibold mb-6">
                For Clients
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Tell us what you need</h4>
                    <p className="text-muted text-sm">Share your requirements and goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">We build it</h4>
                    <p className="text-muted text-sm">Our team creates your professional website</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">You launch</h4>
                    <p className="text-muted text-sm">Go live with full support and training</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Affiliates */}
            <div className="bg-white border border-border rounded-lg p-8">
              <h3 className="text-2xl font-heading font-semibold mb-6">
                For Affiliates
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Sign up free</h4>
                    <p className="text-muted text-sm">Create your affiliate account in minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Share your link</h4>
                    <p className="text-muted text-sm">Promote services to your network</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Earn commission</h4>
                    <p className="text-muted text-sm">Get paid for every successful referral</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-border rounded-lg p-6">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Fast Delivery
              </h3>
              <p className="text-muted text-sm">
                Most projects delivered within 2-4 weeks
              </p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6">
              <DollarSign className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Fair Commissions
              </h3>
              <p className="text-muted text-sm">
                Earn up to 30% on every successful referral
              </p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Nigerian-Focused
              </h3>
              <p className="text-muted text-sm">
                Built for the Nigerian market and payment methods
              </p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">
                No Hidden Fees
              </h3>
              <p className="text-muted text-sm">
                Transparent pricing, no surprises or extras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold">
              Featured Services
            </h2>
            <Link href="/marketplace" className="text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Landing Page", price: "$500", commission: "$150", delivery: "7 days" },
              { name: "Business Website", price: "$1,200", commission: "$360", delivery: "14 days" },
              { name: "E-Commerce Store", price: "$2,500", commission: "$750", delivery: "21 days" },
            ].map((service, idx) => (
              <div key={idx} className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-xl font-heading font-semibold mb-4">
                  {service.name}
                </h3>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Price:</span>
                    <span className="font-semibold">{service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Commission:</span>
                    <span className="font-semibold text-accent">{service.commission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Delivery:</span>
                    <span className="font-semibold">{service.delivery}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Promote
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold">
              Featured Templates
            </h2>
            <Link href="/marketplace" className="text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Restaurant Template", price: "$300", commission: "$90" },
              { name: "Portfolio Template", price: "$250", commission: "$75" },
              { name: "Church Template", price: "$400", commission: "$120" },
            ].map((template, idx) => (
              <div key={idx} className="bg-white border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/20 aspect-video flex items-center justify-center text-muted">
                  Preview Image
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-2">
                    {template.name}
                  </h3>
                  <div className="space-y-1 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Price:</span>
                      <span className="font-semibold">{template.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Commission:</span>
                      <span className="font-semibold text-accent">{template.commission}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Demo
                    </Button>
                    <Button className="flex-1">
                      Promote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            What People Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The affiliate program is straightforward and the commissions are paid on time. Highly recommend!",
                name: "Chioma A.",
                role: "Affiliate Partner",
              },
              {
                quote: "They built a beautiful website for my restaurant. The process was smooth and professional.",
                name: "Ibrahim M.",
                role: "Restaurant Owner",
              },
              {
                quote: "I've earned over $1,500 in commissions just by sharing with my network. Amazing opportunity!",
                name: "Tunde O.",
                role: "Top Affiliate",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white border border-border rounded-lg p-6">
                <Quote className="w-8 h-8 text-accent mb-4" />
                <p className="text-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion>
            <AccordionItem value="payment">
              <AccordionTrigger value="payment">
                How do I get paid?
              </AccordionTrigger>
              <AccordionContent value="payment">
                Affiliates are paid via bank transfer once you reach the minimum withdrawal threshold of $50. Payments are processed within 7 business days of withdrawal request.
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
                Do I need a website to become an affiliate?
              </AccordionTrigger>
              <AccordionContent value="website">
                No, you don't need a website. You can share your affiliate link via WhatsApp, social media, email, or any other channel. We provide marketing materials to help you promote.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="whatsapp">
              <AccordionTrigger value="whatsapp">
                What if I don't have a WhatsApp number?
              </AccordionTrigger>
              <AccordionContent value="whatsapp">
                While WhatsApp is our primary communication channel, we can accommodate other methods like email or phone calls. However, WhatsApp is recommended for faster response times.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multiple">
              <AccordionTrigger value="multiple">
                Can I promote more than one product?
              </AccordionTrigger>
              <AccordionContent value="multiple">
                Yes! You can promote as many products and services as you like. There's no limit to how many referrals you can make or how much you can earn.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" />
              <p className="text-white/70 mt-4 text-sm">
                Professional websites and rewarding affiliate opportunities for Nigerian businesses.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-white/70 hover:text-white">Home</Link></li>
                <li><Link href="/marketplace" className="text-white/70 hover:text-white">Marketplace</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/get-a-website" className="text-white/70 hover:text-white">Get a Website</Link></li>
                <li><Link href="/marketplace" className="text-white/70 hover:text-white">View Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">For Affiliates</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sign-up" className="text-white/70 hover:text-white">Sign Up</Link></li>
                <li><Link href="/sign-in" className="text-white/70 hover:text-white">Sign In</Link></li>
                <li><Link href="/dashboard" className="text-white/70 hover:text-white">Dashboard</Link></li>
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
