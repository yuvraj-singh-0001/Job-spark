import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-12 bg-slate-950 border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand / description */}
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center">
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Hire<span className="text-blue-400">Spark</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs">
              A modern hiring platform that helps companies and candidates connect
              faster and more fairly.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition-colors">
                  Companies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-3">
              Stay in the loop
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Get curated job alerts and hiring insights in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-2 max-w-xs"
            >
              <div className="flex rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-xs bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800 pt-4">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} HireSpark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;