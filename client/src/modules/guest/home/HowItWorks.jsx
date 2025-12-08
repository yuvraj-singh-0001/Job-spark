import React, { useEffect, useRef, useState } from "react";
import { LIGHT_GREY_BG } from "./data";

function useFadeInOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

export default function HowItWorks() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [tab, setTab] = useState("seekers");
  const seekerSteps = [
    { title: "Search", desc: "Find jobs by city, role or skill." },
    { title: "Apply", desc: "Send your details in a few taps." },
    { title: "Interview", desc: "Talk to the recruiter or company." },
    { title: "Get hired", desc: "Join and start earning faster." },
  ];
  const recruiterSteps = [
    { title: "Post job", desc: "Share your opening with basic details." },
    { title: "Review", desc: "See matching candidates in one list." },
    { title: "Interview", desc: "Call or message shortlisted profiles." },
    { title: "Hire", desc: "Close the role and grow your team." },
  ];
  const steps = tab === "seekers" ? seekerSteps : recruiterSteps;

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: LIGHT_GREY_BG }}
      className={`transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Same simple flow for job seekers and recruiters. No confusing steps.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-full bg-white border border-slate-200 p-1">
          <button
            type="button"
            onClick={() => setTab("seekers")}
            className={`px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
              tab === "seekers"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            For Job Seekers
          </button>
          <button
            type="button"
            onClick={() => setTab("recruiters")}
            className={`px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
              tab === "recruiters"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            For Recruiters
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="border border-slate-200 rounded-2xl bg-white shadow-sm"
            >
              <div className="p-5 space-y-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

