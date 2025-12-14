import { useState, useEffect } from "react";
import api from "../components/apiconfig/apiconfig";

/**
 * Hook to check if recruiter profile exists and is complete
 * @returns {Object} { profile, loading, exists, isComplete }
 */
export function useRecruiterProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkProfile() {
      try {
        const res = await api.get("/recruiter-profile/recruiter");
        if (mounted) {
          const profileData = res.data?.recruiter || null;
          setProfile(profileData);
          setExists(!!profileData);

          // Check if profile is complete (has required fields)
          if (profileData) {
            const hasRequiredFields =
              profileData.company_name &&
              profileData.address_line1 &&
              profileData.city;
            setIsComplete(hasRequiredFields);
          } else {
            setIsComplete(false);
          }
        }
      } catch (err) {
        if (mounted) {
          // 404 means profile doesn't exist
          if (err?.response?.status === 404) {
            setProfile(null);
            setExists(false);
            setIsComplete(false);
          } else {
            // Other errors - assume profile doesn't exist
            setProfile(null);
            setExists(false);
            setIsComplete(false);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading, exists, isComplete };
}

