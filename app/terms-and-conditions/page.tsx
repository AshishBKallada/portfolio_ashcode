"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function TermsAndConditionsPage() {
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
          Terms and Conditions
        </h1>

        <div className="text-sm text-black/60 font-safiro mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Agreement to Terms
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              By accessing or using this website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, then you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Use License
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              Permission is granted to temporarily download one copy of the materials on ASHCODE's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg leading-relaxed text-black/80 font-safiro ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Disclaimer
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              The materials on ASHCODE's website are provided on an 'as is' basis. ASHCODE makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Limitations
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              In no event shall ASHCODE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ASHCODE's website, even if ASHCODE or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Accuracy of Materials
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              The materials appearing on ASHCODE's website could include technical, typographical, or photographic errors. ASHCODE does not warrant that any of the materials on its website are accurate, complete, or current. ASHCODE may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Links
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              ASHCODE has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ASHCODE of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Modifications
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              ASHCODE may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4">
              Contact Information
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
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






