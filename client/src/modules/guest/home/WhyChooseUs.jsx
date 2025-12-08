import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

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

export default function WhyChooseUs() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const items = [
    {
      title: "Simple job search",
      desc: "Clean cards and filters so you can decide quickly.",
    },
    {
      title: "Smart filters",
      desc: "Filter by city, category, salary range and more.",
    },
    {
      title: "Verified companies",
      desc: "We try to show jobs from trusted brands and partners.",
    },
    {
      title: "Quick apply",
      desc: "Save your basic details and reuse them for each job.",
    },
    {
      title: "Profile & resume help",
      desc: "Get simple tips to improve your profile and resume.",
    },
    {
      title: "Alerts for new jobs",
      desc: "Turn on alerts so you never miss a matching job.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`bg-white transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Why people like using JobSpark
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Short steps, clear cards and simple language for every user.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all bg-white"
            >
              <div className="p-5 space-y-3">
                <CheckCircle2 className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

