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
  home: MapPin,
  clock: Clock,
  users: Users,
  userPlus: UserPlus,
  send: Send,
  building: Building2,
  briefcase: Briefcase,
  arrowRight: ArrowRight,
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
      className={`transition-all duration-1000 ease-out min-h-screen flex items-center ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ backgroundColor: '#F7FAFF' }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-16 lg:px-20 py-12 md:py-16" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[24px] font-bold leading-[1.4]" style={{ color: '#111111' }}>
              Browse by category
            </h2>
            <p className="text-[14px] leading-[1.5] mt-1" style={{ color: '#555555' }}>
              Tap a card to see jobs only from that category.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gap: '16px' }}>
          {jobCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleClick(cat.id)}
              className="group text-left"
            >
              <div className="h-full border rounded-[12px] shadow-soft group-hover:shadow-lg group-hover:-translate-y-1 transition-all bg-white" style={{ borderColor: '#E5E7EB' }}>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center border" style={{ borderColor: '#E5E7EB', color: '#1769E0' }}>
                    {iconMap[cat.icon] ? React.createElement(iconMap[cat.icon], { size: 22, style: { color: '#1769E0', strokeWidth: 2 } }) : <Briefcase size={22} style={{ color: '#1769E0', strokeWidth: 2 }} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[18px] font-semibold leading-[1.4]" style={{ color: '#111111' }}>
                      {cat.label}
                    </p>
                    <p className="text-[14px] leading-[1.5] mt-0.5" style={{ color: '#555555' }}>
                      {cat.count.toLocaleString()} open roles
                    </p>
                  </div>
                  <ChevronRight size={20} className="transition-colors group-hover:opacity-70" style={{ color: '#1769E0', strokeWidth: 2 }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

