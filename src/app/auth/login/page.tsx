import { LoginForm } from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen-with-header items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
