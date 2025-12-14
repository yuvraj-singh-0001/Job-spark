import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Clock,
  Search,
  ArrowUpRight,
} from "lucide-react";
import api from "../../../components/apiconfig/apiconfig";

const CITY_OPTIONS = [
  "Delhi",
  "Ghaziabad",
  "Noida",
  "Faridabad",
  "Greater Noida",
  "Gurgaon",
];

const ROLE_OPTIONS = [
  { label: "Trainer", value: "trainer" },
  { label: "Recruiter / HR / Admin", value: "recruiter" },
  { label: "Event Management", value: "event management" },
  { label: "Back Office / Data Entry", value: "data entry" },
  { label: "Content Writer", value: "content writer" },
  { label: "Receptionist", value: "receptionist" },
  { label: "+ 1 More", value: "assistant" },
];

const SALARY_OPTIONS = [
  { label: "More than ₹ 5000", value: 5000 },
  { label: "More than ₹ 10000", value: 10000 },
  { label: "More than ₹ 20000", value: 20000 },
  { label: "More than ₹ 30000", value: 30000 },
  { label: "More than ₹ 40000", value: 40000 },
  { label: "More than ₹ 50000", value: 50000 },
];

const OTHER_CATEGORIES = [
  "Event Management (304)",
  "Back Office / Data Entry (12258)",
  "Content Writer (419)",
  "Receptionist (2481)",
  "Accountant (7733)",
];

const pageSize = 6;

const parseSalaryValue = (salary) => {
  if (!salary) return null;
  const numeric = `${salary}`.replace(/[^0-9]/g, "");
  if (!numeric) return null;
  return Number(numeric);
};

const formatSalary = (salary) => {
  const numeric = parseSalaryValue(salary);
  if (!numeric) return salary || "";
  return `₹ ${numeric.toLocaleString("en-IN")}`;
};

export default function Jobs() {
  const [jobList, setJobList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedStatus, setSavedStatus] = useState({});
  const [page, setPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const locationHook = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/session");
        if (alive) setIsAuthenticated(Boolean(data?.user));
      } catch (err) {
        if (alive) setIsAuthenticated(false);
      } finally {
        if (alive) setAuthChecked(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(locationHook.search);
    const searchQuery = searchParams.get("search") || "";
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [locationHook]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/jobs", { params: { limit: 100 } });

        if (!alive) return;

        if (data.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j) => ({
            id: j._id || j.id,
            title: j.title || j.jobTitle || "",
            company: j.company || j.companyName || "",
            location: j.location || j.jobLocation || "",
            type: j.type || j.jobType || "Full Time",
            mode: j.mode || j.workMode || j.workType || "",
            experience: j.experience || j.experiance || j.exp || "",
            skills: j.skills || j.tags || [],
            salary: j.salary || "",
            vacancies: j.vacancies || "",
            description: j.description || "",
          }));
          setJobList(mapped);
          setFiltered(mapped);

          await checkSavedStatusForJobs(mapped);
        }
      } catch (err) {
        setError((err && err.message) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const checkSavedStatusForJobs = async (jobs) => {
    const status = {};
    for (const job of jobs) {
      try {
        const response = await api.get(`/jobs/save/${job.id}`);
        status[job.id] = response.data.isSaved;
      } catch (error) {
        status[job.id] = false;
      }
    }
    setSavedStatus(status);
  };

  const redirectToLoginForSave = (jobId) => {
    try {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("postLoginSaveJobId", jobId);
      localStorage.setItem("postLoginRedirect", currentPath || "/jobs");
    } catch (err) {
      // fail silently if storage not available
    }
    navigate("/sign-in");
  };

  const toggleSaveJob = async (jobId, isCurrentlySaved) => {
    if (!isAuthenticated) {
      // If auth status is still being checked, try one more quick check
      if (!authChecked) {
        try {
          const { data } = await api.get("/auth/session");
          if (data?.user) {
            setIsAuthenticated(true);
          } else {
            redirectToLoginForSave(jobId);
            return;
          }
        } catch (err) {
          redirectToLoginForSave(jobId);
          return;
        }
      } else {
        redirectToLoginForSave(jobId);
        return;
      }
    }

    try {
      if (isCurrentlySaved) {
        await api.delete(`/jobs/save/${jobId}`);
        setSavedStatus((prev) => ({ ...prev, [jobId]: false }));
      } else {
        await api.post(`/jobs/save/${jobId}`);
        setSavedStatus((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      alert(
        "Error saving job: " +
        (error.response?.data?.message || error.message || "Try again")
      );
    }
  };

  const applyFilters = useCallback(() => {
    if (jobList.length === 0) return;

    let data = [...jobList];
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      data = data.filter((job) => {
        const textBucket = [
          job.title,
          job.company,
          job.location,
          job.description,
          ...(job.skills || []),
        ]
          .join(" ")
          .toLowerCase();
        return textBucket.includes(query);
      });
    }

    if (selectedCities.length) {
      data = data.filter((job) =>
        selectedCities.some((city) =>
          (job.location || "").toLowerCase().includes(city.toLowerCase())
        )
      );
    }

    if (selectedRoles.length) {
      data = data.filter((job) => {
        const haystack = `${job.title} ${job.company} ${(job.skills || []).join(
          " "
        )}`.toLowerCase();
        return selectedRoles.some((role) =>
          haystack.includes(role.toLowerCase())
        );
      });
    }

    if (salaryFilter) {
      const threshold = Number(salaryFilter);
      data = data.filter((job) => {
        const numeric = parseSalaryValue(job.salary);
        if (!numeric) return true; // keep jobs without salary info
        return numeric >= threshold;
      });
    }

    setFiltered(data);
    setPage(1);

    const params = new URLSearchParams();
    if (query) params.set("search", query);
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : "/jobs";
    window.history.replaceState({}, "", newUrl);
  }, [jobList, searchTerm, selectedCities, selectedRoles, salaryFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = (page - 1) * pageSize + paginated.length;

  const hasSidebarFilters =
    selectedCities.length > 0 ||
    selectedRoles.length > 0 ||
    Boolean(salaryFilter);

  const toggleValue = (value, setFn) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCities([]);
    setSelectedRoles([]);
    setSalaryFilter("");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <p className="text-sm text-slate-600">
              {filtered.length || jobList.length} jobs near you
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Find Jobs
            </h1>
          </div>
          <div className="w-full md:w-[420px]">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={18} className="text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="flex-1 text-sm outline-none"
                placeholder="Search jobs here"
              />
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6 lg:gap-8">
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>
              {hasSidebarFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">City</p>
                <div className="flex flex-wrap gap-2">
                  {CITY_OPTIONS.map((city) => {
                    const active = selectedCities.includes(city);
                    return (
                      <button
                        key={city}
                        onClick={() => toggleValue(city, setSelectedCities)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${active
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Job Role(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => {
                    const active = selectedRoles.includes(role.value);
                    return (
                      <button
                        key={role.value}
                        onClick={() => toggleValue(role.value, setSelectedRoles)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${active
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Salary</p>
                <div className="space-y-2">
                  {SALARY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="salary"
                        value={opt.value}
                        checked={String(salaryFilter) === String(opt.value)}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        className="text-blue-600"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                Showing {startIdx}–{endIdx} of {filtered.length} roles
              </span>
              {hasSidebarFilters && (
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full">
                  Filters applied
                </span>
              )}
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-2xl bg-white p-10 text-center text-slate-500 text-sm shadow-sm">
                Loading roles…
              </div>
            ) : paginated.length === 0 ? (
              <div className="border border-slate-200 rounded-2xl bg-white p-10 text-center text-slate-500 text-sm shadow-sm">
                No roles match these filters.
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((r) => (
                  <article
                    key={r.id}
                    className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <button
                      onClick={() => toggleSaveJob(r.id, savedStatus[r.id])}
                      className="absolute right-4 top-4 text-slate-500 hover:text-blue-600"
                      aria-label={savedStatus[r.id] ? "Unsave job" : "Save job"}
                    >
                      {savedStatus[r.id] ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase tracking-[0.08em]">
                            Work from home
                          </p>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {r.title || "Untitled role"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            {r.company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 size={16} /> {r.company}
                              </span>
                            )}
                            {r.location && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin size={16} /> {r.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          {r.salary && (
                            <p className="text-lg font-semibold text-slate-900">
                              {formatSalary(r.salary)}
                              <span className="text-sm font-medium text-slate-600"> /Month</span>
                            </p>
                          )}
                          {r.vacancies && (
                            <p className="text-xs text-slate-500">{r.vacancies} vacancies</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                        {r.type && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                            <Briefcase size={14} /> {r.type}
                          </span>
                        )}
                        {r.mode && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                            <Clock size={14} /> {r.mode}
                          </span>
                        )}
                        {r.experience && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                            <GraduationCap size={14} /> {r.experience}
                          </span>
                        )}
                        {r.vacancies && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                            {r.vacancies} Vacancies
                          </span>
                        )}
                      </div>

                      {r.skills && r.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border border-slate-200 text-slate-600 bg-slate-50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-blue-700">
                          <span className="inline-flex items-center bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                            New
                          </span>
                          {r.vacancies && (
                            <span className="inline-flex items-center bg-orange-50 border border-orange-100 px-2 py-1 rounded-full text-orange-700">
                              {r.vacancies} Vacancies
                            </span>
                          )}
                          <span className="inline-flex items-center bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full text-emerald-700">
                            Full Time
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/jobs/${r.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                          >
                            View details
                            <ArrowUpRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const active = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 text-xs md:text-sm rounded-full border ${active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                disabled={page === totalPages || filtered.length === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>

            <div className="mt-6 border border-slate-200 bg-white rounded-2xl p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                Explore jobs in other categories
              </p>
              <div className="flex flex-wrap gap-2">
                {OTHER_CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 px-3 py-1"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

