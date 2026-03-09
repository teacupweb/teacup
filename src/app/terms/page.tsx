import type { Metadata } from "next";

import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Teacup",
  description: "Terms and Conditions for using Teacup.",
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto container">
        <Navbar />
        <main className="min-h-[70vh] py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <header className="space-y-3">
              <h1 className="text-5xl ubuntu-font text-center">
                Terms &amp; Conditions
              </h1>
              <p className="text-center text-muted-foreground">
                Effective date: March 2, 2026
              </p>
              <p className="text-muted-foreground">
                These Terms &amp; Conditions (&quot;Terms&quot;) govern your
                access to and use of Teacupnet (the &quot;Service&quot;). By
                accessing or using the Service, you agree to be bound by these
                Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                This page is provided for general information and is not legal
                advice.
              </p>
            </header>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Eligibility</h2>
              <p className="text-muted-foreground">
                You must be able to form a binding contract in your jurisdiction
                to use the Service. If you use the Service on behalf of an
                organization, you represent that you have authority to bind that
                organization to these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activity that occurs under your
                account. Notify us promptly of any unauthorized use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                3. Subscriptions &amp; Payments
              </h2>
              <p className="text-muted-foreground">
                Some parts of the Service may be provided on a subscription or
                paid basis. Prices, billing periods, taxes, and payment methods
                will be shown at checkout or in your plan details. Unless
                required by law, payments are non-refundable.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
              <p className="text-muted-foreground">
                You agree not to misuse the Service. For example, you will not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Break the law or infringe others&apos; rights.</li>
                <li>
                  Attempt to access accounts or systems without permission.
                </li>
                <li>Upload malware or disrupt the Service.</li>
                <li>
                  Reverse engineer or abuse the Service beyond permitted use.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Your Content</h2>
              <p className="text-muted-foreground">
                You retain ownership of content you submit to the Service. You
                grant us a limited license to host, process, and display your
                content solely to operate and improve the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                The Service, including its software, design, and trademarks, is
                owned by Teacup and its licensors and is protected by applicable
                laws. You may not use our branding without prior written
                permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                7. Third-Party Services
              </h2>
              <p className="text-muted-foreground">
                The Service may integrate with third-party services (such as
                payment processors). Your use of third-party services is subject
                to their terms, and we are not responsible for them.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Disclaimers</h2>
              <p className="text-muted-foreground">
                The Service is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis. To the maximum extent permitted by law,
                we disclaim all warranties, express or implied, including
                merchantability, fitness for a particular purpose, and
                non-infringement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                9. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Teacup will not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits, data, use, or
                goodwill, arising from or related to your use of the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Termination</h2>
              <p className="text-muted-foreground">
                We may suspend or terminate access to the Service at any time if
                we reasonably believe you have violated these Terms or to
                protect the Service, users, or the public.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">11. Changes</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. Changes are
                effective when posted on this page. Your continued use of the
                Service after changes become effective constitutes acceptance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">12. Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms? Contact us at{" "}
                <a
                  className="text-rose-600 hover:underline"
                  href="mailto:support@teacup.com"
                >
                  support@teacup.com
                </a>{" "}
                .
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
