import { Building2, MapPin, Clock, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/jobs/${id}`);
        if (!alive) return;
        if (data.ok && data.job) {
          setJob(data.job);
        } else {
          setError(data.message || 'Job not found');
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load job');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading job...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  const skills = job.tags || [];
  const responsibilities = job.responsibilities || [];
  const qualifications = job.qualifications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-3 text-sm text-slate-600">
          <a href="/jobs" className="hover:underline">Jobs</a> / <span>{job.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold">{job.title}</h1>
        <p className="mt-1 text-slate-600 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1"><Building2 size={16}/> {job.company}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Clock size={14}/> {job.type}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Briefcase size={14}/> {job.type}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><GraduationCap size={14}/> {job.experiance}</span>
        </p>

        <Card className="mt-6 rounded-2xl">
          <CardHeader><CardTitle>About the role</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>{job.description}</p>
            <div>
              <p className="font-semibold mb-1">Responsibilities</p>
              <ul className="list-disc pl-5 space-y-1">
                {responsibilities.length ? responsibilities.map((r) => <li key={r}>{r}</li>) : <li>Responsibilities not provided</li>}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Qualifications</p>
              <ul className="list-disc pl-5 space-y-1">
                {qualifications.length ? qualifications.map((q) => <li key={q}>{q}</li>) : <li>Qualifications not provided</li>}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <aside>
        <Card className="sticky top-24 rounded-2xl">
          <CardHeader><CardTitle>Apply to this job</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Compensation</span><span className="font-semibold">{job.salary || 'NA'}</span></div>
              <div className="flex justify-between"><span>Work Mode</span><span className="font-semibold">{job.type}</span></div>
              <div className="flex justify-between"><span>Experience</span><span className="font-semibold">{job.experiance}</span></div>
            </div>
            <div className="mt-4 space-y-2">
              <Input placeholder="Your name" />
              <Input placeholder="Email" />
              <Input placeholder="Resume link" />
              <Button className="w-full">Quick Apply</Button>
              <Button variant="secondary" className="w-full">Save</Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
