import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignIn() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to HireSpark</CardTitle>
          <p className="text-sm text-slate-600">Welcome back! Enter your details.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="rounded" /> Remember me</label>
            <a href="/forgot" className="text-slate-700 hover:underline">Forgot password?</a>
          </div>
          <Button className="w-full">Sign In</Button>
          <Button variant="secondary" className="w-full">Continue with Google</Button>
          <p className="text-sm text-center text-slate-600">
            No account? <a className="hover:underline" href="/sign-up">Create one</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
