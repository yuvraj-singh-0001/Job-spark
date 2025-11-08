import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignUp() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <p className="text-sm text-slate-600">Students & freshers (0–2 yrs) welcome.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Full name" />
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <select className="rounded-xl border p-2 w-full text-sm">
            <option>I'm a Candidate</option><option>I'm an Employer</option>
          </select>
          <Button className="w-full">Create Account</Button>
          <p className="text-xs text-slate-500">By signing up, you agree to our Terms and Privacy Policy.</p>
        </CardContent>
      </Card>
    </div>
  );
}
