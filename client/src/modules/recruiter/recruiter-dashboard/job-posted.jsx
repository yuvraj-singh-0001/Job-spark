import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Navbar from "../../../components/ui/Navbar";

export default function jobPosted() {
  const saved = [
    { id: 1, title: "Software Engineer Intern", company: "CloudMints", loc: "Remote", mode: "Remote" },
    { id: 2, title: "Associate Product Designer", company: "PixelPath", loc: "Gurugram", mode: "Office" },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🟦 Navbar at the top */}
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4">posted jobs </h1>
        <div className="space-y-3">
          {saved.map((j) => (
            <Card key={j.id} className="rounded-2xl">
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{j.title}</p>
                  <p className="text-sm text-slate-600">{j.company} • {j.loc} • {j.mode}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">View details </Button>
                  <Button>View Resume</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
