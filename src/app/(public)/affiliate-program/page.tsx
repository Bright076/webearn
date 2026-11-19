import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Wallet,
  FileText,
  Shield,
  Gift,
  Zap,
  Globe,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Affiliate Program - WebEarn",
  description: "Learn how our affiliate program works, commission structure, payment process, and FAQs",
};

export default function AffiliateProgramPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="default" className="mb-4">
              <Gift className="w-3 h-3 mr-1" />
              Affiliate Program Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              How Our Affiliate Program Works
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              Everything you need to know about earning with WebEarn — from commission structure to payment processing
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="group">
                  Become an Affiliate
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-xl bg-success/10 mb-3">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">Up to 30%</p>
              <p className="text-sm text-muted">Commission Rate</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">$5</p>
              <p className="text-sm text-muted">Minimum Payout</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-3">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">24-48h</p>
              <p className="text-sm text-muted">Payout Processing</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">Worldwide</p>
              <p className="text-sm text-muted">Available Globally</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Four simple steps to start earning commissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Sign Up
                </h3>
                <p className="text-sm text-muted">
                  Create your free affiliate account and get your unique referral code
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Promote
                </h3>
                <p className="text-sm text-muted">
                  Share products from our marketplace using your unique referral links
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Earn
                </h3>
                <p className="text-sm text-muted">
                  Get commission when referred clients purchase and complete payment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    4
                  </div>
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Get Paid
                </h3>
                <p className="text-sm text-muted">
                  Request withdrawals via USDT (TRC20) or bank transfer once you reach $5
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Commission Structure */}
        <section className="mb-16">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-2xl">Commission Structure</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    How Commissions Are Calculated
                  </h3>
                  <p className="text-muted mb-4">
                    Each product in our marketplace has a specific commission percentage (ranging from 15% to 30%). 
                    When a client you refer makes a purchase, you earn that percentage of the sale price.
                  </p>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <p className="text-sm font-mono text-foreground">
                      <strong>Example:</strong> Client purchases a $1,000 website with 25% commission
                      <br />
                      <strong>Your Earning:</strong> $1,000 × 25% = <span className="text-success font-bold">$250</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    Commission Approval Process
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-warning/10 h-fit">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Pending Status</p>
                        <p className="text-sm text-muted">
                          Commission is created when client submits request. Status remains "pending" until payment is received.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-success/10 h-fit">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Approved Status</p>
                        <p className="text-sm text-muted">
                          Once client completes payment, admin approves the commission. It's now available for withdrawal.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 h-fit">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Paid Status</p>
                        <p className="text-sm text-muted">
                          After you request withdrawal and admin processes it, commission is marked as "paid".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Payment Process */}
        <section className="mb-16">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Payment Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    Withdrawal Methods
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="success">Recommended</Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">USDT (TRC20)</h4>
                      <ul className="space-y-1 text-sm text-muted">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Works worldwide
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Lower fees
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Faster processing (24-48 hours)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          No currency conversion
                        </li>
                      </ul>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Bank Transfer</h4>
                      <ul className="space-y-1 text-sm text-muted">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-muted" />
                          Available in select countries
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          May have higher fees
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          Longer processing (3-5 business days)
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          Currency conversion may apply
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    Payment Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Request Withdrawal</p>
                        <p className="text-sm text-muted">
                          Once you have $5+ in approved commissions, submit withdrawal request from dashboard
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Admin Review (1-24 hours)</p>
                        <p className="text-sm text-muted">
                          Our team reviews your request and verifies payment details
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Payment Processing (24-48 hours)</p>
                        <p className="text-sm text-muted">
                          Payment is sent to your USDT wallet or bank account
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success font-bold text-sm shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Completed</p>
                        <p className="text-sm text-muted">
                          You receive payment and withdrawal is marked as "paid"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Pro Tip</p>
                      <p className="text-sm text-muted">
                        For fastest payouts, use USDT (TRC20) and ensure your wallet address is correct in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cancellation Policy */}
        <section className="mb-16">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Cancellation Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <p className="text-muted">
                  We understand that sometimes clients may cancel their orders. Here's how cancellations affect your commissions:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Before Payment</p>
                      <p className="text-sm text-muted">
                        If client cancels before making payment, commission remains "pending" and is not available for withdrawal.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">After Payment / Refund</p>
                      <p className="text-sm text-muted">
                        If client requests refund after payment, previously approved commission will be revoked. 
                        If you've already withdrawn, you may need to return the amount.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Completed Projects</p>
                      <p className="text-sm text-muted">
                        Once project is delivered and marked "completed", commission is secure and cannot be revoked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Common questions about the affiliate program
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      When do I receive my commission?
                    </h3>
                    <p className="text-sm text-muted">
                      Commission is approved after the client completes payment. You can then request withdrawal 
                      once your approved balance reaches $5. Payouts typically process within 24-48 hours for USDT.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      Can I promote multiple products?
                    </h3>
                    <p className="text-sm text-muted">
                      Yes! You can promote as many products as you want from our marketplace. Each product has its own 
                      commission rate, and you'll earn according to that rate for each sale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      How do I track my referrals?
                    </h3>
                    <p className="text-sm text-muted">
                      Your dashboard shows all referrals in real-time. You can see client names, products they're interested in, 
                      current status, and commission amounts. Use the leads page to track all your referrals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      Is there a limit to how much I can earn?
                    </h3>
                    <p className="text-sm text-muted">
                      No limits! You can refer as many clients as you want and earn unlimited commissions. 
                      The more you promote, the more you earn.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      What if I don't have a USDT wallet?
                    </h3>
                    <p className="text-sm text-muted">
                      You can use bank transfer instead, though it may take longer (3-5 business days). We recommend 
                      setting up a USDT wallet for faster payments — wallets like Trust Wallet or Binance are easy to set up.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">
                      Can I refer clients from any country?
                    </h3>
                    <p className="text-sm text-muted">
                      Yes! Our platform works worldwide. You can refer clients from anywhere, and we accept affiliates 
                      from all countries. Payments via USDT work globally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                  Ready to Start Earning?
                </h2>
                <p className="text-lg text-muted mb-8">
                  Join hundreds of affiliates earning commissions by promoting quality websites and services
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/sign-up">
                    <Button size="lg" className="group">
                      Create Affiliate Account
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
