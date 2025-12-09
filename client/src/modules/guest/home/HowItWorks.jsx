import React, { useEffect, useRef, useState } from "react";
import { BG } from "./data";

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
      style={{ backgroundColor: '#FFFFFF' }}
      className={`transition-all duration-1000 ease-out min-h-screen flex items-center ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-16 lg:px-20 py-12 md:py-16" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="max-w-2xl mb-8">
          <h2 className="text-[24px] font-bold mb-2 leading-[1.4]" style={{ color: '#111111' }}>
            How it works
          </h2>
          <p className="text-[14px] leading-[1.5]" style={{ color: '#555555' }}>
            Same simple flow for job seekers and recruiters. No confusing steps.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-full bg-white border p-1" style={{ borderColor: '#E5E7EB' }}>
          <button
            type="button"
            onClick={() => setTab("seekers")}
            className={`px-4 sm:px-6 py-1.5 text-[14px] font-semibold rounded-full transition-colors ${
              tab === "seekers"
                ? "text-white shadow-soft"
                : ""
            }`}
            style={tab === "seekers" ? { backgroundColor: '#1769E0' } : { color: '#555555' }}
          >
            For Job Seekers
          </button>
          <button
            type="button"
            onClick={() => setTab("recruiters")}
            className={`px-4 sm:px-6 py-1.5 text-[14px] font-semibold rounded-full transition-colors ${
              tab === "recruiters"
                ? "text-white shadow-soft"
                : ""
            }`}
            style={tab === "recruiters" ? { backgroundColor: '#1769E0' } : { color: '#555555' }}
          >
            For Recruiters
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ gap: '16px' }}>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="border rounded-[12px] bg-white shadow-soft"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div className="p-4 space-y-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-semibold" style={{ backgroundColor: '#E8F1FF', color: '#1769E0' }}>
                  {index + 1}
                </div>
                <h3 className="text-[18px] font-semibold leading-[1.4]" style={{ color: '#111111' }}>
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.5]" style={{ color: '#555555' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

