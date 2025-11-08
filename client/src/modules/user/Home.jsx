import { Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function Home() {
  return (
    <div>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-orange-500 text-white grid place-items-center">
              <Sparkles size={18} />
            </div>
            <b>HireSpark</b>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/jobs">Jobs</a>
            <a href="/companies">Companies</a>
            <a href="/career-kit">Career Kit</a>
            <a href="/alerts">Alerts</a>
          </nav>
          <div className="flex gap-2">
            <a href="/sign-in"><Button variant="ghost">Sign in</Button></a>
            <a href="/sign-up"><Button>Get Job Alerts</Button></a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Card className="rounded-3xl shadow-sm">
          <CardHeader><CardTitle className="text-xl">Welcome to HireSpark</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Find internships & entry-level jobs (0–2 yrs). Remote, hybrid, and office roles—curated for students & freshers.
            </p>
            <div className="flex gap-3">
              <a href="/jobs"><Button>Find Jobs</Button></a>
              <a href="/sign-up"><Button variant="secondary">Create Free Profile</Button></a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
