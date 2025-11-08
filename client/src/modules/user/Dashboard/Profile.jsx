import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Profile & Resume</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader><CardTitle>Basics</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Full name" />
            <Input placeholder="Email" />
            <Input placeholder="Phone" />
            <Input placeholder="Location" />
            <select className="rounded-xl border p-2 text-sm">
              <option>Experience</option><option>Student</option><option>Fresher (0 yrs)</option><option>1–2 yrs</option>
            </select>
            <select className="rounded-xl border p-2 text-sm">
              <option>Work mode preference</option><option>Remote</option><option>Hybrid</option><option>Office</option>
            </select>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Resume URL" />
            <Button className="w-full">Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
