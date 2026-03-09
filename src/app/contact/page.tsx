"use client";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto container">
        <Navbar />
        <div className="min-h-[70vh] py-12 px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <header className="space-y-4 text-center">
              <h1 className="text-5xl ubuntu-font">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions? We&apos;re here to help. Reach out to us and
                we&apos;ll respond as soon as possible.
              </p>
            </header>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Email Card */}
              <Card className="group">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      We&apos;ll respond within 24 hours
                    </p>
                    <div className="space-y-1">
                      <a
                        href="mailto:support@teacup.com"
                        className="block text-rose-600 hover:underline text-sm"
                      >
                        support@teacup.com
                      </a>
                      <a
                        href="mailto:sales@teacup.com"
                        className="block text-rose-600 hover:underline text-sm"
                      >
                        sales@teacup.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Card */}
              <Card className="group">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mon-Fri, 9am-6pm EST
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-rose-600 hover:underline text-sm"
                    >
                      +880 167 8060 430
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Card */}
              <Card className="group">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Response Time
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Average response time
                    </p>
                    <p className="text-rose-600 font-medium text-sm">
                      Within 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border-rose-200 dark:border-rose-800">
              <CardContent className="py-10 px-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-rose-900/50 flex items-center justify-center mx-auto shadow-md">
                  <MessageSquare className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Ready to Get Started?
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-4">
                    Whether you have a question about features, pricing, or
                    anything else, our team is ready to answer all your
                    questions.
                  </p>
                  <a
                    href="mailto:support@teacup.com"
                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                  >
                    <Send className="w-4 h-4" />
                    Send us a Message
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
