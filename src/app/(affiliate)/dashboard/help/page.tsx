import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  DollarSign,
  Clock,
  Wallet,
  Users,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  FileText,
  MessageSquare,
  Zap,
} from "lucide-react";

export default function HelpPage() {
  const quickGuides = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn how to set up your account and start promoting",
      items: [
        "Create your affiliate account",
        "Get your unique referral code",
        "Set up payment details (USDT or Bank)",
        "Browse products in marketplace",
      ],
    },
    {
      icon: TrendingUp,
      title: "Promoting Products",
      description: "Best practices for successful referrals",
      items: [
        "Choose products that match your audience",
        "Share referral links on social media",
        "Create content around products",
        "Follow up with potential clients",
      ],
    },
    {
      icon: DollarSign,
      title: "Understanding Commissions",
      description: "How you earn money with WebEarn",
      items: [
        "Commission rates: 15% - 30% per product",
        "Pending: Waiting for client payment",
        "Approved: Ready for withdrawal",
        "Paid: Successfully withdrawn",
      ],
    },
    {
      icon: Wallet,
      title: "Withdrawing Earnings",
      description: "How to get paid for your work",
      items: [
        "Minimum withdrawal: $5",
        "USDT (TRC20): 24-48 hours",
        "Bank transfer: 3-5 business days",
        "Update payment details in Profile",
      ],
    },
  ];

  const faqs = [
    {
      q: "How long does it take to get my commission?",
      a: "Commissions are approved after client payment. You can request withdrawal once you have $5+ approved balance. USDT payouts process in 24-48 hours.",
    },
    {
      q: "What happens if a client cancels?",
      a: "If cancellation happens before payment, commission stays pending. If after payment (refund), approved commission may be revoked.",
    },
    {
      q: "Can I track my referrals in real-time?",
      a: "Yes! Your Leads page shows all referrals with current status, client info, and commission amounts in real-time.",
    },
    {
      q: "How do I get my referral link?",
      a: "Go to Marketplace, find any product, and your unique referral code is automatically added to the URL when clients visit through your link.",
    },
    {
      q: "Is there a limit to how much I can earn?",
      a: "No limits! Refer as many clients as you want and earn unlimited commissions.",
    },
    {
      q: "What if I need help or have questions?",
      a: "Contact our support team through the Contact page, and we'll respond within 24 hours.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-1">
            Help & Resources
          </h1>
          <p className="text-muted">
            Everything you need to succeed as a WebEarn affiliate
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/affiliate-program">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-6 h-6 text-primary" />
                <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                Full Program Guide
              </h3>
              <p className="text-sm text-muted">
                Complete guide to how the affiliate program works
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contact">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                Contact Support
              </h3>
              <p className="text-sm text-muted">
                Get help from our team within 24 hours
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/marketplace">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                Browse Products
              </h3>
              <p className="text-sm text-muted">
                Find products to promote and earn commissions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-2">
                Quick Program Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted mb-1">Commission Range</p>
                  <p className="text-2xl font-heading font-bold text-foreground">15-30%</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Min. Payout</p>
                  <p className="text-2xl font-heading font-bold text-foreground">$5</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">USDT Processing</p>
                  <p className="text-2xl font-heading font-bold text-foreground">24-48h</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Availability</p>
                  <p className="text-2xl font-heading font-bold text-foreground">Global</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickGuides.map((guide, index) => (
          <Card key={index}>
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <p className="text-sm text-muted">{guide.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {guide.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <HelpCircle className="w-6 h-6 text-accent" />
            </div>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className={index !== 0 ? "border-t border-border pt-6" : ""}>
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
            Still Have Questions?
          </h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/affiliate-program">
              <Button variant="default" className="group">
                View Full Guide
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
