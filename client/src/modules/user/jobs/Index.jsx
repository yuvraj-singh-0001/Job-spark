import { Building2, MapPin, Briefcase, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function Jobs() {
  const results = [
    { id: 101, title: "Junior Backend Developer", company: "BlueOrbit", loc: "Remote (IN)", mode: "Remote", exp: "0–2 yrs", type: "Full-time", tags: ["Python", "Django", "REST"] },
    { id: 102, title: "Data Analyst Intern", company: "MetricLoop", loc: "Mumbai, IN", mode: "Hybrid", exp: "Student", type: "Internship", tags: ["SQL", "Excel", "PowerBI"] },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Find Jobs</h1>
      <p className="text-slate-600 mb-6">Internships and entry-level roles for students & 0–2 yrs.</p>

      {/* Filters */}
      <div className="grid md:grid-cols-6 gap-3 bg-white p-4 rounded-2xl border mb-6">
        <Input placeholder="Role or skill" className="md:col-span-2" />
        <Input placeholder="Location (Remote, Bengaluru...)" />
        <select className="rounded-xl border p-2 text-sm">
          <option>Experience</option><option>Student</option><option>Fresher (0 yrs)</option><option>1–2 yrs</option>
        </select>
        <select className="rounded-xl border p-2 text-sm">
          <option>Work mode</option><option>Remote</option><option>Hybrid</option><option>Office</option>
        </select>
        <Button>Search</Button>
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-3 gap-5">
        {results.map((r) => (
          <Card key={r.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{r.title}</CardTitle>
              <div className="text-sm text-slate-600 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1"><Building2 size={14}/> {r.company}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={14}/> {r.loc}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Briefcase size={14}/> {r.type}</span>
                <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Clock size={14}/> {r.mode}</span>
                <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><GraduationCap size={14}/> {r.exp}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {r.tags.map((t) => <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>)}
              </div>
              <div className="flex gap-2">
                <a href={`/jobs/${r.id}`} className="flex-1"><Button variant="secondary" className="w-full">View</Button></a>
                <Button className="flex-1">Quick Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
