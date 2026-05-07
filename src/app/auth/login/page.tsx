import { LoginForm } from "@/components/auth/LoginForm";

export default async function Page({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen-with-header items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl={params.callbackUrl} />
      </div>
    </div>
  );
}
