// Shared constants and data for the guest home page
// Design System Colors
export const PRIMARY = "#1769E0";
export const PRIMARY_LIGHT = "#2E8CFF";
export const CHIP_BG = "#E8F1FF";
export const BG = "#F5F7FA";
export const WHITE = "#FFFFFF";
export const TEXT_DARK = "#111111";
export const TEXT_MUTED = "#555555";
export const BORDER = "#E5E7EB";
export const HIGHLIGHT = "#F7C948";

// Legacy constants (for backward compatibility)
export const PRIMARY_BLUE = PRIMARY;
export const LIGHT_GREY_BG = BG;
export const CTA_GREEN = PRIMARY;



export const jobCategories = [
  {
    id: "fresher",
    label: "Fresher Jobs",
    count: 1170000,
    icon: "userPlus",
    headline: "11,70,000+ Vacancies",
    description: "No / less experience required",
  },
  {
    id: "full-time",
    label: "Full-time Jobs",
    count: 2500000,
    icon: "briefcase",
    headline: "25,00,000+ Vacancies",
    description: "Full-time employment opportunities",
  },
  {
    id: "part-time",
    label: "Part-time Jobs",
    count: 1960000,
    icon: "clock",
    headline: "19,60,000+ Vacancies",
    description: "Part time jobs for flexible hours",
  },
  {
    id: "internship",
    label: "Internship",
    count: 370000,
    icon: "arrowRight",
    headline: "3,70,000+ Vacancies",
    description: "Internship opportunities for students",
  },
  {
    id: "remote",
    label: "Remote Jobs",
    count: 260000,
    icon: "home",
    headline: "2,60,000+ Vacancies",
    description: "Work from home jobs",
  },
  {
    id: "office-data-entry",
    label: "Office / Data Entry Jobs",
    count: 380000,
    icon: "building",
    headline: "3,80,000+ Vacancies",
    description: "Back‑office, computer & data work",
  },
  {
    id: "it-jobs",
    label: "IT Jobs",
    count: 890000,
    icon: "briefcase",
    headline: "8,90,000+ Vacancies",
    description: "Information technology positions",
  },
  {
    id: "noida",
    label: "Jobs in Noida",
    count: 450000,
    icon: "home",
    headline: "4,50,000+ Vacancies",
    description: "Job opportunities in Noida",
  },
  {
    id: "delivery",
    label: "Delivery Jobs",
    count: 540000,
    icon: "send",
    headline: "5,40,000+ Vacancies",
    description: "Delivery partner roles",
  },
  {
    id: "customer-care-telecaller",
    label: "Customer Care / Telecaller Jobs",
    count: 290000,
    icon: "briefcase",
    headline: "2,90,000+ Vacancies",
    description: "Customer service and calling jobs",
  },
];

// Category → filters mapping (used to prefill Jobs filters via category query)
export const CATEGORY_FILTER_MAPPING = {
  fresher: {
    label: "Fresher Jobs",
    filters: {
      experience: "0", // matches EXPERIENCE_OPTIONS value
    },
  },
  "full-time": {
    label: "Full-time Jobs",
    filters: {
      jobTypes: ["full-time"], // matches JOB_TYPE_OPTIONS value
    },
  },
  "part-time": {
    label: "Part-time Jobs",
    filters: {
      jobTypes: ["part-time"],
    },
  },
  internship: {
    label: "Internship",
    filters: {
      jobTypes: ["internship"],
    },
  },
  remote: {
    label: "Remote Jobs",
    filters: {
      workModes: ["remote"], // matches WORK_MODE_OPTIONS value
    },
  },
  "office-data-entry": {
    label: "Office / Data Entry Jobs",
    filters: {
      workModes: ["office"],
      roles: ["Data Entry", "Back Office"],
    },
  },
  "it-jobs": {
    label: "IT Jobs",
    filters: {
      roles: ["Developer", "Engineer", "IT"],
    },
  },
  noida: {
    label: "Jobs in Noida",
    filters: {
      cities: ["Noida"],
    },
  },
  delivery: {
    label: "Delivery Jobs",
    filters: {
      roles: ["Delivery"],
    },
  },
  "customer-care-telecaller": {
    label: "Customer Care / Telecaller Jobs",
    filters: {
      roles: ["Customer Care", "Telecaller", "Call Center"],
    },
  },
};

