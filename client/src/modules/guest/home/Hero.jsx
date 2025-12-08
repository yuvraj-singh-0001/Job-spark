import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight } from "lucide-react";
import homeIllustration from "../../../assets/home.svg";
import { CTA_GREEN, PRIMARY_BLUE, jobCategories } from "./data";

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
      className={`relative bg-white transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-12 lg:py-16 lg:min-h-[calc(100vh-120px)] grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left copy */}
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Jobs for you. Talent for companies.
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find local & remote jobs{" "}
            <span className="text-blue-600">in minutes</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Search by city, role or skill. Apply in a few taps. No confusing
            steps. Real openings from verified companies, not spam.
          </p>

          {/* Advanced search */}
          <div className="border border-slate-200 shadow-lg rounded-2xl bg-white">
            <div className="p-4 sm:p-5 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="relative">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Job title or skill
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      <Search size={18} className="text-slate-400" />
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
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg text-sm max-h-52 overflow-auto">
                        {filteredSuggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(s);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      City / area
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      <MapPin size={18} className="text-slate-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setActiveField("location")}
                        placeholder="e.g. Delhi, Remote"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onFocus={() => setActiveField("category")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-sm outline-none text-slate-700"
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
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      onFocus={() => setActiveField("experience")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-sm outline-none text-slate-700"
                    >
                      <option value="">Any</option>
                      <option value="fresher">Fresher / Entry</option>
                      <option value="mid">2–5 years</option>
                      <option value="senior">5+ years</option>
                    </select>
                  </div>
                </div>

                {/* Filter chips */}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => removeChip(chip.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        <span>{chip.value}</span>
                        <span className="text-[10px] text-blue-500">✕</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all px-4 py-2 rounded-lg"
                      style={{ backgroundColor: PRIMARY_BLUE }}
                    >
                      Search Jobs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setLocation("");
                        setCategory("");
                        setExperience("");
                        setChips([]);
                      }}
                      className="hidden sm:inline-flex border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/post-job" className="flex-1">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: CTA_GREEN }}
              >
                Post a Job
                <ChevronRight size={16} />
              </button>
            </Link>
            <Link to="/jobs" className="flex-1">
              <button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 font-semibold flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors">
                Browse Jobs
                <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* Right side – hero illustration image */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-xl lg:max-w-2xl lg:mt-12">
            <img
              src={homeIllustration}
              alt="People exploring new career opportunities"
              className="w-full h-auto rounded-3xl object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

