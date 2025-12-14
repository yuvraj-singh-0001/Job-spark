import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center">
              <Sparkles size={18} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Hire<span className="text-blue-600">Spark</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">📜 Terms & Conditions</h1>
          <p className="text-slate-600">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1️⃣ General Terms of Use</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing or using this platform ("HireSpark"), you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use the platform.
            </p>
            <p className="text-slate-700 leading-relaxed">
              HireSpark is a job discovery and hiring facilitation platform connecting candidates, recruiters, and employers. We do not guarantee job placement or hiring outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2️⃣ User Eligibility</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>You must be <strong>18 years or older</strong> to use this platform.</li>
              <li>You agree to provide <strong>accurate, complete, and truthful information</strong>.</li>
              <li>One user is allowed <strong>one account only</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3️⃣ Candidate Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By registering as a <strong>candidate</strong>, you agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>All personal, educational, and professional details provided are correct.</li>
              <li>You will not submit fake documents, false experience, or misleading information.</li>
              <li>Job applications are sent at your own discretion and responsibility.</li>
              <li>HireSpark is <strong>not responsible</strong> for employer responses, interview outcomes, salary offers, or employment disputes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4️⃣ Recruiter / Employer Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By registering as a <strong>recruiter/employer</strong>, you agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>You represent a legitimate company or hiring authority.</li>
              <li>Job postings must be <strong>genuine, legal, and non-discriminatory</strong>.</li>
              <li>You will not post fraudulent, misleading, or fee-based job offers.</li>
              <li>You agree that <strong>HireSpark may review, approve, reject, or remove job posts</strong> at its discretion.</li>
              <li>You will not misuse candidate data or contact details.</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Violation may result in <strong>account suspension or permanent ban</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5️⃣ Job Posting & Verification</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>All recruiter profiles and job postings are subject to <strong>internal verification</strong>.</li>
              <li>HireSpark reserves the right to request additional documents.</li>
              <li>Verified badges do <strong>not guarantee</strong> legitimacy of hiring outcomes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6️⃣ Data Usage & Privacy</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>By using the platform, you consent to the collection and processing of your data as per our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</li>
              <li>Candidate contact details may be shared with recruiters <strong>only after application</strong>.</li>
              <li>We do not sell personal data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7️⃣ Prohibited Activities</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Users must NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Post fake jobs or profiles</li>
              <li>Harass or spam other users</li>
              <li>Attempt to bypass platform security</li>
              <li>Scrape or misuse platform data</li>
              <li>Use the platform for unlawful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8️⃣ Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              HireSpark is <strong>not liable</strong> for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Hiring decisions</li>
              <li>Employment disputes</li>
              <li>Financial losses</li>
              <li>Employer or candidate conduct</li>
              <li>External links or third-party services</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Use of the platform is <strong>at your own risk</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9️⃣ Account Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              HireSpark reserves the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Suspend or terminate accounts without prior notice</li>
              <li>Remove content violating policies</li>
              <li>Restrict access to services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🔟 Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update these Terms & Conditions at any time. Continued use of the platform implies acceptance of revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1️⃣1️⃣ Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              For queries or concerns:
            </p>
            <ul className="list-none space-y-2 text-slate-700">
              <li>📧 <a href="mailto:support@hirespark.com" className="text-blue-600 hover:underline">support@hirespark.com</a></li>
              <li>📍 B-30, Block-B, Sector-72, Noida</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link to="/privacy" className="text-blue-600 hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link to="/home" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
