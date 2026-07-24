'use client';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Link from 'next/link';
import { 
  Globe, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Users, 
  CreditCard,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-rose-50/30 dark:to-rose-950/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 dark:bg-rose-800/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-rose-100/40 dark:bg-rose-900/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-full mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                Try Teacup free - No credit card required
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl ubuntu-font font-bold text-foreground mb-6 leading-tight tracking-tight animate-fade-in-up">
              Easy to Use Tech with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
                Teacup
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
              The 100% no-code SaaS platform for retail, ecommerce, and service 
              businesses. Launch a professional website in minutes, not months.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animate-delay-200">
              <Link href="/auth/signup">
                <button className="group relative bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5">
                  Start Free Trial
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
              <Link href="/about">
                <button className="group bg-white dark:bg-gray-800 text-foreground border-2 border-border hover:border-rose-300 dark:hover:border-rose-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-md">
                  Learn More
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground">Trusted by 500+ businesses worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder logos - replace with actual client logos */}
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Pricing Preview */}
      <PricingPreview />

      {/* CTA Section */}
      <CTASection />
      
      <Footer />
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: 'No-Code Website Builder',
      description: 'Create stunning, professional websites without writing a single line of code. Drag, drop, done.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track visitor behavior, conversions, and interactions with beautiful, easy-to-understand dashboards.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Customer Inbox',
      description: 'Never miss a message. Centralize all customer communications in one powerful inbox.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Assistant',
      description: '"Hold My Tea" AI helps you generate content, analyze data, and make decisions instantly.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Multi-User Collaboration',
      description: 'Invite team members, assign roles, and work together seamlessly on your website.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: CreditCard,
      title: 'Payment Integration',
      description: 'Accept payments and manage subscriptions with built-in Polar payment processing.',
      gradient: 'from-rose-500 to-rose-400',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl ubuntu-font font-bold text-foreground mb-4">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
              Succeed Online
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features packed into an intuitive interface. No training required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Learn more link */}
              <div className="mt-6 flex items-center text-rose-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up Free',
      description: 'Create your account in seconds. No credit card required, no commitment.',
      icon: Zap,
    },
    {
      number: '02',
      title: 'Customize Your Site',
      description: 'Use our intuitive builder to create your perfect website. Choose templates or start fresh.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Launch & Grow',
      description: 'Publish your site and start tracking visitors. Watch your business grow with powerful analytics.',
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-24 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl ubuntu-font font-bold text-foreground mb-4">
            Get Started in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From zero to launched in minutes. No technical skills needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-rose-200 to-transparent dark:from-rose-800 -translate-y-1/2 z-0" />
              )}
              
              <div className="relative bg-card border border-border rounded-3xl p-8 text-center hover:shadow-lg transition-all duration-500">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white text-xl font-bold mb-6 shadow-lg shadow-rose-500/30">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="inline-flex p-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 mb-4">
                  <step.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      content: "Teacup transformed how we manage our online presence. The no-code builder is incredibly intuitive and the analytics help us make data-driven decisions.",
      author: "Sarah Johnson",
      role: "CEO, Retail Co",
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      content: "Finally, a platform that doesn't require a computer science degree. We launched our website in a weekend and saw immediate results.",
      author: "Michael Chen",
      role: "Founder, Service Pro",
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      content: "The AI assistant is a game-changer. It helps us generate content and understand our data without hiring a dedicated analyst.",
      author: "Emily Rodriguez",
      role: "Marketing Director",
      avatar: "👩‍🎨",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl ubuntu-font font-bold text-foreground mb-4">
            Loved by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
              Businesses Like Yours
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our customers have to say about Teacup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-lg transition-all duration-500"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Preview Section
function PricingPreview() {
  const features = [
    'Unlimited pages',
    'Custom domain',
    'Analytics dashboard',
    'Customer inbox',
    'AI assistant',
    'Multi-user access',
    'Payment integration',
    '24/7 support',
  ];

  return (
    <section className="py-24 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl ubuntu-font font-bold text-foreground mb-4">
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            One plan, everything included. No hidden fees.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border-2 border-rose-200 dark:border-rose-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/50 dark:bg-rose-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Price */}
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Monthly Plan
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-foreground">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Everything you need to succeed online. Cancel anytime.
                </p>
                <Link href="/pricing">
                  <button className="w-full bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5">
                    View Pricing
                  </button>
                </Link>
              </div>

              {/* Right: Features */}
              <div>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-8 md:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-4xl md:text-5xl ubuntu-font font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join 500+ businesses already using Teacup to power their online presence. 
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup">
                  <button className="group bg-white text-rose-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                    <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                    Contact Sales
                  </button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
