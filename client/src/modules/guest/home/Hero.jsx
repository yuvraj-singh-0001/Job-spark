import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { PRIMARY, jobCategories } from "./data";

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

export default function Hero() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [chips, setChips] = useState([]);
  const [activeField, setActiveField] = useState("title");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const suggestions = useMemo(
    () => [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Engineer",
      "Product Manager",
      "Marketing Manager",
      "Data Analyst",
      "UI/UX Designer",
    ],
    []
  );

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 5);
  }, [searchTerm, suggestions]);

  const addChip = (label, field) => {
    if (!label) return;
    const value = label.trim();
    if (!value) return;
    const key = `${field}:${value}`;
    if (chips.some((c) => c.key === key)) return;
    setChips((prev) => [...prev, { key, field, value }]);
  };

  const removeChip = (key) => {
    setChips((prev) => prev.filter((c) => c.key !== key));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (experience) params.set("experience", experience);
    chips.forEach((chip) => {
      params.append(`chip_${chip.field}`, chip.value);
    });
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    addChip(value, "title");
    setShowSuggestions(false);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative bg-white transition-all duration-1000 ease-out min-h-screen flex items-center justify-center ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div
        className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-16 lg:px-20 
             py-10 md:py-12 lg:py-16 
             flex flex-col items-center justify-center text-center gap-6">
        <div className="space-y-5 w-full flex flex-col items-center">

          <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold tracking-tight leading-[1.4]" style={{ color: '#111111' }}>
            Trusted Opportunities for {" "}
            <span style={{ color: '#1769E0' }}>Fresh Talent</span>
          </h1>


          {/* Advanced search */}
          <div className="bg-gray-200 rounded-[5px] w-full max-w-5xl mx-auto">
            <div className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-4 gap-1">
                  <div className="relative">
                    <label className="text-[13px] sm:text-[14px] font-medium mb-1.5 block" style={{ color: '#555555' }}>
                      Job title or skill
                    </label>
                    <div className="flex items-center gap-3 rounded-[5px] px-3.5 py-3 bg-gray-50">
                      <Search size={18} style={{ color: '#1769E0', strokeWidth: 2 }} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setActiveField("title");
                          setShowSuggestions(true);
                        }}
                        onFocus={() => {
                          setActiveField("title");
                          setShowSuggestions(true);
                        }}
                        placeholder="e.g. Delivery, Telecaller"
                        className="w-full bg-transparent text-[14px] sm:text-[15px] outline-none border-none"
                        style={{ color: '#111111' }}
                      />
                    </div>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute z-20 mt-1 w-full bg-white rounded-[10px] shadow-soft text-[14px] sm:text-[15px] max-h-52 overflow-auto border border-gray-200">
                        {filteredSuggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(s);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-chip-bg transition-colors"
                            style={{ color: '#111111' }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[13px] sm:text-[14px] font-medium mb-1.5 block" style={{ color: '#555555' }}>
                      City / area
                    </label>
                    <div className="flex items-center gap-2 rounded-[5px] px-3.5 py-3 bg-gray-50">
                      <MapPin size={18} style={{ color: '#1769E0', strokeWidth: 2 }} />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setActiveField("location")}
                        placeholder="e.g. Delhi, Remote"
                        className="w-full bg-transparent text-[14px] sm:text-[15px] outline-none border-none"
                        style={{ color: '#111111' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] sm:text-[14px] font-medium mb-1.5 block" style={{ color: '#555555' }}>
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onFocus={() => setActiveField("category")}
                      className="w-full rounded-[5px] px-3.5 py-3 bg-gray-50 text-[14px] sm:text-[15px] outline-none border-none"
                      style={{ color: '#111111' }}
                    >
                      <option value="">All categories</option>
                      {jobCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[13px] sm:text-[14px] font-medium mb-1.5 block" style={{ color: '#555555' }}>
                      Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      onFocus={() => setActiveField("experience")}
                      className="w-full rounded-[5px] px-3.5 py-3 bg-gray-50 text-[14px] sm:text-[15px] outline-none border-none"
                      style={{ color: '#111111' }}
                    >
                      <option value="">Any</option>
                      <option value="fresher">Fresher / Entry</option>
                      <option value="mid">0–2 years</option>
                      <option value="senior">2+ years</option>
                    </select>
                  </div>
                </div>

                {/* Filter chips */}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {chips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => removeChip(chip.key)}
                        className="inline-flex items-center gap-1.5 rounded-[20px] text-[13px] sm:text-[14px] font-medium transition-colors"
                        style={{
                          backgroundColor: '#E8F1FF',
                          color: '#1769E0',
                          padding: '7px 16px'
                        }}
                      >
                        <span>{chip.value}</span>
                        <span className="text-[11px]" style={{ color: '#1769E0' }}>✕</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    className="text-white font-semibold shadow-soft hover:shadow-md transition-all rounded-[10px]"
                    style={{
                      backgroundColor: '#1769E0',
                      padding: '10px 32px',
                      fontSize: '15px'
                    }}
                  >
                    Search Jobs
                  </button>

                </div>
              </form>
            </div>
          </div>


        </div>

      </div>
    </section>
  );
}

