"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-sm text-black/70 hover:text-black transition-colors font-safiro"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-chaney mb-8">
          Privacy Policy
        </h1>

        <div className="text-sm text-black/60 font-safiro mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Introduction
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              Welcome to ASHCODE. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Information We Collect
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg leading-relaxed text-black/80 font-safiro ml-4">
              <li>Personal data such as your name and email address when you contact us</li>
              <li>Derivative data such as your IP address, browser type, and access times</li>
              <li>Mobile device data including device information and mobile device identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              How We Use Your Information
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg leading-relaxed text-black/80 font-safiro ml-4">
              <li>Respond to your inquiries and fulfill your requests</li>
              <li>Send you administrative information and updates</li>
              <li>Improve our website and user experience</li>
              <li>Monitor and analyze usage and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Disclosure of Your Information
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg leading-relaxed text-black/80 font-safiro ml-4">
              <li>By law or to protect rights</li>
              <li>With your consent</li>
              <li>Business transfers (in case of merger or acquisition)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Security of Your Information
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Contact Us
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro">
              Email: <a href="mailto:ashercode4u@gmail.com" className="text-black hover:opacity-70 transition-opacity underline">ashercode4u@gmail.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}












