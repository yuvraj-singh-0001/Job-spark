import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function PrivacyPolicy() {
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
Jobion
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🔒 Privacy Policy</h1>
          <p className="text-slate-600">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              At Jobion, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Name, email address, phone number</li>
              <li>Profile information (education, experience, skills)</li>
              <li>Resume and documents uploaded</li>
              <li>Company information (for recruiters)</li>
            </ul>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-4">Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>IP address, browser type, device information</li>
              <li>Pages visited, time spent, interactions</li>
              <li>Job applications and saved jobs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>To provide and improve our services</li>
              <li>To match candidates with job opportunities</li>
              <li>To communicate with you about your account and job opportunities</li>
              <li>To verify recruiter and job posting authenticity</li>
              <li>To analyze platform usage and improve user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li><strong>With Recruiters:</strong> Candidate contact details are shared only after a job application is submitted</li>
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate the platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              <strong>We do not sell your personal data to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Access and update your personal information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage, and assist with authentication. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links</h2>
            <p className="text-slate-700 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none space-y-2 text-slate-700">
              <li>📧 <a href="mailto:support@jobion.com" className="text-primary-600 hover:underline">support@jobion.com</a></li>
              <li>📍 B-30, Block-B, Sector-72, Noida</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link to="/terms" className="text-primary-600 hover:underline mr-4">
            Terms & Conditions
          </Link>
          <Link to="/home" className="text-primary-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
