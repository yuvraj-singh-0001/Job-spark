import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function RefundCancellation() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">💰 Refund & Cancellation Policy</h1>
          <p className="text-slate-600">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">General Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              HireSpark is currently a <strong>free platform</strong> for both candidates and recruiters. We do not charge any fees for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Creating an account</li>
              <li>Posting job listings</li>
              <li>Applying to jobs</li>
              <li>Viewing candidate profiles</li>
              <li>Using basic platform features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Future Paid Services</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If HireSpark introduces paid services in the future (such as premium job postings, featured listings, or premium candidate access), the following refund policy will apply:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li><strong>Refund Requests:</strong> Must be submitted within 7 days of purchase</li>
              <li><strong>Processing Time:</strong> Refunds will be processed within 14 business days</li>
              <li><strong>Eligibility:</strong> Refunds are only available for unused services that have not been activated</li>
              <li><strong>Partial Refunds:</strong> May be provided on a pro-rata basis for partially used services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cancellation Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Users may cancel their accounts at any time through their account settings. Upon cancellation:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Your account and profile will be deactivated</li>
              <li>Active job postings will be removed</li>
              <li>Your data will be retained for 30 days before permanent deletion</li>
              <li>You may request immediate data deletion by contacting support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Non-Refundable Items</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Services that have been fully utilized or activated</li>
              <li>Featured job listings that have already been published</li>
              <li>Premium subscriptions that have been active for more than 7 days</li>
              <li>Any services used in violation of our Terms & Conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Dispute Resolution</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any concerns about charges or require assistance with refunds, please contact our support team. We are committed to resolving all disputes fairly and promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              For refund or cancellation requests, please contact us:
            </p>
            <ul className="list-none space-y-2 text-slate-700">
              <li>📧 <a href="mailto:support@hirespark.com" className="text-blue-600 hover:underline">support@hirespark.com</a></li>
              <li>📍 B-30, Block-B, Sector-72, Noida</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link to="/terms" className="text-blue-600 hover:underline mr-4">
            Terms & Conditions
          </Link>
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
