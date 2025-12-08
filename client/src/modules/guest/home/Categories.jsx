import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Clock, Users, UserPlus, Send, Building2, Briefcase, ArrowRight } from "lucide-react";
import { jobCategories } from "./data";

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

const iconMap = {
  home: <MapPin size={22} />,
  clock: <Clock size={22} />,
  users: <Users size={22} />,
  userPlus: <UserPlus size={22} />,
  send: <Send size={22} />,
  building: <Building2 size={22} />,
  briefcase: <Briefcase size={22} />,
  arrowRight: <ArrowRight size={22} />,
};

export default function Categories() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const navigate = useNavigate();

  const handleClick = (categoryId) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section
      ref={sectionRef}
      className={`bg-slate-50 transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Browse by category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Tap a card to see jobs only from that category.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleClick(cat.id)}
              className="group text-left"
            >
              <div className="h-full border border-slate-200 rounded-2xl shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all bg-slate-50/60">
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-700 border border-blue-100">
                    {iconMap[cat.icon] || <Briefcase size={22} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {cat.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cat.count.toLocaleString()} open roles
                    </p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

